export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// Helper function to get user-specific cart key
const getCartKey = (userId) => userId ? `cart_${userId}` : 'cart_guest';

export const updateCart = (state, userId) => {
  // Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );

  // Calculate shipping price (free shipping if items price > $500, else $10)
  state.shippingPrice = addDecimals(state.itemsPrice > 500 ? 0 : 10);

  // Calculate tax price (15% of items price)
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

  // Calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Store cart with user-specific key
  const cartKey = getCartKey(userId);
  localStorage.setItem(cartKey, JSON.stringify(state));

  return state;
};
