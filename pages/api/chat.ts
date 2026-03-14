import type { NextApiRequest, NextApiResponse } from 'next';
import { SYSTEM_PROMPT } from '../../constants';
import { searchProducts } from '../../products';

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

  // Convert history to OpenRouter format
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(history ?? []).map(h => ({
      role: h.role,
      content: h.parts?.[0]?.text || ''
    })),
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
        model: 'google/gemini-3.1-flash-lite-preview',
        messages,
        temperature: 0.6,
        tools: [{
          type: 'function',
          function: {
            name: 'search_products',
            description: "Use this ONLY when the user explicitly wants to SEE, VIEW, SHOW, or BUY specific Licious products. Do NOT use for general conversation or recipe advice.",
            parameters: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: "The product name or category to find (e.g., 'chicken', 'fish', 'lamb')."
                }
              },
              required: ['query']
            }
          }
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    if (!choice) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    let text = choice.message?.content || '';
    let products = null;

    // Check for tool calls
    const toolCalls = choice.message?.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      if (toolCall.function.name === 'search_products') {
        const args = JSON.parse(toolCall.function.arguments);
        products = searchProducts(args.query);
      }
    }

    if (products && products.length > 0 && !text) {
      text = `Here are some of our premium ${products[0].name.toLowerCase()} cuts I found for you:`;
    } else if (!text) {
      text = "I'm Haya, your Licious assistant. How can I help you today?";
    }

    return res.status(200).json({ text, products });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Failed to process chat request' });
  }
}
