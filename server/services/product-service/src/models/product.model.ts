export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Mock database for now
export const products: Product[] = [
  { id: "1", name: "Sneakers", price: 99, category: "shoes" },
  { id: "2", name: "Backpack", price: 59, category: "bags" },
];
