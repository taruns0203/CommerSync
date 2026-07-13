export interface Product {
  id: string;

  name: string;

  slug: string;

  sku: string;

  price: number;

  description: string;

  categoryId: string;

  stock: number;

  images: string[];
}
