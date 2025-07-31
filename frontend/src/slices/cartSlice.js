import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

// Helper function to get user-specific cart key
const getCartKey = (userId) => userId ? `cart_${userId}` : 'cart_guest';

// Helper function to get initial cart state
const getInitialCartState = (userId) => {
  const cartKey = getCartKey(userId);
  return localStorage.getItem(cartKey)
    ? JSON.parse(localStorage.getItem(cartKey))
    : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };
};

const initialState = { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { userId, ...item } = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x,
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state, userId);
    },
    removeFromCart: (state, action) => {
      const { productId, userId } = action.payload;
      state.cartItems = state.cartItems.filter((x) => x._id !== productId);
      return updateCart(state, userId);
    },
    saveShippingAddress: (state, action) => {
      const { shippingAddress, userId } = action.payload;
      state.shippingAddress = shippingAddress;
      return updateCart(state, userId);
    },
    savePaymentMethod: (state, action) => {
      const { paymentMethod, userId } = action.payload;
      state.paymentMethod = paymentMethod;
      return updateCart(state, userId);
    },
    clearCartItems: (state, action) => {
      const userId = action.payload;
      state.cartItems = [];
      return updateCart(state, userId);
    },
    loadUserCart: (state, action) => {
      const userId = action.payload;
      const userCartState = getInitialCartState(userId);
      state.cartItems = userCartState.cartItems;
      state.shippingAddress = userCartState.shippingAddress;
      state.paymentMethod = userCartState.paymentMethod;
      return state;
    },
    clearUserCart: (state, action) => {
      const userId = action.payload;
      if (userId) {
        const cartKey = getCartKey(userId);
        localStorage.removeItem(cartKey);
      }
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = 'PayPal';
      return state;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  loadUserCart,
  clearUserCart,
} = cartSlice.actions;

export default cartSlice.reducer;
