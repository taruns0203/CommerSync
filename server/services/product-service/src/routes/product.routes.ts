import { Router } from "express";

import {
  getProductByIdController,
  getProductsController,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", (req, res, next) => {
  getProductsController(req, res).catch(next);
});
router.get("/:id", (req, res, next) => {
  getProductByIdController(req, res).catch(next);
});

export default router;
