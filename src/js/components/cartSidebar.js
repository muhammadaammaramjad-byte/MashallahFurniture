// Cart Sidebar Component
import { formatCurrency } from '../utils/helpers.js';
import { getCart, removeFromCart, updateCartItemQuantity, getCartTotal } from '../utils/storage.js';
import { updateCartCount } from '../config.js';

export function initializeCartSidebar() {
    const sidebar = document.querySelector('.cart-sidebar');
    if (!sidebar) return;

    // Close button
    const closeBtn = sidebar.querySelector('.cart-close');
    closeBtn?.addEventListener('click', closeCartSidebar);

    // Overlay click
    const overlay = document.querySelector('.cart-overlay');
    overlay?.addEventListener('click', closeCartSidebar);

    // Update cart display
    updateCartDisplay();
}

export function openCartSidebar() {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-overlay');

    sidebar?.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';

    updateCartDisplay();
}

export function closeCartSidebar() {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-overlay');

    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
}

function updateCartDisplay() {
    const cart = getCart();
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const emptyCart = document.querySelector('.empty-cart');

    if (!cartItems || !cartTotal || !emptyCart) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '';
        cartTotal.textContent = formatCurrency(0);
        emptyCart.style.display = 'block';
        return;
    }

    emptyCart.style.display = 'none';

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">${formatCurrency(item.price)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-action="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-action="increase">+</button>
                </div>
            </div>
            <button class="cart-item-remove" data-action="remove">
                <i class="icon-trash"></i>
            </button>
        </div>
    `).join('');

    cartTotal.textContent = formatCurrency(getCartTotal());

    // Add event listeners to cart items
    attachCartItemListeners();
}

function attachCartItemListeners() {
    // Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });

    // Remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', handleRemoveItem);
    });
}

function handleQuantityChange(e) {
    const item = e.target.closest('.cart-item');
    const productId = item.dataset.productId;
    const action = e.target.dataset.action;
    const currentQuantity = parseInt(item.querySelector('.quantity').textContent);

    let newQuantity = currentQuantity;
    if (action === 'increase') {
        newQuantity += 1;
    } else if (action === 'decrease' && currentQuantity > 1) {
        newQuantity -= 1;
    }

    updateCartItemQuantity(productId, newQuantity);
    updateCartDisplay();
    updateCartCount();
}

function handleRemoveItem(e) {
    const item = e.target.closest('.cart-item');
    const productId = item.dataset.productId;

    removeFromCart(productId);
    updateCartDisplay();
    updateCartCount();
    showToast('Item removed from cart', 'info');
}

// Checkout button
export function handleCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }

    // Navigate to checkout page
    window.location.href = '/checkout';
}

// Toast placeholder
function showToast(message, type) {
    console.log(`${type}: ${message}`);
}