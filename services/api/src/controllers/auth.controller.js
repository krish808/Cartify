import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import AppError from "../utils/AppError.js";

// ================= REGISTER =================
const allowedRoles = ["customer", "seller"];

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: allowedRoles.includes(role) ? role : "customer",
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ true in prod
    sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    accessToken,
  });
};

// LOGIN

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError("Invalid credentials", 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ true in prod
    sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) throw new AppError("No refresh token", 401);

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    throw new AppError("Invalid refresh token", 403);
  }

  const newAccessToken = generateAccessToken(user);

  res.json({
    accessToken: newAccessToken,
  });
};

// LOGOUT
export const logout = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.refreshToken = null;
  await user.save();

  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
};
