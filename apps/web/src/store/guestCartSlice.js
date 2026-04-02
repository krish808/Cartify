// src/store/guestCartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem("guestCart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  localStorage.setItem("guestCart", JSON.stringify(items));
};

const guestCartSlice = createSlice({
  name: "guestCart",
  initialState: {
    items: loadFromStorage(),
  },
  reducers: {
    addGuestItem(state, action) {
      const { productId, quantity = 1, product } = action.payload;
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, quantity, product });
      }
      saveToStorage(state.items);
    },

    updateGuestQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
      saveToStorage(state.items);
    },

    removeGuestItem(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveToStorage(state.items);
    },

    clearGuestCart(state) {
      state.items = [];
      localStorage.removeItem("guestCart");
    },
  },
});

export const {
  addGuestItem,
  updateGuestQuantity,
  removeGuestItem,
  clearGuestCart,
} = guestCartSlice.actions;

export default guestCartSlice.reducer;
