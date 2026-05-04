export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  emoji: string;
  badge?: 'Best Seller' | 'New' | 'Sale' | 'Popular' | 'Limited';
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount: number;
  shortDescription: string;
  description: string;
  image?: string;
  specs: Record<string, string>;
  features: string[];
  tags: string[];
}
