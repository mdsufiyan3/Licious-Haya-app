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
        temperature: 0.6
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
    const productKeywords = ['show', 'see', 'view', 'buy', 'have', 'available', 'products', 'chicken', 'mutton', 'fish', 'salmon', 'eggs', 'prawns', 'meat', 'fresh'];
    let products = null;
    
    // Check if user is asking for ALL products together
    const isAskingForAll = /all products|show all|all items|what products|all curry|everything/i.test(lowerMessage);
    
    if (productKeywords.some(keyword => lowerMessage.includes(keyword))) {
      // Extract product query from message
      let query = lowerMessage
        .replace(/show me|see me|view|display|do you have|have you got|available|fresh|can i get|give me|show|see/gi, '')
        .trim();
      
      // If query is empty after removing keywords, use the original message
      if (!query || query.length < 2) {
        query = lowerMessage;
      }
      
      // ALWAYS try to find a specific product match first
      const specificProduct = findSpecificProduct(query);
      if (specificProduct) {
        // User is asking for a specific product - return ONLY that one, NEVER multiple
        products = [specificProduct];
      } else if (isAskingForAll) {
        // Only show all products if user explicitly asks for "all products"
        const allProducts = searchProducts(query);
        if (allProducts.length > 0) {
          products = allProducts;
        }
      }
      // Otherwise return null (no products) - don't show random matches
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
