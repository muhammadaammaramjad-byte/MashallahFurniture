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
