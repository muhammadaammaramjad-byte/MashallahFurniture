import dataService from './services/dataService.js';
import Navbar from './components/navbar.js';
import Footer from './components/footer.js';
import CartSidebar from './components/cartSidebar.js';
import { showToast } from './components/toast.js';

// Initialize app
class App {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🚀 Mashallah Furniture App Initialized');

        // Load components
        this.loadNavbar();
        this.loadFooter();
        this.loadCartSidebar();

        // Initialize data service
        await dataService.getProducts();

        // Setup global event listeners
        this.setupEventListeners();

        // Track page view
        this.trackPageView();

        console.log('✅ App ready');
    }

    loadNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            new Navbar(navbarContainer);
        }
    }

    loadFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            new Footer(footerContainer);
        }
    }

    loadCartSidebar() {
        const cartContainer = document.getElementById('cart-sidebar');
        if (cartContainer) {
            new CartSidebar(cartContainer);
        }
    }

    setupEventListeners() {
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                showToast(`Thanks for subscribing!`, 'success');
                e.target.reset();
            });
        }

        // Global error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });

        // Handle page visibility
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                dataService.clearCache();
            }
        });
    }

    trackPageView() {
        const page = window.location.pathname;
        console.log(`📊 Page view: ${page}`);

        // Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('config', 'G-4YF4T002P6', {
                page_path: page
            });
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

export default App;
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