import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { getSellerDashboard } from "../controllers/seller.controller.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("seller"), getSellerDashboard);

export default router;
