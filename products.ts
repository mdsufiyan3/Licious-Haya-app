import { Product } from './types';

export const LICIOUS_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Chicken Breast - Boneless',
    price: '₹285',
    weight: '450g',
    description: 'Fresh, skinless, and succulent chicken breast fillets.',
    imageUrl: 'https://images.licious.in/2/products/5965427d-944b-4a57-8b5e-49b062ec7e24/original/1625035255.4542_Chicken_Breast_Boneless_Hero_Shot.jpg',
    productUrl: 'https://www.licious.in/chicken/chicken-breast---boneless-p/p5965427d-944b-4a57-8b5e-49b062ec7e24'
  },
  {
    id: 'p2',
    name: 'Chicken Curry Cut',
    price: '₹315',
    weight: '1000g',
    description: 'A mix of bone-in and boneless pieces for the perfect curry.',
    imageUrl: 'https://images.licious.in/2/products/7b867c4d-619a-411a-b0d3-455447a19280/original/1625035255.4542_Chicken_Curry_Cut_Large_Pack_Hero_Shot.jpg',
    productUrl: 'https://www.licious.in/chicken/chicken-curry-cut-large-pack-p/p7b867c4d-619a-411a-b0d3-455447a19280'
  },
  {
    id: 'p3',
    name: 'Rich Lamb Curry Cut',
    price: '₹645',
    weight: '450g',
    description: 'Tender, juicy pieces of lamb cut specifically for curries.',
    imageUrl: 'https://images.licious.in/2/products/847240c1-3d77-4402-869d-21e102d84784/original/1625035255.4542_Rich_Lamb_Curry_Cut_Hero_Shot.jpg',
    productUrl: 'https://www.licious.in/mutton/rich-lamb-curry-cut-p/p847240c1-3d77-4402-869d-21e102d84784'
  },
  {
    id: 'p4',
    name: 'Atlantic Salmon Steaks',
    price: '₹999',
    weight: '250g',
    description: 'Premium, melt-in-your-mouth salmon steaks from the Atlantic.',
    imageUrl: 'https://images.licious.in/2/products/d209e75c-1549-43c3-9d41-e94017631f4f/original/1625035255.4542_Atlantic_Salmon_Steaks_Hero_Shot.jpg',
    productUrl: 'https://www.licious.in/fish-seafood/atlantic-salmon-steaks-p/pd209e75c-1549-43c3-9d41-e94017631f4f'
  },
  {
    id: 'p5',
    name: 'Classic Eggs - Pack of 12',
    price: '₹145',
    weight: '12 Units',
    description: 'Farm-fresh, naturally laid eggs with bright orange yolks.',
    imageUrl: 'https://images.licious.in/2/products/f55b1111-5f25-4678-b648-8a07c3f87b8f/original/1625035255.4542_Classic_Eggs_Pack_Of_12_Hero_Shot.jpg',
    productUrl: 'https://www.licious.in/eggs/classic-eggs---pack-of-12-p/pf55b1111-5f25-4678-b648-8a07c3f87b8f'
  },
  {
    id: 'p6',
    name: 'Prawns - Medium (Cleaned)',
    price: '₹425',
    weight: '250g',
    description: 'Freshwater prawns, expertly cleaned and ready to cook.',
    imageUrl: 'https://images.licious.in/2/products/75c2e9b0-96f7-4a0b-8d5f-149b56f8f08a/original/1625035255.4542_Prawns_Medium_Hero_Shot.jpg',
    productUrl: 'https://www.licious.in/fish-seafood/prawns-medium-cleaned-devined-p/p75c2e9b0-96f7-4a0b-8d5f-149b56f8f08a'
  }
];

export const searchProducts = (query: string): Product[] => {
  const q = query.toLowerCase().trim();
  
  // If query is empty, return all products
  if (!q || q.length < 1) {
    return LICIOUS_PRODUCTS;
  }
  
  return LICIOUS_PRODUCTS.filter(p => {
    const name = p.name.toLowerCase();
    const desc = p.description.toLowerCase();
    
    // Check if any part of the query matches
    const queryParts = q.split(' ').filter(part => part.length > 0);
    return queryParts.some(part => name.includes(part) || desc.includes(part));
  });
};