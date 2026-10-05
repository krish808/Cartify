import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import guestCartReducer from "./guestCartSlice.js";
import  checkoutReducer from "./checkoutSlice.js";
import orderReducer from "./orderSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    guestCart: guestCartReducer,
    checkout : checkoutReducer,
    orders:orderReducer
  },
});
