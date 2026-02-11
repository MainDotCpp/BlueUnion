export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  categories?: Category | null;
  images?: string[];
}

export type CartItem = Product & {
  quantity: number;
};
