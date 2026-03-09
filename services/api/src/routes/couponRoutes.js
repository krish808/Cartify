import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import Coupon from "../models/Coupon.js";

const router = express.Router();

// Create Coupon (Admin Only)
router.post("/", protect, authorize("admin"), async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

// Get All Coupons
router.get("/", protect, authorize("admin"), async (req, res) => {
  const coupons = await Coupon.find().sort("-createdAt");
  res.json(coupons);
});

export default router;
