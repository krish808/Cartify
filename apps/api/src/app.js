import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/adminRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { logger } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(logger);

// Routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);

app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/coupons", couponRoutes);

app.use(errorHandler);

export default app;
