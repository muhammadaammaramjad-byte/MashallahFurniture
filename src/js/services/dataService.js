/**
 * Enhanced Data Service for Mashallah Furniture
 * Handles products, cart, wishlist with advanced caching, filtering, and real-time updates
 */

class DataService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.defaultCacheTime = 3600000; // 1 hour
        this.baseUrl = window.location.origin;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for admin product saves
        window.addEventListener('adminProductSaved', () => {
            console.log('🔄 Admin product saved, clearing cache...');
            this.clearCache();
            this.dispatchProductsUpdated();
        });

        // Cross-tab synchronization
        window.addEventListener('storage', (e) => {
            if (e.key === 'mashallah_products' || e.key === 'cart' || e.key === 'wishlist') {
                console.log(`🔄 ${e.key} updated in another tab, syncing...`);
                this.clearCache();
                this.dispatchProductsUpdated();
                if (e.key === 'cart') this.dispatchCartEvent();
                if (e.key === 'wishlist') this.dispatchWishlistEvent();
            }
        });
    }

    // ==========================================
    // PRODUCT MANAGEMENT
    // ==========================================

    /**
     * Get all products with caching
     * @returns {Promise<Array>} Array of products
     */
    async getProducts() {
        if (this.isCacheValid('products')) {
            console.log('📦 Returning cached products');
            return this.cache.get('products');
        }

        try {
            // Load admin products from localStorage
            const adminProducts = JSON.parse(localStorage.getItem('mashallah_products') || '[]');

            // Load static products from JSON
            let staticProducts = [];
            try {
                const response = await fetch(`${this.baseUrl}/data/products.json`);
                if (response.ok) {
                    staticProducts = await response.json();
                }
            } catch (e) {
                console.warn('Could not load static products:', e);
            }

            // Combine products (admin products take priority)
            let allProducts = [...staticProducts];

            // Add or override with admin products
            adminProducts.forEach(adminProduct => {
                const index = allProducts.findIndex(p => p.id === adminProduct.id);
                if (index !== -1) {
                    allProducts[index] = adminProduct;
                } else {
                    allProducts.push(adminProduct);
                }
            });

            // Ensure each product has required fields and validate
            allProducts = allProducts
                .filter(product => this.validateProduct(product))
                .map(product => ({
                    ...product,
                    id: product.id || Date.now() + Math.random(),
                    images: Array.isArray(product.images) && product.images.length > 0
                        ? product.images
                        : [product.image || '/assets/images/placeholder.jpg'],
                    inStock: product.inStock !== false,
                    category: product.category || 'General',
                    rating: product.rating || 0,
                    reviews: product.reviews || 0,
                    tags: Array.isArray(product.tags) ? product.tags : [],
                    createdAt: product.createdAt || new Date().toISOString(),
                    updatedAt: product.updatedAt || new Date().toISOString()
                }));

            // Cache the result
            this.setCache('products', allProducts);

            console.log(`✅ Loaded ${allProducts.length} products (${adminProducts.length} from admin, ${staticProducts.length} from static)`);
            return allProducts;
        } catch (error) {
            console.error('Failed to load products:', error);
            return [];
        }
    }

    /**
     * Get product by ID
     * @param {number|string} id - Product ID
     * @returns {Promise<Object|null>} Product object or null
     */
    async getProductById(id) {
        const products = await this.getProducts();
        const productId = parseInt(id);
        return products.find(p => parseInt(p.id) === productId) || null;
    }

    /**
     * Filter and search products
     * @param {Object} filters - Filter options
     * @returns {Promise<Array>} Filtered products
     */
    async getFilteredProducts(filters = {}) {
        let products = await this.getProducts();

        // Search by name or description
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                (p.description && p.description.toLowerCase().includes(searchTerm)) ||
                (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }

        // Filter by category
        if (filters.category && filters.category !== 'all') {
            products = products.filter(p => p.category === filters.category);
        }

        // Filter by price range
        if (filters.minPrice !== undefined) {
            products = products.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            products = products.filter(p => p.price <= filters.maxPrice);
        }

        // Filter by stock status
        if (filters.inStock !== undefined) {
            products = products.filter(p => p.inStock === filters.inStock);
        }

        // Filter by tags
        if (filters.tags && filters.tags.length > 0) {
            products = products.filter(p =>
                filters.tags.some(tag => p.tags && p.tags.includes(tag))
            );
        }

        // Sort products
        if (filters.sortBy) {
            products = this.sortProducts(products, filters.sortBy, filters.sortOrder || 'asc');
        }

        return products;
    }

    /**
     * Get products by category
     * @param {string} category - Category name
     * @returns {Promise<Array>} Products in category
     */
    async getProductsByCategory(category) {
        return this.getFilteredProducts({ category });
    }

    /**
     * Get featured products
     * @param {number} limit - Number of products to return
     * @returns {Promise<Array>} Featured products
     */
    async getFeaturedProducts(limit = 8) {
        const products = await this.getProducts();
        return products
            .filter(p => p.featured || p.rating >= 4.5)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit);
    }

    /**
     * Get related products
     * @param {Object} product - Current product
     * @param {number} limit - Number of related products
     * @returns {Promise<Array>} Related products
     */
    async getRelatedProducts(product, limit = 4) {
        const products = await this.getProducts();
        return products
            .filter(p =>
                p.id !== product.id &&
                (p.category === product.category ||
                 p.tags.some(tag => product.tags.includes(tag)))
            )
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit);
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
     * Get cart totals
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
    // CATEGORIES & COLLECTIONS
    // ==========================================

    /**
     * Get categories
     * @returns {Promise<Array>} Array of categories
     */
    async getCategories() {
        if (this.isCacheValid('categories')) {
            return this.cache.get('categories');
        }

        try {
            const response = await fetch(`${this.baseUrl}/data/categories.json`);
            if (response.ok) {
                const categories = await response.json();
                this.setCache('categories', categories);
                return categories;
            }
        } catch (error) {
            console.warn('Could not load categories:', error);
        }

        // Fallback: extract from products
        const products = await this.getProducts();
        const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
        return categories.map(name => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-') }));
    }

    /**
     * Get collections
     * @returns {Promise<Array>} Array of collections
     */
    async getCollections() {
        if (this.isCacheValid('collections')) {
            return this.cache.get('collections');
        }

        try {
            const response = await fetch(`${this.baseUrl}/data/collections.json`);
            if (response.ok) {
                const collections = await response.json();
                this.setCache('collections', collections);
                return collections;
            }
        } catch (error) {
            console.warn('Could not load collections:', error);
        }

        return [];
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
               (product.id || product.id === 0) &&
               product.name &&
               typeof product.price === 'number' &&
               product.price >= 0;
    }

    /**
     * Validate cart item
     * @param {Object} item - Cart item to validate
     * @returns {boolean} Whether item is valid
     */
    validateCartItem(item) {
        return item &&
               (item.id || item.id === 0) &&
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
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            expiryTimes: Array.from(this.cacheExpiry.entries())
        };
    }

    // ==========================================
    // EVENT DISPATCHERS
    // ==========================================

    /**
     * Dispatch cart update event
     */
    dispatchCartEvent() {
        const totals = this.getCartTotals();
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: totals
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
     * Dispatch products update event
     */
    dispatchProductsUpdated() {
        window.dispatchEvent(new CustomEvent('productsUpdated'));
    }

    // ==========================================
    // DATA EXPORT/IMPORT
    // ==========================================

    /**
     * Export all data
     * @returns {Object} Exported data
     */
    exportData() {
        return {
            products: localStorage.getItem('mashallah_products'),
            cart: this.getCart(),
            wishlist: this.getWishlist(),
            timestamp: new Date().toISOString(),
            version: '2.0'
        };
    }

    /**
     * Import data
     * @param {Object} data - Data to import
     */
    importData(data) {
        if (data.products) localStorage.setItem('mashallah_products', data.products);
        if (data.cart) this.saveCart(data.cart);
        if (data.wishlist) this.saveWishlist(data.wishlist);
        this.clearCache();
        this.dispatchCartEvent();
        this.dispatchWishlistEvent();
        this.dispatchProductsUpdated();
        console.log('📥 Data imported successfully');
    }
}

export default new DataService();
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