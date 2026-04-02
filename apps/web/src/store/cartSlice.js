import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCartItems,
  mergeCartItems,
} from "../services/cartServices.js";

import clearGuestCart from "./guestCartSlice";

// GET CART
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      return await getCart();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

// ADD ITEM
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      return await addCartItem(productId, quantity);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add to cart",
      );
    }
  },
);

// UPDATE QUANTITY ✅ New
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await updateCartItemQuantity(productId, quantity);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update quantity",
      );
    }
  },
);

// REMOVE ITEM
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      await removeCartItem(productId);
      return productId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove item",
      );
    }
  },
);

// CLEAR CART
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await clearCartItems();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to clear cart",
      );
    }
  },
);

export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async (guestItems, { dispatch, rejectWithValue }) => {
    try {
      const result = await mergeCartItems(guestItems);
      dispatch(clearGuestCart());
      return result;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to merge cart",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    actionLoading: false, // ✅ separate — only for add/remove/update
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD TO CART
      .addCase(addToCart.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // UPDATE QUANTITY
      .addCase(updateQuantity.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // REMOVE FROM CART
      .addCase(removeFromCart.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.filter(
          (item) => item.product._id !== action.payload,
        );
        state.totalAmount = state.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Merge Cart
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      // CLEAR CART
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
      });
  },
});

export default cartSlice.reducer;
