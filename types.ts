
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export enum ProductCategory {
  CHICKEN = 'Chicken',
  RED_MEAT = 'Red Meat',
  SEAFOOD = 'Seafood',
  EGGS = 'Eggs',
  COMBO = 'Combo Pack'
}

export interface Product {
  id: string;
  name: string;
  price: string;
  weight: string;
  imageUrl: string;
  productUrl: string;
  description: string;
  category: ProductCategory;
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

// PWA types
declare global {
  interface Window {
    deferredPrompt: any;
  }
}
