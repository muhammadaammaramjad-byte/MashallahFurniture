// Product Card Component
import { formatCurrency } from '../utils/helpers.js';
import { addToCart, addToWishlist, removeFromWishlist, isInWishlist } from '../utils/storage.js';
import { updateCartCount, updateWishlistCount } from '../config.js';

export function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card card';
    card.dataset.productId = product.id;

    const isInWishlistFlag = isInWishlist(product.id);

    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <button class="wishlist-btn ${isInWishlistFlag ? 'active' : ''}" aria-label="Add to wishlist">
                <i class="icon-heart"></i>
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">${formatCurrency(product.price)}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
                <button class="btn btn-outline quick-view-btn">Quick View</button>
            </div>
        </div>
    `;

    // Add event listeners
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    const wishlistBtn = card.querySelector('.wishlist-btn');
    const quickViewBtn = card.querySelector('.quick-view-btn');

    addToCartBtn.addEventListener('click', () => handleAddToCart(product));
    wishlistBtn.addEventListener('click', () => handleWishlistToggle(product, wishlistBtn));
    quickViewBtn.addEventListener('click', () => handleQuickView(product));

    return card;
}

function handleAddToCart(product) {
    addToCart(product);
    updateCartCount();
    showToast(`${product.name} added to cart!`, 'success');
}

function handleWishlistToggle(product, button) {
    const isInWishlistFlag = isInWishlist(product.id);

    if (isInWishlistFlag) {
        removeFromWishlist(product.id);
        button.classList.remove('active');
        showToast(`${product.name} removed from wishlist`, 'info');
    } else {
        addToWishlist(product);
        button.classList.add('active');
        showToast(`${product.name} added to wishlist!`, 'success');
    }

    updateWishlistCount();
}

function handleQuickView(product) {
    // Open quick view modal
    openQuickViewModal(product);
}

function openQuickViewModal(product) {
    const modal = document.querySelector('.quick-view-modal');
    if (!modal) return;

    // Populate modal with product details
    modal.querySelector('.product-title').textContent = product.name;
    modal.querySelector('.product-price').textContent = formatCurrency(product.price);
    modal.querySelector('.product-description').textContent = product.description;
    modal.querySelector('.product-image').src = product.image;

    // Show modal
    modal.classList.add('active');
}

// Toast function (placeholder)
function showToast(message, type) {
    console.log(`${type}: ${message}`);
    // Integrate with your toast component
}