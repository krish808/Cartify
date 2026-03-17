import express from "express";
import {
  login,
  refreshToken,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refreshToken));
router.post("/logout", protect, asyncHandler(logout));

export default router;
