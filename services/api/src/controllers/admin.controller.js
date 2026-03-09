import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getAdminDashboard = async (req, res) => {
  // 👥 Users
  const totalUsers = await User.countDocuments({
    role: "customer",
  });

  const totalSellers = await User.countDocuments({
    role: "seller",
  });

  // 📦 Products
  const totalProducts = await Product.countDocuments();

  // 📦 Orders
  const totalOrders = await Order.countDocuments();

  // 💰 Revenue (only paid)
  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: "PAID" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  // 🕒 Recent Orders
  const recentOrders = await Order.find()
    .sort("-createdAt")
    .limit(5)
    .populate("user", "name email")
    .populate("seller", "name email");

  res.json({
    totalUsers,
    totalSellers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
  });
};
