import { Request, Response } from "express";
import { getAllProducts, getProductById } from "../services/product.service.js";

export const getProductsController = async (req: Request, res: Response) => {
  const data = await getAllProducts();
  res.status(200).json({ success: true, data });
};

export const getProductByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.status(200).json({ success: true, data: product });
};
