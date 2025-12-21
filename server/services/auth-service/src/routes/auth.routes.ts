import { Router } from "express";
import {
  getAuthByIdController,
  getAuthController,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/", getAuthController);
router.get("/:id", getAuthByIdController);

export default router;
