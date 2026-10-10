import { z } from "zod";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Only these fields can ever be changed through this endpoint. zod strips
// unknown keys, so we only ever read from `parsed.data`, never `req.body`.
const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .optional(),
    email: z.string().trim().email("Invalid email address").optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "Provide a name or email to update",
  });

export const updateMyProfile = asyncHandler(async (req, res) => {
  // Express 5 leaves req.body undefined when no body was sent
  const parsed = updateProfileSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }

  const { name, email } = parsed.data;

  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  if (email !== undefined && email !== user.email) {
    const taken = await User.findOne({ email, _id: { $ne: user._id } });
    if (taken) throw new AppError("Email is already in use", 409);
    user.email = email;
  }

  if (name !== undefined) user.name = name;

  try {
    await user.save();
  } catch (err) {
    // Two requests can both pass the check above; the unique index catches the loser
    if (err.code === 11000) throw new AppError("Email is already in use", 409);
    throw err;
  }

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});