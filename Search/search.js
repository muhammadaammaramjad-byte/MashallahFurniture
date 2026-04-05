import { includeHTML } from '../js/components.js';
import { addToCart } from '../js/store.js';

const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const resultCount = document.getElementById('resultCount');

let allProducts = [];
let currentResults = [];

const debounce = (fn, delay = 200) => {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
};

async function loadProducts() {
  try {
    const response = await fetch('../assets/data/products.json');
    if (!response.ok) throw new Error('Failed to load products');
    allProducts = await response.json();
  } catch (error) {
    console.warn('Search fallback - unable to load products.json', error);
    allProducts = [];
  }
  performSearch();
}

function getSearchQuery() {
  return searchInput.value.trim().toLowerCase();
}

function matchProduct(product, query, category) {
  const text = [product.name, product.brand, product.category, product.collection, product.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const matchesQuery = !query || text.includes(query);
  const matchesCategory = category === 'all' || product.category.toLowerCase() === category.toLowerCase();
  return matchesQuery && matchesCategory;
}

function sortProducts(results) {
  const mode = sortSelect.value;
  return results.slice().sort((a, b) => {
    if (mode === 'price-low') return a.price - b.price;
    if (mode === 'price-high') return b.price - a.price;
    if (mode === 'rating') return (b.rating || 0) - (a.rating || 0);
    return a.id.localeCompare(b.id);
  });
}

function renderProductCard(product) {
  const badgeHtml = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
  const originalPrice = product.oldPrice ? `<span class="original-price">$${product.oldPrice}</span>` : '';
  const stockClass = product.inStock ? 'in-stock' : 'out-of-stock';
  const stockText = product.inStock ? 'In Stock' : 'Out of Stock';
  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  let stars = '';
  for (let i = 0; i < fullStars; i += 1) stars += '<i class="fas fa-star"></i>';
  if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i += 1) stars += '<i class="far fa-star"></i>';

  return `
    <article class="product-card">
      ${badgeHtml}
      <div class="product-img">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-actions">
          <button class="action-btn add-cart-btn" data-id="${product.id}"> <i class="fas fa-shopping-cart"></i> </button>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-category">${product.category}</div>
        <div class="product-price">
          <span class="current-price">$${product.price}</span>
          ${originalPrice}
        </div>
        <div class="product-rating">${stars} <span>(${product.reviews || 0})</span></div>
        <div class="stock-status ${stockClass}">${stockText}</div>
      </div>
    </article>`;
}

function renderResults() {
  resultCount.textContent = currentResults.length;
  if (!currentResults.length) {
    searchResultsGrid.innerHTML = '<div class="no-results">No products match your search. Try a different keyword or category.</div>';
    return;
  }

  searchResultsGrid.innerHTML = currentResults.map(renderProductCard).join('');
  attachCardActions();
}

function attachCardActions() {
  searchResultsGrid.querySelectorAll('.add-cart-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const product = allProducts.find((item) => item.id === button.dataset.id);
      if (!product) return;
      addToCart({ ...product, quantity: 1 });
      showToast(`${product.name} added to cart`);
    });
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'rgba(0, 0, 0, 0.85)';
  toast.style.color = '#fff';
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = '999px';
  toast.style.zIndex = '10010';
  toast.style.boxShadow = '0 12px 30px rgba(0,0,0,0.22)';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

function performSearch() {
  const query = getSearchQuery();
  const category = categoryFilter.value;
  currentResults = sortProducts(allProducts.filter((product) => matchProduct(product, query, category)));
  renderResults();
}

function initEvents() {
  searchInput.addEventListener('input', debounce(() => {
    clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
    performSearch();
  }));

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    performSearch();
  });

  categoryFilter.addEventListener('change', performSearch);
  sortSelect.addEventListener('change', performSearch);
}

async function initPage() {
  await includeHTML();
  initEvents();
  await loadProducts();
}

window.addEventListener('DOMContentLoaded', initPage);
