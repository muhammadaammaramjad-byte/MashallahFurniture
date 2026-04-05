import { includeHTML } from '../js/components.js';
import { addToCart as storeAddToCart, getCartTotal, getCartCount, getCart } from '../js/store.js';

const productsGrid = document.querySelector('.products-grid');
const productsCount = document.querySelector('.products-count');
const sortSelect = document.querySelector('.sort-select');
const loadMoreBtn = document.querySelector('.load-more');
const paginationBtns = document.querySelectorAll('.pagination-btn');

let allProducts = [];
let filteredProducts = [];
let cartMini;
let cartOverlay;
let cartCountLabel;
let cartMiniItems;
let cartMiniSubtotal;
let viewCartBtn;
let checkoutBtn;
let closeCartMiniBtn;
let openCartMiniBtn;

function formatCurrency(value) {
  return value.toFixed(2);
}

function updateCartMiniUI(cartData = getCart()) {
  if (!cartMiniItems || !cartMiniSubtotal || !cartCountLabel) return;
  const count = cartData.reduce((sum, item) => sum + item.quantity, 0);
  cartCountLabel.textContent = count;
  cartMiniItems.innerHTML = cartData.length > 0
    ? cartData.map((item) => `
      <div class="cart-mini-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-mini-item-info">
          <span>${item.name}</span>
          <small>${item.quantity} × $${formatCurrency(item.price)}</small>
        </div>
        <span class="cart-mini-item-total">$${formatCurrency(item.price * item.quantity)}</span>
      </div>
    `).join('')
    : '<p class="empty-cart">Your cart is empty.</p>';
  cartMiniSubtotal.textContent = formatCurrency(getCartTotal());
}

function openCartMini() {
  cartMini?.classList.add('open');
  cartOverlay?.classList.add('active');
}

function closeCartMini() {
  cartMini?.classList.remove('open');
  cartOverlay?.classList.remove('active');
}

function setupCartMiniElements() {
  cartMini = document.getElementById('cartMini');
  cartOverlay = document.getElementById('cartOverlay');
  cartCountLabel = document.getElementById('cartCount') || document.getElementById('miniCartCount');
  cartMiniItems = document.getElementById('cartMiniItems');
  cartMiniSubtotal = document.getElementById('cartMiniSubtotal');
  viewCartBtn = document.getElementById('viewCartBtn');
  checkoutBtn = document.getElementById('checkoutBtn');
  closeCartMiniBtn = document.getElementById('closeCartMini');
  openCartMiniBtn = document.getElementById('openCartMiniBtn');

  openCartMiniBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    openCartMini();
  });
  closeCartMiniBtn?.addEventListener('click', closeCartMini);
  cartOverlay?.addEventListener('click', closeCartMini);
  viewCartBtn?.addEventListener('click', () => {
    window.location.href = '../nav-btn/cart.html';
  });
  checkoutBtn?.addEventListener('click', () => {
    window.location.href = '../nav-btn/cart.html';
  });

  updateCartMiniUI(storeCart);
}

window.addEventListener('cartUpdated', (event) => {
  const { cart: updatedCart, count } = event.detail || {};
  if (cartCountLabel) cartCountLabel.textContent = count ?? getCartCount();
  updateCartMiniUI(updatedCart);
});

window.addEventListener('mashallahStoreUpdated', () => {
  updateCartMiniUI(storeCart);
});

const DEFAULT_PRODUCTS = [
  {
    id: 'fn001',
    name: 'Velvet Tufted Sofa',
    brand: 'LuxLiving',
    category: 'Sofas',
    collection: 'Luxury Velvet',
    price: 899,
    oldPrice: 1299,
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=958&q=80',
    inStock: true,
    colors: ['teal', 'grey', 'navy'],
    badge: 'NEW',
    description: 'A plush velvet sofa with deep tufting and elegant curves for luxury living rooms.'
  },
  {
    id: 'fn002',
    name: 'Solid Oak Dining Table',
    brand: 'Rustic Oak',
    category: 'Tables',
    collection: 'Rustic Oak',
    price: 549,
    oldPrice: null,
    rating: 4.9,
    reviews: 76,
    image: 'https://images.unsplash.com/photo-1549187774-b4e9d37b4f3c?auto=format&fit=crop&w=930&q=80',
    inStock: true,
    colors: ['oak', 'walnut'],
    badge: 'SALE',
    description: 'A durable solid oak dining table with a warm finish and timeless silhouette.'
  },
  {
    id: 'fn003',
    name: 'Modern Minimal Armchair',
    brand: 'Modern Minimal',
    category: 'Chairs',
    collection: 'Modern Minimal',
    price: 229,
    oldPrice: 299,
    rating: 4.6,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=930&q=80',
    inStock: true,
    colors: ['white', 'black', 'sage'],
    badge: 'POPULAR',
    description: 'A sleek accent chair with soft upholstery and a compact footprint for modern interiors.'
  },
  {
    id: 'fn004',
    name: 'Edge-Lit Console Table',
    brand: 'Contemporary Glow',
    category: 'Storage',
    collection: 'Contemporary Glow',
    price: 349,
    oldPrice: 419,
    rating: 4.5,
    reviews: 54,
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=774&q=80',
    inStock: true,
    colors: ['black', 'white'],
    badge: 'TRENDING',
    description: 'A modern console table with edge lighting and hidden storage for contemporary foyers.'
  },
  {
    id: 'fn005',
    name: 'Linen Accent Bed',
    brand: 'Coastal Linen',
    category: 'Beds',
    collection: 'Coastal Linen',
    price: 1199,
    oldPrice: 1499,
    rating: 4.9,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    inStock: false,
    colors: ['sand', 'cream'],
    badge: 'OUT OF STOCK',
    description: 'A luxurious linen bed frame with a soft upholstered headboard and coastal-inspired styling.'
  },
  {
    id: 'fn006',
    name: 'Brass Floor Lamp',
    brand: 'Golden Hour',
    category: 'Lighting',
    collection: 'Golden Hour',
    price: 129,
    oldPrice: null,
    rating: 4.7,
    reviews: 68,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=870&q=80',
    inStock: true,
    colors: ['brass', 'black'],
    badge: 'BEST SELLER',
    description: 'A timeless brass floor lamp with soft warm light and an elegant slim profile.'
  },
  {
    id: 'fn007',
    name: 'Modular Bookshelf System',
    brand: 'UrbanFlame',
    category: 'Storage',
    collection: 'Urban Organics',
    price: 1299,
    oldPrice: null,
    rating: 4.7,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?auto=format&fit=crop&w=687&q=80',
    inStock: true,
    colors: ['walnut', 'white'],
    badge: 'DEAL',
    description: 'A modular bookshelf system designed for flexible storage and curated display.'
  },
  {
    id: 'fn008',
    name: 'Minimalist Writing Desk',
    brand: 'Studio Work',
    category: 'Tables',
    collection: 'Studio Work',
    price: 599,
    oldPrice: null,
    rating: 4.5,
    reviews: 113,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=464&q=80',
    inStock: true,
    colors: ['black', 'white'],
    badge: 'NEW',
    description: 'A clean-lined writing desk with cable management and a compact footprint.'
  },
  {
    id: 'fn009',
    name: 'Rustic Leather Ottoman',
    brand: 'Rustic Luxe',
    category: 'Accent',
    collection: 'Rustic Luxe',
    price: 249,
    oldPrice: 329,
    rating: 4.4,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef5?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    colors: ['brown', 'tan'],
    badge: 'LIMITED',
    description: 'A handcrafted leather ottoman with rustic stitching and soft seating.'
  },
  {
    id: 'fn010',
    name: 'Nordic Side Table',
    brand: 'Nordic Calm',
    category: 'Tables',
    collection: 'Nordic Calm',
    price: 179,
    oldPrice: 229,
    rating: 4.6,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    colors: ['birch', 'white'],
    badge: 'POPULAR',
    description: 'A compact nordic-inspired side table with a clean silhouette and light finish.'
  }
];

async function loadProducts() {
  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return Array.isArray(data) ? data : DEFAULT_PRODUCTS;
  } catch (error) {
    console.warn('Could not load products.json, using fallback data.', error);
    return DEFAULT_PRODUCTS;
  }
}

function formatStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  let stars = '';
  for (let i = 0; i < fullStars; i += 1) stars += '<i class="fas fa-star"></i>';
  if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
  const totalStars = fullStars + (halfStar ? 1 : 0);
  for (let i = totalStars; i < 5; i += 1) stars += '<i class="far fa-star"></i>';
  return stars;
}

function renderProductCard(product) {
  const badgeHtml = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
  const originalPrice = product.oldPrice ? `<span class="original-price">$${product.oldPrice}</span>` : '';
  const stockClass = product.inStock ? 'in-stock' : 'out-of-stock';
  const stockText = product.inStock ? 'In Stock' : 'Out of Stock';

  return `
  <div class="product-card">
    ${badgeHtml}
    <div class="product-img">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-actions">
        <button class="action-btn quick-view-btn" data-id="${product.id}"><i class="fas fa-eye"></i></button>
        <button class="action-btn wishlist-btn"><i class="fas fa-heart"></i></button>
        <button class="action-btn add-cart-btn" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
      </div>
    </div>
    <div class="product-info">
      <h3>${product.name}</h3>
      <div class="product-category">${product.category}</div>
      <div class="product-price">
        <span class="current-price">$${product.price}</span>
        ${originalPrice}
      </div>
      <div class="product-rating">
        ${formatStars(product.rating)}
        <span>(${product.reviews})</span>
      </div>
      <div class="stock-status ${stockClass}">${stockText}</div>
    </div>
  </div>`;
}

function renderProducts(products) {
  if (!productsGrid) return;
  productsGrid.innerHTML = products.map((product) => renderProductCard(product)).join('');
  const total = allProducts.length;
  const shown = products.length;
  if (productsCount) productsCount.textContent = `Showing ${shown} of ${total} products`;
  initProductInteractions();
  initQuickViewModal();
}

function getSelectedBrandFilters() {
  return Array.from(document.querySelectorAll('.filter-option input:checked')).map((checkbox) => checkbox.nextElementSibling.textContent.trim());
}

function getSelectedColorFilter() {
  const selected = document.querySelector('.color-option.active');
  return selected ? selected.className.split(' ').find((cls) => cls.startsWith('color-')).replace('color-', '') : null;
}

function getPriceRange() {
  const minInput = document.querySelector('.price-inputs input:first-child');
  const maxInput = document.querySelector('.price-inputs input:last-child');
  return {
    min: Number(minInput?.value) || 0,
    max: Number(maxInput?.value) || 10000
  };
}

function applySort(products) {
  const value = sortSelect ? sortSelect.value : 'popularity';
  return products.slice().sort((a, b) => {
    switch (value) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return a.id.localeCompare(b.id);
      default:
        return 0;
    }
  });
}

function applyFilters() {
  const brandFilters = getSelectedBrandFilters();
  const selectedColor = getSelectedColorFilter();
  const { min, max } = getPriceRange();
  let filtered = allProducts.slice();
  if (brandFilters.length > 0) {
    filtered = filtered.filter((product) => brandFilters.includes(product.brand));
  }
  if (selectedColor) {
    filtered = filtered.filter((product) => product.colors.some((color) => color.toLowerCase() === selectedColor.toLowerCase()));
  }
  filtered = filtered.filter((product) => product.price >= min && product.price <= max);
  filtered = applySort(filtered);
  filteredProducts = filtered;
  renderProducts(filteredProducts);
  updateActiveFilters();
}

function initShopPage() {
  initFilters();
  initViewToggle();
  initRecentlyViewed();
  updateActiveFilters();
}

document.addEventListener('DOMContentLoaded', async function () {
  await includeHTML();
  setupCartMiniElements();
  allProducts = await loadProducts();
  filteredProducts = [...allProducts];
  renderProducts(filteredProducts);
  initShopPage();
});

function initFilters() {
  const filterSections = document.querySelectorAll('.filter-section h3');
  filterSections.forEach((section) => {
    section.addEventListener('click', function () {
      const options = this.nextElementSibling;
      const icon = this.querySelector('i');
      options.classList.toggle('collapsed');
      icon.classList.toggle('fa-chevron-down');
      icon.classList.toggle('fa-chevron-up');
    });
  });
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach((option) => {
    option.addEventListener('click', function () {
      colorOptions.forEach((opt) => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });
  const priceSlider = document.querySelector('.price-slider');
  const minPriceInput = document.querySelector('.price-inputs input:first-child');
  const maxPriceInput = document.querySelector('.price-inputs input:last-child');
  priceSlider?.addEventListener('input', function () {
    if (maxPriceInput) maxPriceInput.value = this.value;
  });
  minPriceInput?.addEventListener('change', function () {
    if (maxPriceInput && parseInt(this.value, 10) > parseInt(maxPriceInput.value, 10)) {
      this.value = maxPriceInput.value;
    }
    if (priceSlider) priceSlider.min = this.value;
  });
  maxPriceInput?.addEventListener('change', function () {
    if (minPriceInput && parseInt(this.value, 10) < parseInt(minPriceInput.value, 10)) {
      this.value = minPriceInput.value;
    }
    if (priceSlider) priceSlider.value = this.value;
  });
  const filterBtn = document.querySelector('.filter-btn');
  filterBtn?.addEventListener('click', function () {
    applyFilters();
    showToast('Filters applied successfully');
  });
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      applyFilters();
    });
  }
}

function updateActiveFilters() {
  const activeFiltersContainer = document.querySelector('.active-filters');
  if (!activeFiltersContainer) return;
  activeFiltersContainer.innerHTML = '';
  const brandFilters = getSelectedBrandFilters();
  const selectedColor = getSelectedColorFilter();
  const { min, max } = getPriceRange();
  brandFilters.forEach((brand) => {
    const filterEl = document.createElement('div');
    filterEl.className = 'active-filter';
    filterEl.innerHTML = `${brand}<button><i class="fas fa-times"></i></button>`;
    activeFiltersContainer.appendChild(filterEl);
  });
  if (selectedColor) {
    const filterEl = document.createElement('div');
    filterEl.className = 'active-filter';
    filterEl.innerHTML = `Color: ${selectedColor}<button><i class="fas fa-times"></i></button>`;
    activeFiltersContainer.appendChild(filterEl);
  }
  if (min > 0 || max < 10000) {
    const filterEl = document.createElement('div');
    filterEl.className = 'active-filter';
    filterEl.innerHTML = `Price: $${min} - $${max}<button><i class="fas fa-times"></i></button>`;
    activeFiltersContainer.appendChild(filterEl);
  }
  document.querySelectorAll('.active-filter button').forEach((btn) => {
    btn.addEventListener('click', function () {
      this.parentElement.remove();
      showToast('Filter removed');
    });
  });
}

function initProductInteractions() {
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      this.classList.toggle('active');
      if (this.classList.contains('active')) {
        this.innerHTML = '<i class="fas fa-heart" style="color: #dc3545;"></i>';
        showToast('Added to wishlist');
      } else {
        this.innerHTML = '<i class="fas fa-heart"></i>';
        showToast('Removed from wishlist');
      }
    });
  });
  const addCartBtns = document.querySelectorAll('.add-cart-btn');
  addCartBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const productId = this.getAttribute('data-id');
      const product = allProducts.find((item) => item.id === productId);
      if (!product) return;
      storeAddToCart(product, 1);
      openCartMini();
      const productName = product.name;
      this.innerHTML = '<i class="fas fa-check"></i>';
      this.style.background = '#28a745';
      this.style.color = '#ffffff';
      showToast(`${productName} added to cart`);
      addToRecentlyViewed(this.closest('.product-card'));
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        this.style.background = '';
        this.style.color = '';
      }, 2000);
    });
  });
}

function initQuickViewModal() {
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  const modal = document.getElementById('quickViewModal');
  const modalClose = document.querySelector('.modal-close');
  const productMap = allProducts.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});
  quickViewBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const productId = this.getAttribute('data-id');
      const product = productMap[productId];
      if (product) {
        document.getElementById('modal-title').textContent = product.name;
        document.getElementById('modal-price').textContent = `$${product.price}`;
        document.getElementById('modal-desc').textContent = product.description || product.collection;
        document.getElementById('modal-img').src = product.image;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  const minusBtn = document.querySelector('.quantity-btn.minus');
  const plusBtn = document.querySelector('.quantity-btn.plus');
  const quantityInput = document.querySelector('.quantity-input');
  minusBtn?.addEventListener('click', function () {
    let value = Number(quantityInput.value);
    if (value > 1) quantityInput.value = value - 1;
  });
  plusBtn?.addEventListener('click', function () {
    let value = Number(quantityInput.value);
    quantityInput.value = value + 1;
  });
  const colorOptions = document.querySelectorAll('.option-value');
  colorOptions.forEach((option) => {
    option.addEventListener('click', function () {
      colorOptions.forEach((opt) => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  addToCartBtn?.addEventListener('click', function () {
    const productName = document.getElementById('modal-title').textContent;
    const quantity = document.querySelector('.quantity-input').value;
    this.textContent = 'Added to Cart!';
    this.style.background = '#28a745';
    showToast(`${quantity} ${productName} added to cart`);
    setTimeout(() => {
      this.textContent = 'Add to Cart';
      this.style.background = '';
      closeModal();
    }, 2000);
  });
}

function closeModal() {
  const modal = document.getElementById('quickViewModal');
  modal?.classList.remove('show');
  document.body.style.overflow = 'auto';
}

function initViewToggle() {
  const viewBtns = document.querySelectorAll('.view-btn');
  const productsGrid = document.querySelector('.products-grid');
  viewBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      viewBtns.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');
      if (this.dataset.view === 'list') {
        productsGrid?.classList.add('list-view');
      } else {
        productsGrid?.classList.remove('list-view');
      }
    });
  });
}

function initRecentlyViewed() {
  loadRecentlyViewed();
  document.getElementById('clearRecentlyViewed')?.addEventListener('click', clearRecentlyViewed);
}

function loadRecentlyViewed() {
  const recentlyViewedGrid = document.getElementById('recentlyViewedGrid');
  const clearButton = document.getElementById('clearRecentlyViewed');
  let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
  recentlyViewedGrid.innerHTML = '';
  if (recentlyViewed.length === 0) {
    recentlyViewedGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-eye-slash"></i>
        <p>You haven't viewed any products yet.</p>
        <p>Start browsing our collection to see them here!</p>
      </div>`;
    if (clearButton) clearButton.style.display = 'none';
    return;
  }
  if (clearButton) clearButton.style.display = 'block';
  recentlyViewed.forEach((product, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'recent-product-card';
    productCard.style.animationDelay = `${index * 0.1}s`;
    productCard.innerHTML = `
      <div class="recent-product-img">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="recent-product-info">
        <h3>${product.name}</h3>
        <div class="recent-product-price">
          <span class="recent-current-price">$${product.price}</span>
          ${product.originalPrice ? `<span class="recent-original-price">${product.originalPrice}</span>` : ''}
        </div>
        <button class="view-again-btn" data-id="${product.id}">View Again</button>
      </div>`;
    recentlyViewedGrid.appendChild(productCard);
    setTimeout(() => productCard.classList.add('visible'), 100);
    productCard.querySelector('.view-again-btn')?.addEventListener('click', function () {
      viewProductAgain(this.dataset.id);
    });
  });
}

function addToRecentlyViewed(productCard) {
  const product = {
    id: productCard.querySelector('.quick-view-btn')?.getAttribute('data-id'),
    name: productCard.querySelector('h3')?.textContent,
    price: productCard.querySelector('.current-price')?.textContent?.replace('$', ''),
    originalPrice: productCard.querySelector('.original-price')?.textContent || null,
    image: productCard.querySelector('img')?.src,
    category: productCard.querySelector('.product-category')?.textContent
  };
  let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
  recentlyViewed = recentlyViewed.filter((p) => p.id !== product.id);
  recentlyViewed.unshift(product);
  if (recentlyViewed.length > 8) recentlyViewed = recentlyViewed.slice(0, 8);
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  loadRecentlyViewed();
}

function clearRecentlyViewed() {
  localStorage.removeItem('recentlyViewed');
  showToast('Recently viewed cleared');
  loadRecentlyViewed();
}

function viewProductAgain(productId) {
  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
  const product = recentlyViewed.find((p) => p.id === productId);
  if (product) {
    const modal = document.getElementById('quickViewModal');
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `$${product.price}`;
    document.getElementById('modal-desc').textContent = `Viewing ${product.name} again.`;
    document.getElementById('modal-img').src = product.image;
    modal?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

loadMoreBtn?.addEventListener('click', function () {
  this.textContent = 'Loading...';
  this.disabled = true;
  setTimeout(() => {
    this.textContent = 'Load More Products';
    this.disabled = false;
    showToast('More products loaded');
  }, 1500);
});

paginationBtns.forEach((btn) => {
  btn.addEventListener('click', function () {
    if (this.classList.contains('active')) return;
    document.querySelector('.pagination-btn.active')?.classList.remove('active');
    this.classList.add('active');
    showToast(`Page ${this.textContent} loaded`);
  });
});
