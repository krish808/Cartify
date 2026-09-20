import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* =========================
   CREATE PAYMENT (COD)
========================= */
export const createPayment = asyncHandler(async (req, res) => {
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
});

/* =========================
   MARK PAYMENT PAID
========================= */
export const markPaymentPaid = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError("Payment not found", 404);

  // ✅ ownership check — without this, any logged-in user who knows or
  // guesses a paymentId could mark someone else's payment (and order) as
  // paid without ever actually paying.
  if (String(payment.user) !== String(req.user._id))
    throw new AppError("Unauthorized", 403);

  if (payment.status === "PAID") {
    throw new AppError("Payment already completed", 400);
  }

  payment.status = "PAID";
  payment.transactionId = `COD-${Date.now()}`;
  await payment.save();

  await Order.findByIdAndUpdate(payment.order, {
    paymentStatus: "PAID",
    status: "PAID",
  });

  res.json({ message: "Payment successful" });
});

/* =========================
   CONFIRM PAYMENT
========================= */
export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentId, transactionId } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError("Payment not found", 404);

  // ✅ same ownership check as above
  if (String(payment.user) !== String(req.user._id))
    throw new AppError("Unauthorized", 403);

  if (payment.status === "PAID") {
    throw new AppError("Payment already completed", 400);
  }

  payment.status = "PAID";
  payment.transactionId = transactionId;
  await payment.save();

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
});