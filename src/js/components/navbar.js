// Navbar Component
import { updateCartCount, updateWishlistCount } from '../config.js';
import { createElement } from '../utils/helpers.js';

export function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Mobile menu toggle
    const mobileToggle = navbar.querySelector('.mobile-menu-toggle');
    const navLinks = navbar.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Update counts on load
    updateCartCount();
    updateWishlistCount();

    // Close mobile menu on link click
    navLinks?.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
            mobileToggle?.classList.remove('active');
        }
    });

    // Handle search
    const searchForm = navbar.querySelector('.search-form');
    searchForm?.addEventListener('submit', handleSearch);

    // Handle user menu
    const userMenu = navbar.querySelector('.user-menu');
    userMenu?.addEventListener('click', toggleUserDropdown);
}

function handleSearch(e) {
    e.preventDefault();
    const query = e.target.querySelector('input').value.trim();
    if (query) {
        // Navigate to search results page
        window.location.href = `/shop?search=${encodeURIComponent(query)}`;
    }
}

function toggleUserDropdown(e) {
    const dropdown = e.currentTarget.querySelector('.user-dropdown');
    dropdown?.classList.toggle('active');
}

// Cart sidebar toggle
export function toggleCartSidebar() {
    const sidebar = document.querySelector('.cart-sidebar');
    sidebar?.classList.toggle('active');
}

// Wishlist sidebar toggle
export function toggleWishlistSidebar() {
    const sidebar = document.querySelector('.wishlist-sidebar');
    sidebar?.classList.toggle('active');
}

// Update navbar on cart/wishlist changes
export function updateNavbarCounts() {
    updateCartCount();
    updateWishlistCount();
}