import { Request, Response } from "express";
import { getAllAuth, getAuthId } from "../services/auth.service.js";

export const getAuthController = async (req: Request, res: Response) => {
  const data = await getAllAuth();
  res.status(200).json({ success: true, data });
};

export const getAuthByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getAuthId(id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.status(200).json({ success: true, data: product });
};
