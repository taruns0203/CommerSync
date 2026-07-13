import { Product } from "@commersync/types/src/entities/Product.js";

export type { Product };

// Mock database for now
export const products: Product[] = [
  {
    id: "1",
    name: "Sneakers",
    price: 99,
    slug: "sneakers",
    categoryId: "shoes",
    sku: "SNK-001",
    description: "Comfortable running sneakers",
    stock: 50,
    images: ["/images/sneakers.jpg"],
  },
  {
    id: "2",
    name: "Backpack",
    price: 59,
    slug: "backpack",
    categoryId: "bags",
    sku: "BPK-002",
    description: "Durable backpack",
    stock: 30,
    images: ["/images/backpack.jpg"],
  },
];
