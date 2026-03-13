export const chatWithHaya = async (message: string, history: { role: string; parts: any[] }[] = []) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<{ text: string; products: any[] | null }>;
};
