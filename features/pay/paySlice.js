// src/features/products/productSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as payAPI from './payApi';

// Thunks


export const addPay = createAsyncThunk(
  'pay/addPay',
  async (checkout, thunkAPI) => {
    try {
      const response = await payAPI.createPayAPI(checkout);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice

const paySlice = createSlice({
  name: 'pay',
  initialState: {
    paymentUrl: null,
    currentPay: null,  // for editing / viewing one
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // optional non-async actions
    clearCurrentPay(state) {
      state.currentPay = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // add product
      .addCase(addPay.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addPay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paymentUrl = action.payload.link;
      })
      .addCase(addPay.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  }
});

export const { clearCurrentPay } = paySlice.actions;

export default paySlice.reducer;
