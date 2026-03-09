import express from "express";
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/me", protect, getMyOrders);
router.get("/seller", protect, authorize("seller"), getSellerOrders);
router.patch("/:id/status", protect, authorize("seller"), updateOrderStatus);

export default router;
