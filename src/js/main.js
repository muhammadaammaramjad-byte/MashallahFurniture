// Main JavaScript Entry Point
import './components/navbar.js';
import './components/footer.js';
import './components/cartSidebar.js';
import './components/modal.js';
import './components/toast.js';
import { initializeApp } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Could send to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to error tracking service
});