import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import AppError from "../utils/AppError.js";

// ✅ single source of truth for cookie options — used by every cookie() and
// clearCookie() call so they always match exactly (mismatched options is a
// common reason clearCookie silently fails to remove a cookie)
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // ✅ true in prod
  sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

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

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.status(201).json({
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// ================= LOGIN =================
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

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

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

// ================= REFRESH TOKEN =================
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) throw new AppError("No refresh token", 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    // ✅ token is expired or tampered with — clear the dead cookie instead of
    // leaving it to linger in the browser indefinitely
    res.clearCookie("refreshToken", refreshCookieOptions);
    throw new AppError("Invalid or expired refresh token", 403);
  }

  const user = await User.findById(decoded._id);

  if (!user || user.refreshToken !== token) {
    // ✅ token doesn't match what's on record — already rotated/logged out
    // elsewhere, or belongs to a deleted user. Clear it here too.
    res.clearCookie("refreshToken", refreshCookieOptions);
    throw new AppError("Invalid refresh token", 403);
  }

  // ✅ ROTATE: issue a brand-new refresh token every time and invalidate the
  // old one immediately. This makes each refresh token single-use, so a
  // stale/leaked cookie that gets replayed later will fail the check above
  // and get cleared rather than silently working for its full 7-day life.
  const newRefreshToken = generateRefreshToken(user);
  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

  const newAccessToken = generateAccessToken(user);

  res.json({
    accessToken: newAccessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie("refreshToken", refreshCookieOptions);

  res.json({ message: "Logged out successfully" });
};
