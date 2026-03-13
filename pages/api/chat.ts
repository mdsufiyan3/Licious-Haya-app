import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { SYSTEM_PROMPT } from '../../constants';
import { searchProducts } from '../../products';

const searchProductsTool: FunctionDeclaration = {
  name: 'search_products',
  parameters: {
    type: Type.OBJECT,
    description:
      "Use this ONLY when the user explicitly wants to SEE, VIEW, SHOW, or BUY specific Licious products. Do NOT use for general conversation or recipe advice.",
    properties: {
      query: {
        type: Type.STRING,
        description: "The product name or category to find (e.g., 'chicken', 'fish', 'lamb').",
      },
    },
    required: ['query'],
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body as { message?: string; history?: Array<{ role: string; parts: any[] }> };

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...(history ?? []),
      { role: 'user', parts: [{ text: message }] },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: [searchProductsTool] }],
      temperature: 0.6,
    },
  });

  const functionCalls = response.functionCalls;
  let products = null;

  if (functionCalls && functionCalls.length > 0) {
    const call = functionCalls[0];
    if (call.name === 'search_products') {
      const args = call.args as { query: string };
      products = searchProducts(args.query);
    }
  }

  let text = response.text || '';

  if (products && products.length > 0 && !text) {
    text = `Here are some of our premium ${products[0].name.toLowerCase()} cuts I found for you:`;
  } else if (!text) {
    text = "I'm Haya, your Licious assistant. How can I help you today?";
  }

  return res.status(200).json({ text, products });
}
