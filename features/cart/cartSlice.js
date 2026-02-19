import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const CART_KEY = "CART_DATA";

// Load cart from storage on app start
export const loadCart = createAsyncThunk("cart/loadCart", async () => {
  const stored = await AsyncStorage.getItem(CART_KEY);
  return stored
    ? JSON.parse(stored)
    : { items: [], totalQuantity: 0, totalAmount: 0 };
});

// Save cart
const saveCart = async (state) => {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(state));
};

// Totals helper
const calculateTotals = (items) => {
  let totalQuantity = 0;
  let totalAmount = 0;

  items.forEach((item) => {
    totalQuantity += item.quantity;
    totalAmount += item.quantity * item.price;
  });

  return { totalQuantity, totalAmount };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    status: "idle",
  },

  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((i) => i.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;

      saveCart(state);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;

      saveCart(state);
    },

    // 🔼 increase quantity by 1
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity += 1;
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;

      saveCart(state);
    },

    // 🔽 decrease quantity by 1 (remove if reaches 0)
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;

      saveCart(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      saveCart(state);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        const data = action.payload;
        state.items = data.items;
        state.totalAmount = data.totalAmount;
        state.totalQuantity = data.totalQuantity;
        state.status = "loaded";
      })
      .addCase(loadCart.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
