import { products, Product } from "../models/product.model.js";

export const getAllProducts = async (): Promise<Product[]> => {
  // DB call in real life
  return products;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  return products.find((p) => p.id === id) || null;
};
