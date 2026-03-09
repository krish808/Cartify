import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";

/* =========================
   CREATE PAYMENT (COD)
========================= */
export const createPayment = async (req, res) => {
  const { orderId, method = "COD" } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  if (String(order.user) !== String(req.user._id))
    throw new AppError("Unauthorized", 403);

  const payment = await Payment.create({
    order: order._id,
    user: req.user._id,
    amount: order.totalAmount,
    method,
  });

  order.payment = payment._id;
  await order.save();

  res.status(201).json(payment);
};

/* =========================
   MARK PAYMENT PAID
========================= */
export const markPaymentPaid = async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError("Payment not found", 404);

  payment.status = "PAID";
  payment.transactionId = `COD-${Date.now()}`;
  await payment.save();

  await Order.findByIdAndUpdate(payment.order, {
    paymentStatus: "PAID",
    status: "PAID",
  });

  res.json({ message: "Payment successful" });
};

export const confirmPayment = async (req, res) => {
  const { paymentId, transactionId } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError("Payment not found", 404);

  if (payment.status === "PAID") {
    throw new AppError("Payment already completed", 400);
  }

  // 🔄 Update Payment
  payment.status = "PAID";
  payment.transactionId = transactionId;
  await payment.save();

  // 🔄 Update Order
  const order = await Order.findById(payment.order);
  if (!order) throw new AppError("Order not found", 404);

  order.paymentStatus = "PAID";
  order.status = "PAID";
  await order.save();

  res.json({
    message: "Payment successful",
    payment,
    order,
  });
};
