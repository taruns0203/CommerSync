export interface Auth {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Mock database for now
export const authCollection: Auth[] = [
  { id: "1", name: "Sneakers", price: 99, category: "shoes" },
  { id: "2", name: "Backpack", price: 59, category: "bags" },
];
