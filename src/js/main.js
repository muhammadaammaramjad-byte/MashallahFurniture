// Main JavaScript Entry Point
import './components/navbar.js';
import './components/footer.js';
import './components/cartSidebar.js';
import './components/modal.js';
import './components/toast.js';
import { initializeApp } from './config.js';
import dataService from './services/dataService.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeDataService();
});

// Initialize data service and set up global listeners
async function initializeDataService() {
    try {
        // Load and cache products
        const products = await dataService.getProducts();
        console.log(`✅ DataService initialized with ${products.length} products`);

        // Set up cross-tab synchronization
        setupCrossTabSync();

        // Log current data status
        logDataStatus();

    } catch (error) {
        console.error('❌ Failed to initialize data service:', error);
    }
}

// Set up synchronization between browser tabs
function setupCrossTabSync() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            dataService.dispatchCartEvent();
        } else if (e.key === 'wishlist') {
            dataService.dispatchWishlistEvent();
        }
    });
}

// Log current data status for debugging
function logDataStatus() {
    const cart = dataService.getCart();
    const wishlist = dataService.getWishlist();
    const user = dataService.getUser();

    console.log('📊 Data Status:', {
        cartItems: cart.length,
        cartTotal: dataService.getCartTotals().subtotal,
        wishlistItems: wishlist.length,
        userLoggedIn: !!user
    });
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Could send to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to error tracking service
});

// Make dataService available globally for debugging
window.dataService = dataService;