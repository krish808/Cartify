import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  addCartItem,
  removeCartItem,
  clearCartItems,
} from "../services/cartServices.js";

// GET CART
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  return await getCart();
});

// ADD ITEM
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    return await addCartItem(productId, quantity);
  },
);

// REMOVE ITEM
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId) => {
    await removeCartItem(productId);
    return productId;
  },
);

// CLEAR CART
export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  await clearCartItems();
});

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })

      // ADD
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })

      // REMOVE
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.product._id !== action.payload,
        );
      })

      // CLEAR
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
