import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../services/authService"; // ✅ removed ,m
import { mergeCart } from "./cartSlice"; // ✅ added missing import

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);

      // ✅ After login, merge guest cart if any
      const guestItems = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (guestItems.length > 0) {
        const itemsToMerge = guestItems.map(({ productId, quantity }) => ({
          productId,
          quantity,
        }));
        await dispatch(mergeCart(itemsToMerge));
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

// LOGOUT
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutUser();
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Clear state immediately on click
      .addCase(logout.pending, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // ✅ Clear state even if server call fails
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;

// That's the full guest cart flow now complete! Here's a summary of everything wired up:
// ```
// Guest adds item   → guestCartSlice → localStorage ✅
// Guest views cart  → CartPage shows guest cart ✅
// Guest clicks login → navigates to /login ✅
// Login succeeds    → mergeCart dispatched ✅
// mergeCart         → POST /api/cart/merge ✅
// After merge       → clearGuestCart (localStorage cleared) ✅
// Navbar badge      → updates from server cart ✅
