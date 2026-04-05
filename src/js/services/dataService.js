// Centralized Data Management Service
// Handles all frontend data operations: products, cart, wishlist, user data

class DataService {
    constructor() {
        this.baseUrl = window.location.origin;
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.defaultCacheTime = 3600000; // 1 hour in milliseconds
    }

    // ==========================================
    // PRODUCT DATA MANAGEMENT
    // ==========================================

    /**
     * Fetch products from JSON file and localStorage with caching
     * @returns {Promise<Array>} Array of products
     */
    async getProducts() {
        const cacheKey = 'products';

        // Check cache first
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            // Load static products from JSON
            const response = await fetch(`${this.baseUrl}/data/products.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const staticProducts = await response.json();

            // Load admin products from localStorage
            const adminProducts = JSON.parse(localStorage.getItem('mashallah_products') || '[]');

            // Combine products, prioritizing admin products
            let allProducts = [];

            if (adminProducts.length > 0) {
                // Use admin products if available
                allProducts = adminProducts;
            } else {
                // Fallback to static products
                allProducts = staticProducts.filter(product => this.validateProduct(product));
            }

            // Cache the results
            this.setCache(cacheKey, allProducts);

            console.log(`✅ Loaded ${allProducts.length} products (${adminProducts.length} admin, ${staticProducts.length} static)`);
            return allProducts;

        } catch (error) {
            console.error('❌ Failed to load products:', error);
            return [];
        }
    }

    /**
     * Get single product by ID
     * @param {number|string} id - Product ID
     * @returns {Promise<Object|null>} Product object or null
     */
    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === parseInt(id)) || null;
    }

    /**
     * Filter products based on criteria
     * @param {Object} filters - Filter options
     * @returns {Promise<Array>} Filtered products
     */
    async filterProducts(filters = {}) {
        let products = await this.getProducts();

        if (filters.category && filters.category !== 'all') {
            products = products.filter(p => p.category?.toLowerCase() === filters.category.toLowerCase());
        }

        if (filters.minPrice !== undefined) {
            products = products.filter(p => p.price >= parseFloat(filters.minPrice));
        }

        if (filters.maxPrice !== undefined) {
            products = products.filter(p => p.price <= parseFloat(filters.maxPrice));
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase().trim();
            products = products.filter(p =>
                p.name?.toLowerCase().includes(searchTerm) ||
                p.description?.toLowerCase().includes(searchTerm) ||
                p.category?.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.inStock !== undefined) {
            products = products.filter(p => p.inStock === filters.inStock);
        }

        if (filters.sortBy) {
            products = this.sortProducts(products, filters.sortBy, filters.sortOrder || 'asc');
        }

        return products;
    }

    /**
     * Sort products by field
     * @param {Array} products - Products to sort
     * @param {string} field - Field to sort by
     * @param {string} order - 'asc' or 'desc'
     * @returns {Array} Sorted products
     */
    sortProducts(products, field, order = 'asc') {
        return [...products].sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            // Handle different data types
            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();

            if (order === 'desc') {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            } else {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            }
        });
    }

    // ==========================================
    // CART MANAGEMENT
    // ==========================================

    /**
     * Get cart from localStorage
     * @returns {Array} Cart items
     */
    getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            return cart.filter(item => this.validateCartItem(item));
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    /**
     * Add product to cart
     * @param {Object} product - Product to add
     * @param {number} quantity - Quantity to add
     * @returns {Array} Updated cart
     */
    addToCart(product, quantity = 1) {
        if (!this.validateProduct(product)) {
            console.error('Invalid product:', product);
            return this.getCart();
        }

        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.updatedAt = new Date().toISOString();
        } else {
            cart.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        this.saveCart(cart);
        this.dispatchCartEvent();
        console.log(`🛒 Added ${quantity}x ${product.name} to cart`);
        return cart;
    }

    /**
     * Remove item from cart
     * @param {number} productId - Product ID to remove
     * @returns {Array} Updated cart
     */
    removeFromCart(productId) {
        let cart = this.getCart();
        const itemToRemove = cart.find(item => item.id === productId);

        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
        this.dispatchCartEvent();

        if (itemToRemove) {
            console.log(`🗑️ Removed ${itemToRemove.name} from cart`);
        }

        return cart;
    }

    /**
     * Update item quantity in cart
     * @param {number} productId - Product ID
     * @param {number} quantity - New quantity
     * @returns {Array} Updated cart
     */
    updateCartQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                return this.removeFromCart(productId);
            }

            item.quantity = quantity;
            item.updatedAt = new Date().toISOString();
            this.saveCart(cart);
            this.dispatchCartEvent();
            console.log(`📝 Updated ${item.name} quantity to ${quantity}`);
        }

        return cart;
    }

    /**
     * Get cart total
     * @returns {Object} Cart totals
     */
    getCartTotals() {
        const cart = this.getCart();
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        return {
            subtotal: Math.round(subtotal * 100) / 100,
            itemCount,
            items: cart
        };
    }

    /**
     * Clear entire cart
     * @returns {Array} Empty cart
     */
    clearCart() {
        this.saveCart([]);
        this.dispatchCartEvent();
        console.log('🗑️ Cart cleared');
        return [];
    }

    /**
     * Save cart to localStorage
     * @param {Array} cart - Cart to save
     */
    saveCart(cart) {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // ==========================================
    // WISHLIST MANAGEMENT
    // ==========================================

    /**
     * Get wishlist from localStorage
     * @returns {Array} Wishlist items
     */
    getWishlist() {
        try {
            return JSON.parse(localStorage.getItem('wishlist')) || [];
        } catch (error) {
            console.error('Error loading wishlist:', error);
            return [];
        }
    }

    /**
     * Add product to wishlist
     * @param {Object} product - Product to add
     * @returns {Array} Updated wishlist
     */
    addToWishlist(product) {
        if (!this.validateProduct(product)) {
            console.error('Invalid product:', product);
            return this.getWishlist();
        }

        const wishlist = this.getWishlist();

        if (!wishlist.find(item => item.id === product.id)) {
            wishlist.push({
                ...product,
                addedAt: new Date().toISOString()
            });

            this.saveWishlist(wishlist);
            this.dispatchWishlistEvent();
            console.log(`❤️ Added ${product.name} to wishlist`);
        }

        return wishlist;
    }

    /**
     * Remove product from wishlist
     * @param {number} productId - Product ID to remove
     * @returns {Array} Updated wishlist
     */
    removeFromWishlist(productId) {
        let wishlist = this.getWishlist();
        const itemToRemove = wishlist.find(item => item.id === productId);

        wishlist = wishlist.filter(item => item.id !== productId);
        this.saveWishlist(wishlist);
        this.dispatchWishlistEvent();

        if (itemToRemove) {
            console.log(`💔 Removed ${itemToRemove.name} from wishlist`);
        }

        return wishlist;
    }

    /**
     * Check if product is in wishlist
     * @param {number} productId - Product ID
     * @returns {boolean} Whether product is in wishlist
     */
    isInWishlist(productId) {
        const wishlist = this.getWishlist();
        return wishlist.some(item => item.id === productId);
    }

    /**
     * Save wishlist to localStorage
     * @param {Array} wishlist - Wishlist to save
     */
    saveWishlist(wishlist) {
        try {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }

    // ==========================================
    // USER DATA MANAGEMENT
    // ==========================================

    /**
     * Get user data
     * @returns {Object|null} User data or null
     */
    getUser() {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch (error) {
            console.error('Error loading user data:', error);
            return null;
        }
    }

    /**
     * Save user data
     * @param {Object} userData - User data to save
     */
    saveUser(userData) {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('👤 User data saved');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    /**
     * Clear user data (logout)
     */
    logout() {
        localStorage.removeItem('user');
        this.clearCart();
        this.saveWishlist([]);
        console.log('👋 User logged out');
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    /**
     * Validate product object
     * @param {Object} product - Product to validate
     * @returns {boolean} Whether product is valid
     */
    validateProduct(product) {
        return product &&
               typeof product.id !== 'undefined' &&
               product.name &&
               typeof product.price === 'number' &&
               product.price > 0;
    }

    /**
     * Validate cart item
     * @param {Object} item - Cart item to validate
     * @returns {boolean} Whether item is valid
     */
    validateCartItem(item) {
        return item &&
               item.id &&
               item.quantity > 0 &&
               typeof item.price === 'number';
    }

    /**
     * Check if cache is valid
     * @param {string} key - Cache key
     * @returns {boolean} Whether cache is valid
     */
    isCacheValid(key) {
        return this.cache.has(key) &&
               this.cacheExpiry.has(key) &&
               Date.now() < this.cacheExpiry.get(key);
    }

    /**
     * Set cache with expiry
     * @param {string} key - Cache key
     * @param {*} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds
     */
    setCache(key, data, ttl = this.defaultCacheTime) {
        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + ttl);
    }

    /**
     * Clear all caches
     */
    clearCache() {
        this.cache.clear();
        this.cacheExpiry.clear();
        console.log('🗑️ Cache cleared');
    }

    /**
     * Dispatch cart update event
     */
    dispatchCartEvent() {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { cart: this.getCart() }
        }));
    }

    /**
     * Dispatch wishlist update event
     */
    dispatchWishlistEvent() {
        window.dispatchEvent(new CustomEvent('wishlistUpdated', {
            detail: { wishlist: this.getWishlist() }
        }));
    }

    /**
     * Export all data (for debugging)
     * @returns {Object} All stored data
     */
    exportData() {
        return {
            cart: this.getCart(),
            wishlist: this.getWishlist(),
            user: this.getUser(),
            cache: Object.fromEntries(this.cache),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Import data (for debugging/testing)
     * @param {Object} data - Data to import
     */
    importData(data) {
        if (data.cart) this.saveCart(data.cart);
        if (data.wishlist) this.saveWishlist(data.wishlist);
        if (data.user) this.saveUser(data.user);

        console.log('📥 Data imported');
    }
}

// Export singleton instance
export default new DataService();