
// src/features/orders/orderSlice.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as orderAPI from "./orderApi";

const TOKEN_KEY = "token";

// ==========================================
// FETCH ALL ORDERS
// ==========================================
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const response = await orderAPI.fetchOrdersAPI();
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// ==========================================
// FETCH SINGLE ORDER
// ==========================================
export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (userId, thunkAPI) => {
    try {
      const response = await orderAPI.fetchOrderByIdAPI(userId);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// ==========================================
// FETCH ORDERS BY USER ID
// ==========================================
export const fetchOrderByUserId = createAsyncThunk(
  "orders/fetchOrderByUserId",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        return thunkAPI.rejectWithValue(
          "Authentication token not found"
        );
      }

      const response = await orderAPI.fetchOrderByUserIdAPI(token);

      return response.data.orders;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// ==========================================
// FETCH ORDER BY REFERENCE
// ==========================================
export const fetchByOrderRef = createAsyncThunk(
  "orders/fetchByOrderRef",
  async (orderRef, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        return thunkAPI.rejectWithValue(
          "Authentication token not found"
        );
      }

      const response = await orderAPI.fetchByOrderRefAPI(
        orderRef,
        token
      );

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
        err.response?.data ||
        err.message
      );
    }
  }
);

// ==========================================
// CREATE ORDER
// ==========================================
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (checkout, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        return thunkAPI.rejectWithValue(
          "Authentication token not found"
        );
      }

      const response = await orderAPI.createOrderAPI(
        checkout,
        token
      );

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// ==========================================
// VERIFY PAYMENT
// ==========================================
export const verifyPay = createAsyncThunk(
  "orders/verifyPay",
  async (transaction_id, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        return thunkAPI.rejectWithValue(
          "Authentication token not found"
        );
      }

      const response = await orderAPI.createPayAPI(
        transaction_id,
        token
      );

      if (!response.data.success) {
        return thunkAPI.rejectWithValue(
          response.data.message ||
          "Payment verification failed"
        );
      }

      return response.data;

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
        err.response?.data ||
        err.message
      );
    }
  }
);

// ==========================================
// ORDER SLICE
// ==========================================
const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    order: [],
    userOrder: [],
    orderRef: null,
    paymentVerified: null,
    totalAmount: 0,
    currentOrder: null,

    status: "idle",
    verifyStatus: "idle",
    refStatus: "idle",
    orderStatus: "idle",

    error: null,
  },

  reducers: {
    clearCurrentOrder: (state) => {
      state.orderRef = null;
    },

    clearOrderError: (state) => {
      state.error = null;
    },

    clearPaymentStatus: (state) => {
      state.paymentVerified = null;
      state.verifyStatus = "idle";
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH ALL ORDERS
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH SINGLE ORDER
      .addCase(fetchOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH ORDERS BY USER
      .addCase(fetchOrderByUserId.pending, (state) => {
        state.orderStatus = "loading";
        state.error = null;
      })
      .addCase(fetchOrderByUserId.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.order = action.payload || [];
      })
      .addCase(fetchOrderByUserId.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.error = action.payload;
      })

      // FETCH ORDER BY REFERENCE
      .addCase(fetchByOrderRef.pending, (state) => {
        state.refStatus = "loading";
        state.error = null;
      })
      .addCase(fetchByOrderRef.fulfilled, (state, action) => {
        state.refStatus = "succeeded";
        state.orderRef = action.payload;
      })
      .addCase(fetchByOrderRef.rejected, (state, action) => {
        state.refStatus = "failed";
        state.error = action.payload;
      })

      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderRef = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // VERIFY PAYMENT
      .addCase(verifyPay.pending, (state) => {
        state.verifyStatus = "loading";
        state.error = null;
      })
      .addCase(verifyPay.fulfilled, (state, action) => {
        state.verifyStatus = "succeeded";
        state.paymentVerified = action.payload;
      })
      .addCase(verifyPay.rejected, (state, action) => {
        state.verifyStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentOrder,
  clearOrderError,
  clearPaymentStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
