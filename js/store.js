const CART_KEY = 'mashallah_cart';
const WISHLIST_KEY = 'mashallah_wishlist';
const WALLET_KEY = 'mashallah_wallet';

const loadData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    return [];
  }
};

const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const dispatchUpdate = () => {
  const storeData = { cart, wishlist, wallet };
  window.dispatchEvent(new CustomEvent('mashallahStoreUpdated', { detail: storeData }));
  window.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: { cart, subtotal: getCartTotal(), count: getCartCount() }
  }));
};

const cart = loadData(CART_KEY);
const wishlist = loadData(WISHLIST_KEY);
const wallet = JSON.parse(localStorage.getItem(WALLET_KEY) || '{"balance":0}');

const saveCart = () => saveData(CART_KEY, cart);
const saveWishlist = () => saveData(WISHLIST_KEY, wishlist);
const saveWallet = () => localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));

const notify = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: { message, type }
  }));
};

const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

const findCartItem = (productId) => cart.find((item) => item.id === productId);

const addToCart = (product, quantity = 1) => {
  const existing = findCartItem(product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  saveCart();
  dispatchUpdate();
  notify(`${product.name} added to cart`, 'success');
};

const removeFromCart = (productId) => {
  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart();
    dispatchUpdate();
    notify('Item removed from cart', 'info');
  }
};

const updateQuantity = (productId, delta) => {
  const item = findCartItem(productId);
  if (!item) return;
  const nextQuantity = item.quantity + delta;
  if (nextQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  item.quantity = nextQuantity;
  saveCart();
  dispatchUpdate();
};

const clearCart = () => {
  cart.length = 0;
  saveCart();
  dispatchUpdate();
  notify('Cart has been cleared', 'info');
};

const toggleWishlist = (product) => {
  const index = wishlist.findIndex((item) => item.id === product.id);
  if (index === -1) {
    wishlist.push(product);
  } else {
    wishlist.splice(index, 1);
  }
  saveWishlist();
  dispatchUpdate();
};

const applyWalletCredit = (amount) => {
  wallet.balance = Math.max(0, wallet.balance - amount);
  saveWallet();
  dispatchUpdate();
};

window.MashallahStore = {
  cart,
  wishlist,
  wallet,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleWishlist,
  getCartTotal,
  getCartCount,
  applyWalletCredit,
  saveCart,
  saveWishlist,
  saveWallet,
};

export {
  cart,
  wishlist,
  wallet,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleWishlist,
  getCartTotal,
  getCartCount,
  applyWalletCredit,
};
