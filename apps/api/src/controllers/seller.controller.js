import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getSellerDashboard = async (req, res) => {
  const sellerId = req.user._id;

  // 📦 Total Products
  const totalProducts = await Product.countDocuments({
    seller: sellerId,
  });

  // 📦 Orders
  const orders = await Order.find({ seller: sellerId });

  const totalOrders = orders.length;

  // 💰 Revenue (only PAID orders)
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  // 🕒 Recent Orders (last 5)
  const recentOrders = await Order.find({ seller: sellerId })
    .sort("-createdAt")
    .limit(5)
    .populate("user", "name email");

  res.json({
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
  });
};
