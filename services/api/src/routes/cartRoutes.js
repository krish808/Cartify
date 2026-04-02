import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  mergeCart,
  updateQuantity, // ✅ must be imported
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.post("/merge", protect, mergeCart);
router.get("/", protect, getCart);
router.patch("/:productId", protect, updateQuantity); // ✅ this line
router.delete("/", protect, clearCart);
router.delete("/:productId", protect, removeFromCart);

export default router;
