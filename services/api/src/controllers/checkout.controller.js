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

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  // ✅ Group items by seller — a cart can contain products from multiple
  // sellers, but each Order belongs to exactly one seller, so we split
  // checkout into one order per seller (same pattern real marketplaces use).
  const itemsBySeller = new Map();

  for (const item of cart.items) {
    const product = item.product;
    if (!product) throw new AppError("A product in your cart no longer exists", 404);

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    const sellerId = String(product.seller);
    if (!itemsBySeller.has(sellerId)) {
      itemsBySeller.set(sellerId, []);
    }
    itemsBySeller.get(sellerId).push({ product, quantity: item.quantity });
  }

  // ✅ Coupons only supported for single-seller carts for now — splitting
  // a discount fairly across multiple sellers' orders is a real design
  // question (who "absorbs" the discount?) we're deferring intentionally.
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
    });

    if (!coupon) throw new AppError("Invalid coupon code", 400);
    if (coupon.expiresAt < new Date()) throw new AppError("Coupon expired", 400);
  }

  const createdOrders = [];

  for (const [sellerId, items] of itemsBySeller) {
    let sellerTotal = items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0,
    );

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

    const order = await Order.create({
      user: userId,
      seller: sellerId,
      items: orderItems,
      totalAmount: sellerTotal,
      discount,
    });

    const payment = await Payment.create({
      order: order._id,
      user: userId,
      amount: sellerTotal,
      status: "PENDING",
    });

    order.payment = payment._id;
    await order.save();

    createdOrders.push({ order, payment });
  }

  // 📉 Reduce stock — done once, after all orders are successfully created
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // 🧹 Clear cart
  await cart.deleteOne();

  res.status(201).json({
    message: "Checkout successful",
    orders: createdOrders.map((o) => o.order),
    payments: createdOrders.map((o) => o.payment),
  });
});