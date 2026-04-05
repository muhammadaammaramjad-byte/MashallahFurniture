
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
  initShopPage();
});

// Initialize Shop Page
function initShopPage() {
  initFilters();
  initProductInteractions();
  initQuickViewModal();
  initViewToggle();
  initRecentlyViewed();
}

// Filters
function initFilters() {
  // Collapsible filter sections
  const filterSections = document.querySelectorAll('.filter-section h3');

  filterSections.forEach(section => {
    section.addEventListener('click', function () {
      const options = this.nextElementSibling;
      const icon = this.querySelector('i');

      options.classList.toggle('collapsed');
      icon.classList.toggle('fa-chevron-down');
      icon.classList.toggle('fa-chevron-up');
    });
  });

  // Color options
  const colorOptions = document.querySelectorAll('.color-option');

  colorOptions.forEach(option => {
    option.addEventListener('click', function () {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Price slider
  const priceSlider = document.querySelector('.price-slider');
  const minPriceInput = document.querySelector('.price-inputs input:first-child');
  const maxPriceInput = document.querySelector('.price-inputs input:last-child');

  priceSlider.addEventListener('input', function () {
    maxPriceInput.value = this.value;
  });

  minPriceInput.addEventListener('change', function () {
    if (parseInt(this.value) > parseInt(maxPriceInput.value)) {
      this.value = maxPriceInput.value;
    }
    priceSlider.min = this.value;
  });

  maxPriceInput.addEventListener('change', function () {
    if (parseInt(this.value) < parseInt(minPriceInput.value)) {
      this.value = minPriceInput.value;
    }
    priceSlider.value = this.value;
  });

  // Apply filters
  const filterBtn = document.querySelector('.filter-btn');

  filterBtn.addEventListener('click', function () {
    updateActiveFilters();
    showToast('Filters applied successfully');
  });
}

// Update Active Filters
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
