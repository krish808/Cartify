import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    discountType: {
      type: String,
      enum: ["PERCENT", "FLAT"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    maxDiscountAmount: {
      type: Number,
    },

    usageLimit: {
      type: Number,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    applicableTo: {
      type: String,
      enum: ["GLOBAL", "SELLER"],
      default: "GLOBAL",
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Coupon", couponSchema);
