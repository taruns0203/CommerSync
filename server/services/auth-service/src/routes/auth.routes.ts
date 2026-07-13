import { Router } from "express";

import {
  getAuthByIdController,
  getAuthController,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/", (req, res, next) => {
  getAuthController(req, res).catch(next);
});
router.get("/:id", (req, res, next) => {
  getAuthByIdController(req, res).catch(next);
});

export default router;
