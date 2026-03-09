import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { getAdminDashboard } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), getAdminDashboard);

export default router;
