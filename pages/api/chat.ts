import type { NextApiRequest, NextApiResponse } from 'next';
import { SYSTEM_PROMPT } from '../../constants';
import { searchProducts, findSpecificProduct } from '../../products';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body as { message?: string; history?: Array<{ role: string; parts: any[] }> };

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY' });
  }

  // Convert history to OpenRouter format - xAI doesn't support conversation history well
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Licious AI Assistant'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages,
        temperature: 0.6,
        max_tokens: 5000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    if (!choice) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    let text = choice.message?.content || '';

    if (!text) {
      text = "I'm Haya, your Licious assistant. How can I help you today?";
    }

    // Check if user wants to see products
    const lowerMessage = message.toLowerCase();
    const productKeywords = ['show', 'see', 'view', 'buy', 'have', 'available', 'products', 'chicken', 'mutton', 'fish', 'salmon', 'eggs', 'prawns', 'meat', 'fresh', 'get', 'want', 'need', 'any', 'do you', 'got', 'can i', 'take', 'give'];
    let products = null;
    
    // Check if user is confirming (yes/yas/ok, etc) a previous request
    const isConfirming = /^(yes|yas|yup|yeah|ok|sure|alright|absolutely|definitely|please|proceed|show|go ahead|ok|oks|y)$/i.test(lowerMessage.trim());
    
    if (isConfirming && history && history.length > 0) {
      // Look back in history to find the product request
      for (let i = history.length - 1; i >= 0; i--) {
        const historyMessage = history[i];
        if (historyMessage.role === 'user') {
          const prevUserMsg = historyMessage.parts?.[0]?.text || '';
          const prevLower = prevUserMsg.toLowerCase();
          
          // Check if previous user message was asking for a product
          const hasProductKeywords = productKeywords.some(keyword => prevLower.includes(keyword));
          if (hasProductKeywords) {
            // Extract product query from previous message
            let query = prevLower
              .replace(/show me|see me|view|display|do you have|have you got|available|fresh|can i get|give me|show|see|you have|got any|take|give me|want|need|can you/gi, '')
              .trim();
            
            // Remove common question words
            query = query.replace(/\?|what|which|do|you|any|a |the |some /gi, '').trim();
            
            if (query && query.length > 2) {
              // Try to find the specific product from the previous request
              const specificProduct = findSpecificProduct(query);
              if (specificProduct) {
                products = [specificProduct];
              }
            }
            break;
          }
        }
      }
    }
    
    // If no confirmation follow-up, check current message for product requests
    if (!products) {
      // Check if user is asking for ALL products together
      const isAskingForAll = /all products|show all|all items|what products|all curry|everything|list all|all available|what do you have|what you got/i.test(lowerMessage);
      
      // Check if user is asking for products
      const isAskingForProducts = productKeywords.some(keyword => lowerMessage.includes(keyword)) || 
                                  /\b(recommend|suggest|what|which|best)\b/.test(lowerMessage);
      
      if (isAskingForProducts) {
        // Extract product query from message
        let query = lowerMessage
          .replace(/show me|see me|view|display|do you have|have you got|available|fresh|can i get|give me|show|see|you have|got any|take|give me|want|need|can you/gi, '')
          .trim();
        
        // Remove common question words
        query = query.replace(/\?|what|which|do|you|any|a |the |some /gi, '').trim();
        
        // If query is empty or too vague after removing keywords, don't show products
        if (!query || query.length < 2) {
          if (isAskingForAll) {
            // Only show all if explicitly asked
            const allProducts = searchProducts(lowerMessage);
            if (allProducts.length > 0) {
              products = allProducts;
            }
          }
          // Otherwise no products shown for vague queries
        } else {
          // Try to find a specific product match
          const specificProduct = findSpecificProduct(query);
          if (specificProduct) {
            // User is asking for a specific product - return ONLY that one
            products = [specificProduct];
          } else if (isAskingForAll) {
            // Show all if user explicitly asks for all
            const allProducts = searchProducts(query);
            if (allProducts.length > 0) {
              products = allProducts;
            }
          }
          // Otherwise return null (no products) - don't show random matches
        }
      }
    }

    // If a specific product was found, enhance the response with product details
    if (products && products.length === 1) {
      const product = products[0];
      const lowerQuery = lowerMessage.toLowerCase();
      
      // Check if user is asking about specific details (pieces, how many, pieces count, quantity, pieces per pack, etc)
      const isAskingForDetails = /piece|how many|pieces|count|quantity|pcs|pack size|much|serve|per|weight|price|cost|rate|rupee|₹/i.test(lowerQuery);
      
      if (isAskingForDetails) {
        // Extract pieces information from weight field
        const weightInfo = product.weight;
        let detailsText = `Here are the details for **${product.name}**:\n\n`;
        detailsText += `📦 **Weight/Quantity:** ${weightInfo}\n`;
        detailsText += `💰 **Price:** ${product.price}\n`;
        detailsText += `📝 **Description:** ${product.description}\n`;
        detailsText += `🏷️ **Category:** ${product.category}\n`;
        
        // If the query asks about pieces, emphasize the piece count
        if (/piece|pcs|how many|count/i.test(lowerQuery)) {
          const piecesMatch = weightInfo.match(/(\d+(?:\s*-\s*\d+)?)\s*(?:piece|pcs|pieces|pieces)/i);
          if (piecesMatch) {
            detailsText += `\n✨ **Pieces:** ${piecesMatch[1]} pieces per pack`;
          }
        }
        
        text = detailsText;
      }
    }

    return res.status(200).json({ text, products });
  } catch (error) {
    console.error('Chat API error:', error);
    // Fallback mock response for testing
    return res.status(200).json({ 
      text: "I'm Haya, your Licious assistant. I'm currently experiencing some technical difficulties with my connection. Please try again later or contact support.",
      products: null 
    });
  }
}
