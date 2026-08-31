import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast"; // ✅ added

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
        toast.success("Cart updated!"); // ✅
      } else {
        state.items.push({ productId, quantity, product });
        toast.success("Added to cart!"); // ✅
      }
      saveToStorage(state.items);
    },

    updateGuestQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
      saveToStorage(state.items);
      // ❌ no toast here — too frequent (every +/- click)
    },

    removeGuestItem(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveToStorage(state.items);
      toast.success("Item removed"); // ✅
    },

    clearGuestCart(state) {
      state.items = [];
      localStorage.removeItem("guestCart");
      // ❌ no toast here — called silently after merge/logout
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
