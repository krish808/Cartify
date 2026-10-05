import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { getMyOrders } from "../services/orderService";

export const fetchMyOrders = createAsyncThunk("orders/fetchMyOrders", async (_, { rejectWithValue }) => {
    try {
        return await getMyOrders();
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
});

const orderSlice = createSlice({
    name:"orders",
    initialState:{
        items:[],
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchMyOrders.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchMyOrders.fulfilled,(state, action)=>{
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchMyOrders.rejected,(state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default orderSlice.reducer;