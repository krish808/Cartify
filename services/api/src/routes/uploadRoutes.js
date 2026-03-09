import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadProductImages } from "../controllers/upload.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/product/:id",
  protect,
  authorize,
  upload.array("images", 5),
  uploadProductImages,
);

export default router;
