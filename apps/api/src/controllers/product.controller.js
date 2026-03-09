import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    seller: req.user._id,
  });

  res.status(201).json(product);
});

export const getAllProducts = async (req, res) => {
  const products = await Product.find().populate("seller", "name");
  res.json(products);
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user.id });
  res.json(products);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new AppError("Product not found", 404);
  if (product.seller.toString() !== req.user.id)
    throw new AppError("Not allowed", 403);

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});
