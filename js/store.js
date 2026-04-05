// js/store.js - Enhanced version
class Store {
  constructor() {
    this.state = {
      cart: [],
      wishlist: [],
      user: null,
      products: [],
      filters: {},
      ui: { isLoading: false, toast: null }
    };
    this.listeners = new Map();
    this.persistKeys = ['cart', 'wishlist', 'user'];
    this.loadPersistedState();
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key).delete(callback);
  }

  setState(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;

    if (this.persistKeys.includes(key)) {
      localStorage.setItem(`store_${key}`, JSON.stringify(value));
    }

    this.listeners.get(key)?.forEach(cb => cb(value, oldValue));
  }

  loadPersistedState() {
    this.persistKeys.forEach(key => {
      const saved = localStorage.getItem(`store_${key}`);
      if (saved) {
        this.state[key] = JSON.parse(saved);
      }
    });
  }
}

export const store = new Store();

// Store helper functions
export let cart = store.state.cart;
export let wishlist = store.state.wishlist;
export let wallet = store.state.wallet || 0;

const addToCart = (product) => {
  const currentCart = [...store.state.cart];
  const existingIndex = currentCart.findIndex(item => item.id === product.id);
  
  if (existingIndex > -1) {
    currentCart[existingIndex].quantity = (currentCart[existingIndex].quantity || 1) + 1;
  } else {
    currentCart.push({ ...product, quantity: 1 });
  }
  
  store.setState('cart', currentCart);
};

const removeFromCart = (productId) => {
  const currentCart = store.state.cart.filter(item => item.id !== productId);
  store.setState('cart', currentCart);
};

const updateQuantity = (productId, quantity) => {
  const currentCart = store.state.cart.map(item => 
    item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
  ).filter(item => item.quantity > 0);
  store.setState('cart', currentCart);
};

const clearCart = () => {
  store.setState('cart', []);
};

const toggleWishlist = (product) => {
  const currentWishlist = [...store.state.wishlist];
  const index = currentWishlist.findIndex(item => item.id === product.id);
  
  if (index > -1) {
    currentWishlist.splice(index, 1);
  } else {
    currentWishlist.push(product);
  }
  
  store.setState('wishlist', currentWishlist);
};

const getCartTotal = () => {
  return store.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const getCartCount = () => {
  return store.state.cart.reduce((count, item) => count + item.quantity, 0);
};

const applyWalletCredit = (amount) => {
  const currentWallet = store.state.wallet || 0;
  store.setState('wallet', currentWallet - amount);
};

const saveCart = () => {
  // Already handled by setState
};

const saveWishlist = () => {
  // Already handled by setState
};

const saveWallet = () => {
  // Already handled by setState
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
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleWishlist,
  getCartTotal,
  getCartCount,
  applyWalletCredit,
};
