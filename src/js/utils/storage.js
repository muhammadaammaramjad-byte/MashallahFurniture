// Storage Utilities
import { config } from '../config.js';

// Local Storage helpers
export function setItem(key, value) {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

export function getItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

export function removeItem(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

export function clearStorage() {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

// Session Storage helpers
export function setSessionItem(key, value) {
    try {
        const serializedValue = JSON.stringify(value);
        sessionStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
    }
}

export function getSessionItem(key, defaultValue = null) {
    try {
        const item = sessionStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return defaultValue;
    }
}

export function removeSessionItem(key) {
    try {
        sessionStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from sessionStorage:', error);
    }
}

// Cart storage
export function saveCart(cart) {
    setItem('cart', cart);
}

export function getCart() {
    return getItem('cart', []);
}

export function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    return cart;
}

export function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

export function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            return removeFromCart(productId);
        }
        saveCart(cart);
    }

    return cart;
}

export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Wishlist storage
export function saveWishlist(wishlist) {
    setItem('wishlist', wishlist);
}

export function getWishlist() {
    return getItem('wishlist', []);
}

export function addToWishlist(product) {
    const wishlist = getWishlist();
    if (!wishlist.find(item => item.id === product.id)) {
        wishlist.push(product);
        saveWishlist(wishlist);
    }
    return wishlist;
}

export function removeFromWishlist(productId) {
    const wishlist = getWishlist().filter(item => item.id !== productId);
    saveWishlist(wishlist);
    return wishlist;
}

export function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === productId);
}

// User preferences
export function saveUserPreferences(preferences) {
    setItem('userPreferences', preferences);
}

export function getUserPreferences() {
    return getItem('userPreferences', {
        theme: 'light',
        currency: config.CURRENCY,
        language: 'en'
    });
}

// Search history
export function saveSearchHistory(query) {
    const history = getItem('searchHistory', []);
    const filteredHistory = history.filter(item => item !== query);
    filteredHistory.unshift(query);
    setItem('searchHistory', filteredHistory.slice(0, 10)); // Keep last 10 searches
}

export function getSearchHistory() {
    return getItem('searchHistory', []);
}

export function clearSearchHistory() {
    removeItem('searchHistory');
}