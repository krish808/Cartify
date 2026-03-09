import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createPayment,
  markPaymentPaid,
  confirmPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", protect, createPayment);
router.patch("/:paymentId/pay", protect, markPaymentPaid);
router.post("/confirm", protect, confirmPayment);

export default router;
