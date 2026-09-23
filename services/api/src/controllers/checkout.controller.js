import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";
import AppError from "../utils/AppError.js";
import Coupon from "../models/Coupon.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkout = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { couponCode } = req.body;

  const session = await mongoose.startSession();
  let responseData;

  try {
    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: userId })
        .populate("items.product")
        .session(session);

      if (!cart || cart.items.length === 0) {
        throw new AppError("Cart is empty", 400);
      }

      const itemsBySeller = new Map();

      for (const item of cart.items) {
        const product = item.product;
        if (!product) {
          throw new AppError("A product in your cart no longer exists", 404);
        }

        const sellerId = String(product.seller);
        if (!itemsBySeller.has(sellerId)) {
          itemsBySeller.set(sellerId, []);
        }
        itemsBySeller.get(sellerId).push({ product, quantity: item.quantity });
      }

      if (couponCode && itemsBySeller.size > 1) {
        throw new AppError(
          "Coupons can only be applied to orders from a single seller",
          400,
        );
      }

      let coupon = null;
      if (couponCode) {
        coupon = await Coupon.findOne({
          code: couponCode.toUpperCase(),
          isActive: true,
        }).session(session);

        if (!coupon) throw new AppError("Invalid coupon code", 400);
        if (coupon.expiresAt < new Date()) throw new AppError("Coupon expired", 400);
      }

      const createdOrders = [];

      for (const [sellerId, items] of itemsBySeller) {
        // ✅ Atomic check-and-reduce per item — closes the race condition
        // where two concurrent checkouts could both pass a separate
        // "check stock" step before either one's "reduce stock" step ran.
        let sellerTotal = 0;

        for (const { product, quantity } of items) {
          const updatedProduct = await Product.findOneAndUpdate(
            { _id: product._id, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { new: true, session },
          );

          if (!updatedProduct) {
            throw new AppError(`Insufficient stock for ${product.name}`, 400);
          }

          sellerTotal += product.price * quantity;
        }

        let discount = 0;

        if (coupon) {
          if (sellerTotal < coupon.minOrderAmount) {
            throw new AppError(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400);
          }

          discount =
            coupon.discountType === "PERCENT"
              ? (sellerTotal * coupon.discountValue) / 100
              : coupon.discountValue;

          if (discount > sellerTotal) discount = sellerTotal;
          sellerTotal -= discount;
        }

        const orderItems = items.map(({ product, quantity }) => ({
          product: product._id,
          quantity,
          priceAtPurchase: product.price,
        }));

        const [order] = await Order.create(
          [
            {
              user: userId,
              seller: sellerId,
              items: orderItems,
              totalAmount: sellerTotal,
              discount,
            },
          ],
          { session },
        );

        const [payment] = await Payment.create(
          [
            {
              order: order._id,
              user: userId,
              amount: sellerTotal,
              status: "PENDING",
            },
          ],
          { session },
        );

        order.payment = payment._id;
        await order.save({ session });

        createdOrders.push({ order, payment });
      }

      await Cart.deleteOne({ _id: cart._id }).session(session);

      responseData = {
        message: "Checkout successful",
        orders: createdOrders.map((o) => o.order),
        payments: createdOrders.map((o) => o.payment),
      };
    });

    res.status(201).json(responseData);
  } finally {
    await session.endSession();
  }
});