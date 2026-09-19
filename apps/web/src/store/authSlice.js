import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser, logoutUser } from "../services/authService";
import { mergeCart, clearCartState } from "./cartSlice"; // ✅ clearCartState not clearCart
import { clearGuestCart } from "./guestCartSlice"; // ✅ added
import toast from "react-hot-toast";

 const mergeGuestCartIfAny = async(dispatch)=>{
  const guestItems = JSON.parse(localStorage.getItem("guestCart") ||"[]")
  if(guestItems.length === 0)return

  const itemsToMerge = guestItems.map(({productId,quantity})=>({
    productId,quantity
  }))

  const result = await dispatch(mergeCart(itemsToMerge))
  
  if(mergeCart.rejected.match(result)){
    console.error("Guest cart merge failed :",result.payload)
    toast.error("We couldn't restore your cart items Please check your cart.")
    dispatch(clearGuestCart())
    localStorage.removeItem("guestCart")
  }
 }

// REGISTER
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, {dispatch, rejectWithValue }) => {
    try {
      const data = await registerUser(credentials);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      await mergeGuestCartIfAny(dispatch)

      toast.success("Account created successfully! 🎉");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);

      // ✅ Save token first before any authenticated API calls
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      await mergeGuestCartIfAny(dispatch)

      toast.success(`Welcome back, ${data.user.name}! 👋`);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

// LOGOUT
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await logoutUser();
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("guestCart");
      dispatch(clearCartState());
      dispatch(clearGuestCart()); 
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null,
    sessionExpired: false, // ✅ added to track session expiry
  },
  reducers: {
    sessionExpired: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionExpired = true;
    },
    clearSessionExpired: (state) => {
      state.sessionExpired = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionExpired = false;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { sessionExpired, clearSessionExpired } = authSlice.actions;
export default authSlice.reducer;
