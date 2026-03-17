import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../services/authService";

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUser(credentials);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
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
      // ✅ Clear state immediately on click — don't wait for server
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
