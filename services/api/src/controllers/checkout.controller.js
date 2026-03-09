import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";
import AppError from "../utils/AppError.js";
import Coupon from "../models/Coupon.js";

export const checkout = async (req, res) => {
  const userId = req.user._id;
  const { couponCode } = req.body;

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  let totalAmount = 0;
  const orderItems = [];

  // Validate stock and calculate total
  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product) throw new AppError("Product not found", 404);

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    totalAmount += product.price * item.quantity;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      priceAtPurchase: product.price,
    });
  }

  let discount = 0;

  // 🎟 Apply Coupon if provided
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) throw new AppError("Invalid coupon code", 400);

    if (coupon.expiresAt < new Date())
      throw new AppError("Coupon expired", 400);

    if (totalAmount < coupon.minOrderAmount)
      throw new AppError(
        `Minimum order amount is ₹${coupon.minOrderAmount}`,
        400,
      );

    if (coupon.discountType === "PERCENT") {
      discount = (totalAmount * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    if (discount > totalAmount) {
      discount = totalAmount;
    }

    totalAmount -= discount;
  }

  // 📦 Create Order
  const order = await Order.create({
    user: userId,
    seller: cart.seller,
    items: orderItems,
    totalAmount,
    discount,
  });

  // 💳 Create Payment
  const payment = await Payment.create({
    order: order._id,
    user: userId,
    amount: totalAmount,
    status: "PENDING",
  });

  order.payment = payment._id;
  await order.save();

  // 📉 Reduce stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // 🧹 Clear cart
  await cart.deleteOne();

  res.status(201).json({
    message: "Checkout successful",
    order,
    discountApplied: discount,
    payment,
  });
};
