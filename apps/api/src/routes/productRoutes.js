import express from "express";
import {
  createProduct,
  getMyProducts,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../controllers/product.controller.js";
// import Product from "../models/Product.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.js";
import { productSchema } from "../validators/product.schema.js";

const router = express.Router();

// router.post("/bulk", protect, authorize("seller"), async (req, res) => {
//   try {
//     const products = await Product.insertMany(req.body);
//     res.status(201).json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get("/all", getAllProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  authorize("seller"),
  validate(productSchema),
  createProduct,
);

router.get("/my", protect, authorize("seller"), getMyProducts);

router.delete("/:id", protect, authorize("seller"), deleteProduct);

export default router;
