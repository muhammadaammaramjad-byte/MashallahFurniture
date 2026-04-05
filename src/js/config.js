// App Configuration
import dataService from './services/dataService.js';

export const config = {
    API_BASE_URL: import.meta.env.VITE_API_URL || '/api',
    SITE_NAME: 'Mashallah Furniture',
    CURRENCY: 'USD',
    ITEMS_PER_PAGE: 12,
    MAX_CART_ITEMS: 50,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

export function initializeApp() {
    console.log('Initializing Mashallah Furniture app...');

    // Initialize theme
    initializeTheme();

    // Initialize cart and wishlist using data service
    initializeData();

    // Set up global event listeners
    setupGlobalListeners();

    console.log('App initialized successfully');
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function initializeData() {
    // Data is now handled by dataService in main.js
    // Just update the UI counts
    updateCartCount();
    updateWishlistCount();
}

function setupGlobalListeners() {
    // Handle online/offline status
    window.addEventListener('online', () => {
        console.log('App is online');
        // Sync pending actions
    });

    window.addEventListener('offline', () => {
        console.log('App is offline');
        // Show offline message
    });
}

export function updateCartCount() {
    const cart = dataService.getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');

    cartCountElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

export function updateWishlistCount() {
    const wishlist = dataService.getWishlist();
    const count = wishlist.length;
    const wishlistCountElements = document.querySelectorAll('.wishlist-count');

    wishlistCountElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}