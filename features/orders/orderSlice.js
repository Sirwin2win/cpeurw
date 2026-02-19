// src/features/products/productSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as orderAPI from './orderApi';

// Thunks

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, thunkAPI) => {
    try {
      const response = await orderAPI.fetchOrdersAPI();
      return response.data;  // assuming your API returns array of products
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchProduct',
  async (userId, thunkAPI) => {
    try {
      const response = await orderAPI.fetchOrderByIdAPI(userId);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (checkout, thunkAPI) => {
    try {
      const response = await orderAPI.createOrderAPI(checkout);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    order: [],
    orderRef:null,
    totalAmount:0,
    currentOrder: null,  // for editing / viewing one
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // optional non-async actions
    clearCurrentOrder(state) {
      state.orderRef = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch all products
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // fetch one product
      .addCase(fetchOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // add product
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderRef = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

  }
});

export const { clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
