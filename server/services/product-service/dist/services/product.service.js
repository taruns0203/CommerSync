import { products } from "../models/product.model";
export const getAllProducts = async () => {
    // DB call in real life
    return products;
};
export const getProductById = async (id) => {
    return products.find((p) => p.id === id) || null;
};
