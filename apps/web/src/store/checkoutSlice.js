import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { placeOrder } from "../services/checkoutService.js";

export const checkout = createAsyncThunk(
  "checkout/checkout",
  async (couponCode, { rejectWithValue }) => {
    try {
      return await placeOrder(couponCode);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Checkout failed",
      );
    }
  },
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    loading: false,
    error: null,
    lastOrders: [],
    lastPayments: [],
  },
  reducers: {
    resetCheckoutState: (state) => {
      state.loading = false;
      state.error = null;
      state.lastOrders = [];
      state.lastPayments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrders = action.payload.orders || [];
        state.lastPayments = action.payload.payments || [];
      })
      .addCase(checkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;