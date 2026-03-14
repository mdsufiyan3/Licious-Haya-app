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
        model: 'google/gemini-flash-1.5',
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
    let products = null;

    if (products && products.length > 0 && !text) {
      text = `Here are some of our premium ${products[0].name.toLowerCase()} cuts I found for you:`;
    } else if (!text) {
      text = "I'm Haya, your Licious assistant. How can I help you today?";
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
