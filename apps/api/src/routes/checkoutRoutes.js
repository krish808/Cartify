import express from "express";
import { checkout } from "../controllers/checkout.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, checkout);

export default router;
