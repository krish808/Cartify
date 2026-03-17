import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getAllProducts } from "../services/productService";

export const fetchProducts = createAsyncThunk(
  "product/fetchProduct",
  async () => {
    const data = await getAllProducts;
    return data;
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    item: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
