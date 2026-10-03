import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";
import {asyncHandler} from "../utils/asyncHandler.js";


export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "name price images")
    .sort("-createdAt");

  res.json(orders);
});

export const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ seller: req.user._id })
    .populate("user", "name email")
    .sort("-createdAt");

  res.json(orders);
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // seller ownership check
    if (order.seller.toString() !== req.user._id.toString()) {
      throw new AppError("Not your order", 403);
    }

    // allowed status updates
    const allowedStatus = ["SHIPPED", "DELIVERED", "CANCELLED"];

    if (!allowedStatus.includes(status)) {
      throw new AppError("Invalid status update", 400);
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
});
