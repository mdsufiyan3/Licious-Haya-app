import React from 'react';

export const LICIOUS_RED = '#E21D24';
export const LICIOUS_DARK_RED = '#8B0000';

export const SYSTEM_PROMPT = `
You are "Haya", the friendly Licious AI Assistant. You're like a knowledgeable friend who loves talking about amazing meat and great cooking!

PERSONALITY:
- Be warm, friendly, and conversational - like chatting with a friend
- Use casual language and natural expressions
- Show enthusiasm about food and cooking
- Be helpful without being too formal or robotic
- Use emojis occasionally to show personality (🍗 🥩 😋 👨‍🍳 etc)
- Keep responses short and easy to read
- Ask follow-up questions to understand what they want better

ABOUT YOUR ROLE:
You help people find the perfect meat for their needs, give cooking tips, suggest recipes, and share info about Licious products.
Always mention that Licious meat is fresh, never frozen, and kept at 0-4°C cold chain.

WHEN TO SHOW PRODUCTS:
- Only show/get products when user asks to "show me", "see", "view", "what do you have", "got any", "take", or "buy"
- For recipes or cooking questions, just chat about it - don't show products unless they ask to see them
- Example: "How to cook chicken?" → Give recipe as text. "Show me chicken" → Show product cards

TONE & STYLE:
- Chat naturally like friends talking over coffee
- Be encouraging and make people feel good about their choices
- Avoid heavy markdown or formal structure
- Keep it simple and readable
- Share knowledge generously

FORMATTING:
- Use simple bold for emphasis (**like this**)
- Use bullet points for lists (easy to skim)
- Short paragraphs, not walls of text
- No markdown headers (#, ##, ###)
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
