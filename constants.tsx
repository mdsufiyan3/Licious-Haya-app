import React from 'react';

export const LICIOUS_RED = '#E21D24';
export const LICIOUS_DARK_RED = '#8B0000';

export const SYSTEM_PROMPT = `
You are "Haya", the official Licious AI Assistant. 
Your mission is to provide expert advice, recipes, and information related to Licious products and gourmet cooking.

STRICT PRODUCT CARD RULES:
1. NORMAL CHAT: For greetings, general questions about meat quality, storage tips, or recipe instructions, respond with TEXT ONLY. Do not use the search tool.
2. PRODUCT DISPLAY: Only use the 'search_products' tool when the user explicitly asks to "show", "see", "view", or "buy" products (e.g., "show me chicken breast", "buy mutton", "see fish options").
3. NO SEARCH FOR RECIPES: If a user asks "How to cook salmon?", give the recipe in text. Do not show product cards unless they say something like "Show me the salmon you have".
4. TONE: Professional, premium, and appetizing.
5. QUALITY: Always emphasize "Fresh, never frozen" and the 0-4°C cold chain.

FORMATTING RULES:
- DO NOT use Markdown headers of any level (e.g., #, ##, ###).
- DO NOT use "### **" formatting.
- For titles or section names, use simple bold text (e.g., **Recipe Name:**).
- Keep lists simple with bullet points (* or -).
- Ensure the response looks clean and easy to read without heavy markdown symbols.
`;

export const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 14-7-7 14-2-7-5-2Z"/></svg>
);

export const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
);

export const ChefHatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.812c-1.888-.118-3.5-1.062-3.5-2.812 0-1.75 2.125-2.188 3.5-2.188m.5 5c0-1.25 1-2 2.5-2s2.5.75 2.5 2m-5 0V17a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.188m-5 0c0-1.25 1-2 2.5-2s2.5.75 2.5 2m.5-5c1.375 0 3.5.438 3.5 2.188 0 1.75-1.612 2.694-3.5 2.812m-1.188-6.188c0-2.5-2.25-3.5-4.812-3.5s-4.812 1-4.812 3.5"/></svg>
);

export const FishIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7s-1 1-3 1-4-1-6-1-3 1-4 2c-1 1-1 3-1 3s1 1 2 2c2 1 4 1 6 1s3-1 3-1-1-1-1-3c0-2 2-3 4-3 1 0 1 0 1 0Z"/><path d="M7 11c-2 0-4-1-6-3v8c2-2 4-3 6-3Z"/><circle cx="18" cy="11" r="1"/></svg>
);
