import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  mergeCart,
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.post("/merge", protect, mergeCart);
router.get("/", protect, getCart);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
