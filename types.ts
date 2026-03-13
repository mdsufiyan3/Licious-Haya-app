
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export interface Product {
  id: string;
  name: string;
  price: string;
  weight: string;
  imageUrl: string;
  productUrl: string;
  description: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'product';
  imageUrl?: string;
  products?: Product[];
}

export type ViewType = 'Ask';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  view: ViewType;
}
