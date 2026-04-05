
import dataService from '../services/dataService.js';
import { showToast } from '../components/toast.js';

class ShopPage {
    constructor() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.setupCategoryFilter();
        this.setupSearch();
    }

    async loadProducts() {
        try {
            // Show loading state
            this.showLoading();

            // Get products from data service (combines admin + static)
            this.allProducts = await dataService.getProducts();
            this.filteredProducts = [...this.allProducts];

            console.log(`✅ Shop loaded ${this.filteredProducts.length} products`);

            this.renderProducts();
            this.setupPagination();
        } catch (error) {
            console.error('Failed to load products:', error);
            this.showError('Unable to load products. Please refresh the page.');
        }
    }

    refreshProducts() {
        this.loadProducts();
    }

    showLoading() {
        const container = document.querySelector('.products-grid');
        if (container) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading products...</p>
                </div>
            `;
        }
    }

    showError(message) {
        const container = document.querySelector('.products-grid');
        if (!container) return;

        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
    }

    renderProducts() {
        const container = document.querySelector('.products-grid');
        if (!container) return;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const productsToShow = this.filteredProducts.slice(start, end);

        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <p>No products found.</p>
                    ${this.filterProducts.length === 0 ? '<button onclick="location.reload()">Reset Filters</button>' : ''}
                </div>
            `;
            return;
        }

        container.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        this.attachProductCardEvents();
    }

    createProductCard(product) {
        const imageUrl = product.images && product.images[0] ? product.images[0] : (product.image || '/assets/images/placeholder.jpg');
        const price = product.price || 0;
        const name = product.name || 'Unnamed Product';

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${name}" loading="lazy">
                    <div class="product-actions">
                        <button class="quick-view-btn" data-id="${product.id}">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                        <button class="wishlist-btn" data-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${name}</h3>
                    <p class="product-price">$${price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    attachProductCardEvents() {
        // Product card click (navigate to detail)
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.add-to-cart-btn') && !e.target.closest('.wishlist-btn') && !e.target.closest('.quick-view-btn')) {
                    const productId = card.dataset.productId;
                    window.location.href = `/product.html?id=${productId}`;
                }
            });
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                const product = this.allProducts.find(p => parseInt(p.id) === productId);
                if (product) {
                    dataService.addToCart(product, 1);
                    showToast(`${product.name} added to cart!`, 'success');
                }
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                const product = this.allProducts.find(p => parseInt(p.id) === productId);
                if (product) {
                    if (dataService.isInWishlist(productId)) {
                        dataService.removeFromWishlist(productId);
                        showToast(`${product.name} removed from wishlist`, 'info');
                    } else {
                        dataService.addToWishlist(product);
                        showToast(`${product.name} added to wishlist!`, 'success');
                    }
                    this.updateWishlistIcons();
                }
            });
        });

        // Quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.id;
                window.location.href = `/product.html?id=${productId}`;
            });
        });
    }

    updateWishlistIcons() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = parseInt(btn.dataset.id);
            if (dataService.isInWishlist(productId)) {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                btn.classList.add('active');
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.classList.remove('active');
            }
        });
    }

    setupCategoryFilter() {
        const categoryFilter = document.querySelector('#category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.applyFilters();
            });
        }
    }

    setupSearch() {
        const searchInput = document.querySelector('#search-input');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.searchQuery = e.target.value.toLowerCase();
                    this.applyFilters();
                }, 300);
            });
        }
    }

    applyFilters() {
        let filtered = [...this.allProducts];

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === this.currentCategory);
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(this.searchQuery) ||
                (p.description && p.description.toLowerCase().includes(this.searchQuery))
            );
        }

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
        this.setupPagination();
    }

    setupPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        const paginationContainer = document.querySelector('.pagination');

        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let paginationHtml = '<button class="prev-btn" ' + (this.currentPage === 1 ? 'disabled' : '') + '>Previous</button>';

        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            paginationHtml += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        if (totalPages > 5) {
            paginationHtml += '<span>...</span>';
            paginationHtml += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        paginationHtml += '<button class="next-btn" ' + (this.currentPage === totalPages ? 'disabled' : '') + '>Next</button>';

        paginationContainer.innerHTML = paginationHtml;

        // Attach pagination events
        paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.dataset.page);
                this.renderProducts();
                this.setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        const prevBtn = paginationContainer.querySelector('.prev-btn');
        const nextBtn = paginationContainer.querySelector('.next-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderProducts();
                    this.setupPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderProducts();
                    this.setupPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }

    setupEventListeners() {
        // Listen for product updates from admin
        window.addEventListener('productsUpdated', () => {
            console.log('🔄 Products updated, refreshing shop...');
            this.refreshProducts();
        });

        // Listen for cart updates to update any cart-related UI
        window.addEventListener('cartUpdated', () => {
            // Update any cart-related UI elements
            this.updateCartUI();
        });
    }

    updateCartUI() {
        // Update cart count display if needed
        const cartCount = dataService.getCartCount();
        const cartBadges = document.querySelectorAll('.cart-count');
        cartBadges.forEach(badge => {
            badge.textContent = cartCount;
            badge.style.display = cartCount > 0 ? 'flex' : 'none';
        });
    }
}

// Initialize shop when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.shop = new ShopPage();
});

export default ShopPage;
            await this.loadProducts();
            this.setupEventListeners();
            this.renderProducts();
            this.updateResultsCount();
        } catch (error) {
            console.error('Error initializing shop page:', error);
            showToast('Error loading products. Please try again.', 'error');
        } finally {
            hideLoader();
        }
    }

    async loadCategories() {
        try {
            // Use dataService to get all products (admin + static)
            const productsForCategories = await dataService.getProducts();

            // Extract unique categories
            const categorySet = new Set(productsForCategories.map(p => p.category).filter(Boolean));
            this.categories = Array.from(categorySet).map(cat => ({ id: cat, name: cat }));

            console.log(`✅ Loaded ${this.categories.length} categories from ${productsForCategories.length} products`);

        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async loadProducts() {
        try {
            // Use dataService which handles admin products + static products automatically
            const products = await dataService.getProducts();

            if (products.length > 0) {
                this.allProducts = products;
                this.filteredProducts = [...this.allProducts];
                console.log(`✅ Loaded ${products.length} products from dataService`);
            } else {
                console.warn('⚠️ No products loaded from dataService');
                this.allProducts = [];
                this.filteredProducts = [];
            }

        } catch (error) {
            console.error('❌ Error loading products:', error);
            // Ultimate fallback
            this.allProducts = [];
            this.filteredProducts = [];
        }
    }

    setupEventListeners() {
        // Listen for admin product saves
        window.addEventListener('adminProductSaved', () => {
            console.log('📦 Admin product saved, refreshing shop...');
            this.refreshProducts();
        });

        // Category filters
        document.querySelectorAll('#categoryFilters input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleCategoryFilter());
        });

        // Price range
        document.getElementById('priceMin').addEventListener('input', () => this.handlePriceFilter());
        document.getElementById('priceMax').addEventListener('input', () => this.handlePriceFilter());

        // Material filters
        document.querySelectorAll('#materialFilters input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleMaterialFilter());
        });

        // Color filters
        document.querySelectorAll('#colorFilters input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleColorFilter());
        });

        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortProducts();
            this.renderProducts();
        });

        // View toggle
        document.getElementById('gridView').addEventListener('click', () => this.toggleView('grid'));
        document.getElementById('listView').addEventListener('click', () => this.toggleView('list'));

        // Product actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-cart-btn')) {
                e.preventDefault();
                e.stopPropagation(); // Prevent card click
                const productId = e.target.closest('.product-card').dataset.id;
                this.addToCart(productId);
            }

            if (e.target.closest('.wishlist-btn')) {
                e.preventDefault();
                e.stopPropagation(); // Prevent card click
                const productId = e.target.closest('.product-card').dataset.id;
                this.toggleWishlist(productId);
            }

            if (e.target.closest('.quick-view-btn')) {
                e.preventDefault();
                e.stopPropagation(); // Prevent card click
                const productId = e.target.closest('.product-card').dataset.id;
                this.viewProductDetails(productId);
            }
        });
    }

    attachProductCardListeners() {
        // Add click listeners to product cards for navigation to detail page
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Only navigate if not clicking on action buttons
                if (!e.target.closest('.action-btn')) {
                    const productId = card.dataset.id;
                    this.viewProductDetails(productId);
                }
            });
        });
    }

    renderCategoryFilters() {
        const container = document.getElementById('categoryFilters');
        container.innerHTML = `
            <label><input type="radio" name="category" value="all" checked> All Categories</label>
            ${this.categories.map(category => `
                <label><input type="radio" name="category" value="${category.id}"> ${category.name}</label>
            `).join('')}
        `;

        // Re-attach event listeners
        document.querySelectorAll('#categoryFilters input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleCategoryFilter());
        });
    }

    handleCategoryFilter() {
        const selectedCategory = document.querySelector('#categoryFilters input:checked').value;
        this.currentFilters.category = selectedCategory;
        this.applyFilters();
    }

    handlePriceFilter() {
        const minPrice = parseInt(document.getElementById('priceMin').value) || 0;
        const maxPrice = parseInt(document.getElementById('priceMax').value) || 5000;

        document.getElementById('minPrice').textContent = `$${minPrice}`;
        document.getElementById('maxPrice').textContent = `$${maxPrice}`;

        this.currentFilters.priceRange = { min: minPrice, max: maxPrice };
        this.applyFilters();
    }

    handleMaterialFilter() {
        const selectedMaterials = Array.from(document.querySelectorAll('#materialFilters input:checked'))
            .map(cb => cb.value);
        this.currentFilters.material = selectedMaterials;
        this.applyFilters();
    }

    handleColorFilter() {
        const selectedColors = Array.from(document.querySelectorAll('#colorFilters input:checked'))
            .map(cb => cb.value);
        this.currentFilters.color = selectedColors;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredProducts = this.allProducts.filter(product => {
            // Category filter
            if (this.currentFilters.category !== 'all' && product.category !== this.currentFilters.category) {
                return false;
            }

            // Price filter
            if (product.price < this.currentFilters.priceRange.min || product.price > this.currentFilters.priceRange.max) {
                return false;
            }

            // Material filter
            if (this.currentFilters.material.length > 0 && !this.currentFilters.material.includes(product.material)) {
                return false;
            }

            // Color filter
            if (this.currentFilters.color.length > 0 && !this.currentFilters.color.some(color => product.colors.includes(color))) {
                return false;
            }

            return true;
        });

        this.sortProducts();
        this.renderProducts();
        this.updateResultsCount();
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            switch (this.currentSort) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });
    }

    renderProducts() {
        const container = document.getElementById('productsContainer');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        container.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-id="${product.id}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-img">
                    <img src="${this.getProductImage(product, 0)}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="action-btn quick-view-btn" data-id="${product.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn wishlist-btn ${this.isInWishlist(product.id) ? 'active' : ''}" data-id="${product.id}" title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="action-btn add-cart-btn" data-id="${product.id}" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-category">${product.category}</div>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${this.renderStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                </div>
            </div>
        `).join('');

        this.renderPagination();
        this.attachProductCardListeners();
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        renderPagination('pagination', totalPages, this.currentPage, (page) => {
            this.currentPage = page;
            this.renderProducts();
        });
    }

    getProductImages(product) {
        // Handle both formats: single image string or images array
        if (product.images && Array.isArray(product.images)) {
            return product.images;
        } else if (product.image) {
            // Convert single image to array format
            return [{ url: product.image }];
        }
        return [{ url: '/assets/images/placeholder.jpg' }];
    }

    getImageUrl(image) {
        // Handle both string URLs and object with url property
        return typeof image === 'string' ? image : image.url || '/assets/images/placeholder.jpg';
    }

    getProductImage(product, index = 0) {
        const images = this.getProductImages(product);
        return this.getImageUrl(images[index] || images[0]);
    }

    updateResultsCount() {
        const countElement = document.getElementById('resultsCount');
        countElement.textContent = this.filteredProducts.length;
    }

    toggleView(view) {
        const container = document.getElementById('productsContainer');
        const gridBtn = document.getElementById('gridView');
        const listBtn = document.getElementById('listView');

        if (view === 'grid') {
            container.classList.remove('list-view');
            container.classList.add('grid-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        } else {
            container.classList.remove('grid-view');
            container.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        }
    }

    async addToCart(productId) {
        try {
            const product = this.allProducts.find(p => p.id == productId);
            if (!product) return;

            dataService.addToCart(product, 1);
            showToast(`${product.name} added to cart!`, 'success');

            // Update cart count in navbar (handled by event listener)
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Error adding item to cart. Please try again.', 'error');
        }
    }

    async toggleWishlist(productId) {
        try {
            const product = this.allProducts.find(p => p.id == productId);
            if (!product) return;

            const isInWishlist = dataService.isInWishlist(productId);

            if (isInWishlist) {
                dataService.removeFromWishlist(productId);
                showToast(`${product.name} removed from wishlist!`, 'info');
            } else {
                dataService.addToWishlist(product);
                showToast(`${product.name} added to wishlist!`, 'success');
            }

            // Update wishlist button
            const wishlistBtn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
            if (wishlistBtn) {
                wishlistBtn.classList.toggle('active', !isInWishlist);
            }

            // Update wishlist count in navbar (handled by event listener)
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            showToast('Error updating wishlist. Please try again.', 'error');
        }
    }

    isInWishlist(productId) {
        return dataService.isInWishlist(productId);
    }

    viewProductDetails(productId) {
        // Navigate to product detail page
        window.location.href = `/product.html?id=${productId}`;
    }

    updateCartCount() {
        // This will be handled by the navbar component
        const event = new CustomEvent('cartUpdated');
        document.dispatchEvent(event);
    }

    updateWishlistCount() {
        // This will be handled by the navbar component
        const event = new CustomEvent('wishlistUpdated');
        document.dispatchEvent(event);
    }
}

// Initialize shop page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShopPage();
});
function updateActiveFilters() {
  const activeFiltersContainer = document.querySelector('.active-filters');
  activeFiltersContainer.innerHTML = '';

  // Get selected categories
  const selectedCategories = [];
  document.querySelectorAll('.filter-option input:checked').forEach(checkbox => {
    selectedCategories.push(checkbox.nextElementSibling.textContent);
  });

  // Get selected color
  const selectedColor = document.querySelector('.color-option.active').classList[1].replace('color-', '');

  // Get price range
  const minPrice = document.querySelector('.price-inputs input:first-child').value;
  const maxPrice = document.querySelector('.price-inputs input:last-child').value;

  // Add category filters
  selectedCategories.forEach(category => {
    const filterEl = document.createElement('div');
    filterEl.className = 'active-filter';
    filterEl.innerHTML = `
  ${category}
  <button><i class="fas fa-times"></i></button>
  `;
    activeFiltersContainer.appendChild(filterEl);
  });

  // Add color filter
  if (selectedColor) {
    const filterEl = document.createElement('div');
    filterEl.className = 'active-filter';
    filterEl.innerHTML = `
  Color: ${selectedColor}
  <button><i class="fas fa-times"></i></button>
  `;
    activeFiltersContainer.appendChild(filterEl);
  }

  // Add price filter
  if (minPrice > 0 || maxPrice < 10000) {
    const filterEl = document.createElement('div');
    filterEl.className = 'active-filter';
    filterEl.innerHTML = `
  Price: $${minPrice} - $${maxPrice}
  <button><i class="fas fa-times"></i></button>
  `;
    activeFiltersContainer.appendChild(filterEl);
  }

  // Add event listeners to remove buttons
  document.querySelectorAll('.active-filter button').forEach(btn => {
    btn.addEventListener('click', function () {
      this.parentElement.remove();
      showToast('Filter removed');
    });
  });
}

// Product Interactions
function initProductInteractions() {
  // Wishlist functionality
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');

  wishlistBtns.forEach(btn => {
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

  // Add to cart functionality
  const addCartBtns = document.querySelectorAll('.add-cart-btn');

  addCartBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;

      // Animation
      this.innerHTML = '<i class="fas fa-check"></i>';
      this.style.background = '#28a745';
      this.style.color = '#ffffff';

      // Show toast
      showToast(`${productName} added to cart`);

      // Add to recently viewed
      addToRecentlyViewed(productCard);

      // Reset button after delay
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        this.style.background = '';
        this.style.color = '';
      }, 2000);
    });
  });
}

// Quick View Modal
function initQuickViewModal() {
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  const modal = document.getElementById('quickViewModal');
  const modalClose = document.querySelector('.modal-close');

  // Product data
  const products = {
    1: {
      title: "Nordic Comfort Sofa",
      price: "$1,499",
      desc: "Experience ultimate comfort with our Nordic Comfort Sofa. Designed with premium materials and expert craftsmanship, this sofa offers exceptional support and style for your living space. Features high-density foam cushions, solid wood frame, and premium upholstery.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=958&q=80"
    },
    2: {
      title: "Velvet Accent Chair",
      price: "$499",
      desc: "Add a touch of elegance to your room with our Velvet Accent Chair. Featuring a luxurious velvet upholstery and solid wood legs, this chair combines comfort with sophisticated design. Perfect for reading corners, bedrooms, or as additional seating in your living area.",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=930&q=80"
    },
    3: {
      title: "Minimalist Dining Table",
      price: "$899",
      desc: "Our Minimalist Dining Table features clean lines and a sleek design that complements any dining space. Crafted from sustainable solid wood with a durable finish, this table is both stylish and functional. Perfect for intimate dinners or entertaining guests.",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
    },
    4: {
      title: "Modular Bookshelf System",
      price: "$1,299",
      desc: "Organize your space with our Modular Bookshelf System. This versatile storage solution can be configured in multiple ways to fit your space and needs. Made from high-quality materials with adjustable shelves, it's perfect for displaying books, decor, and more.",
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
    },
    5: {
      title: "Ergonomic Office Chair",
      price: "$399",
      desc: "Work in comfort with our Ergonomic Office Chair. Designed to support your posture during long work hours, this chair features adjustable height, lumbar support, and breathable mesh material. The swivel base and smooth-rolling casters make it easy to move around your workspace.",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    },
    6: {
      title: "Minimalist Writing Desk",
      price: "$599",
      desc: "Create a productive workspace with our Minimalist Writing Desk. Featuring a sleek design with clean lines, this desk offers ample surface area for your work essentials while maintaining a clutter-free appearance. Includes built-in cable management for a tidy setup.",
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80"
    }
  };

  // Open modal on quick view button click
  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const productId = this.getAttribute('data-id');
      const product = products[productId];

      if (product) {
        document.getElementById('modal-title').textContent = product.title;
        document.getElementById('modal-price').textContent = product.price;
        document.getElementById('modal-desc').textContent = product.desc;
        document.getElementById('modal-img').src = product.image;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal
  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Quantity selector
  const minusBtn = document.querySelector('.quantity-btn.minus');
  const plusBtn = document.querySelector('.quantity-btn.plus');
  const quantityInput = document.querySelector('.quantity-input');

  minusBtn.addEventListener('click', function () {
    let value = parseInt(quantityInput.value);
    if (value > 1) {
      quantityInput.value = value - 1;
    }
  });

  plusBtn.addEventListener('click', function () {
    let value = parseInt(quantityInput.value);
    quantityInput.value = value + 1;
  });

  // Color options in modal
  const colorOptions = document.querySelectorAll('.option-value');
  colorOptions.forEach(option => {
    option.addEventListener('click', function () {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Add to cart in modal
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  addToCartBtn.addEventListener('click', function () {
    const productName = document.getElementById('modal-title').textContent;
    const quantity = document.querySelector('.quantity-input').value;

    // Animation
    this.textContent = 'Added to Cart!';
    this.style.background = '#28a745';

    // Show toast
    showToast(`${quantity} ${productName} added to cart`);

    // Reset button after delay
    setTimeout(() => {
      this.textContent = 'Add to Cart';
      this.style.background = '';
      closeModal();
    }, 2000);
  });
}

// Close Modal
function closeModal() {
  const modal = document.getElementById('quickViewModal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// View Toggle
function initViewToggle() {
  const viewBtns = document.querySelectorAll('.view-btn');
  const productsGrid = document.querySelector('.products-grid');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const view = this.getAttribute('data-view');

      viewBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      if (view === 'list') {
        productsGrid.classList.add('list-view');
      } else {
        productsGrid.classList.remove('list-view');
      }
    });
  });
}

// Initialize Recently Viewed
function initRecentlyViewed() {
  // Load recently viewed products from localStorage
  loadRecentlyViewed();

  // Setup clear button event listener
  document.getElementById('clearRecentlyViewed').addEventListener('click', clearRecentlyViewed);
}

// Load Recently Viewed Products
function loadRecentlyViewed() {
  const recentlyViewedGrid = document.getElementById('recentlyViewedGrid');
  const clearButton = document.getElementById('clearRecentlyViewed');

  // Get recently viewed from localStorage
  let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

  // Clear the grid
  recentlyViewedGrid.innerHTML = '';

  if (recentlyViewed.length === 0) {
    // Show empty state
    recentlyViewedGrid.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-eye-slash"></i>
            <p>You haven't viewed any products yet.</p>
            <p>Start browsing our collection to see them here!</p>
          </div>
        `;
    clearButton.style.display = 'none';
    return;
  }

  // Show clear button
  clearButton.style.display = 'block';

  // Add products to grid
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
      <span class="recent-current-price">${product.price}</span>
      ${product.originalPrice ? `<span class="recent-original-price">${product.originalPrice}</span>` : ''}
    </div>
    <button class="view-again-btn" data-id="${product.id}">View Again</button>
  </div>
  `;

    recentlyViewedGrid.appendChild(productCard);

    // Add animation after a small delay
    setTimeout(() => {
      productCard.classList.add('visible');
    }, 100);

    // Add event listener to view again button
    productCard.querySelector('.view-again-btn').addEventListener('click', function () {
      const productId = this.getAttribute('data-id');
      viewProductAgain(productId);
    });
  });
}

// Add Product to Recently Viewed
function addToRecentlyViewed(productCard) {
  const product = {
    id: productCard.querySelector('.quick-view-btn').getAttribute('data-id'),
    name: productCard.querySelector('h3').textContent,
    price: productCard.querySelector('.current-price').textContent,
    originalPrice: productCard.querySelector('.original-price') ? productCard.querySelector('.original-price').textContent : null,
    image: productCard.querySelector('img').src,
    category: productCard.querySelector('.product-category').textContent
  };

  // Get current recently viewed from localStorage
  let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

  // Remove the product if it already exists (to avoid duplicates)
  recentlyViewed = recentlyViewed.filter(p => p.id !== product.id);

  // Add the new product to the beginning of the array
  recentlyViewed.unshift(product);

  // Limit to 8 most recent products
  if (recentlyViewed.length > 8) {
    recentlyViewed = recentlyViewed.slice(0, 8);
  }

  // Save back to localStorage
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));

  // Update the UI
  loadRecentlyViewed();
}

// Clear Recently Viewed
function clearRecentlyViewed() {
  // Clear from localStorage
  localStorage.removeItem('recentlyViewed');

  // Show confirmation toast
  showToast('Recently viewed cleared');

  // Update the UI
  loadRecentlyViewed();
}

// View Product Again
function viewProductAgain(productId) {
  showToast('Opening product details...');

  // Find the product in recently viewed
  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
  const product = recentlyViewed.find(p => p.id === productId);

  if (product) {
    // Simulate opening the quick view modal
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = product.price;
    document.getElementById('modal-desc').textContent = `Viewing ${product.name} again.`;
    document.getElementById('modal-img').src = product.image;

    document.getElementById('quickViewModal').classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

// Show Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Sort functionality
const sortSelect = document.querySelector('.sort-select');
sortSelect.addEventListener('change', function () {
  showToast(`Sorted by: ${this.options[this.selectedIndex].text}`);
});

// Load more products
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.addEventListener('click', function () {
  // Show loading
  this.textContent = 'Loading...';
  this.disabled = true;

  // Simulate loading more products
  setTimeout(() => {
    this.textContent = 'Load More Products';
    this.disabled = false;
    showToast('More products loaded');
  }, 1500);
});

// Pagination
const paginationBtns = document.querySelectorAll('.pagination-btn');
paginationBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    if (this.classList.contains('active')) return;

    // Update active button
    document.querySelector('.pagination-btn.active').classList.remove('active');
    this.classList.add('active');

    showToast(`Page ${this.textContent} loaded`);
  });
});
