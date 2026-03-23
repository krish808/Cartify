import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProducts, getProductById } from "../services/productService";

// ✅ Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllProducts();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// ✅ Fetch single product by id
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getProductById(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selectedProduct: null, // ✅ for ProductDetails
    loading: false,
    detailLoading: false, // ✅ separate loader for detail page
    error: null,
    detailError: null,
  },
  reducers: {
    // ✅ Clear selected product when leaving detail page
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by id
      .addCase(fetchProductById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
