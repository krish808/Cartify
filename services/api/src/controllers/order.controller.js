import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";

export const createOrder = async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    throw new AppError("Order items required", 400);
  }

  let totalAmount = 0;
  let sellerId = null;

  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) throw new AppError("Product not found", 404);
    if (product.stock < item.quantity)
      throw new AppError("Insufficient stock", 400);

    product.stock -= item.quantity;
    await product.save();

    totalAmount += product.price * item.quantity;
    sellerId = product.seller;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      priceAtPurchase: product.price,
    });
  }

  const order = await Order.create({
    user: req.user._id,
    seller: sellerId,
    items: orderItems,
    totalAmount,
  });

  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "name price")
    .sort("-createdAt");

  res.json(orders);
};

export const getSellerOrders = async (req, res) => {
  const orders = await Order.find({ seller: req.user._id })
    .populate("user", "name email")
    .sort("-createdAt");

  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // seller ownership check
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your order" });
    }

    // allowed status updates
    const allowedStatus = ["SHIPPED", "DELIVERED", "CANCELLED"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
