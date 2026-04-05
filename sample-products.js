// Sample Products for Mashallah Furniture
// Run this in browser console on admin page to populate your store

const sampleProducts = [
    {
        id: Date.now() + 1,
        name: "Modern Leather Sofa",
        price: 1299,
        category: "Living Room",
        description: "Elegant 3-seater leather sofa with premium comfort and contemporary design. Perfect for modern living spaces.",
        images: ["/src/assets/images/products/sofa1.jpg", "/src/assets/images/products/sofa2.jpg"],
        stock: 5,
        dimensions: "84\" W x 36\" D x 32\" H",
        material: "Genuine Leather",
        features: ["3-Seater", "Reclining Mechanism", "Sturdy Wooden Frame", "5-Year Warranty"],
        inStock: true,
        rating: 4.8,
        reviews: 24,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: Date.now() + 2,
        name: "Dining Room Table Set",
        price: 899,
        category: "Dining",
        description: "Beautiful 6-piece dining set with solid wood construction. Includes table and 4 chairs with upholstered seats.",
        images: ["/src/assets/images/products/dining1.jpg"],
        stock: 3,
        dimensions: "60\" L x 36\" W x 30\" H",
        material: "Solid Oak Wood",
        features: ["6-Piece Set", "Solid Wood Construction", "Upholstered Chairs", "Extensible Design"],
        inStock: true,
        rating: 4.6,
        reviews: 18,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: Date.now() + 3,
        name: "King Size Bed Frame",
        price: 699,
        category: "Bedroom",
        description: "Luxurious king size bed frame with storage drawers. Modern design with ample under-bed storage.",
        images: ["/src/assets/images/products/bed1.jpg"],
        stock: 8,
        dimensions: "78\" W x 82\" L x 18\" H",
        material: "Engineered Wood",
        features: ["King Size", "Storage Drawers", "Headboard Included", "Easy Assembly"],
        inStock: true,
        rating: 4.7,
        reviews: 31,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: Date.now() + 4,
        name: "Office Executive Chair",
        price: 349,
        category: "Office",
        description: "Ergonomic executive office chair with lumbar support and adjustable height. Perfect for long work sessions.",
        images: ["/src/assets/images/products/chair1.jpg"],
        stock: 12,
        dimensions: "26\" W x 27\" D x 40-44\" H",
        material: "Mesh and Leather",
        features: ["Adjustable Height", "Lumbar Support", "360° Swivel", "5-Star Base"],
        inStock: true,
        rating: 4.5,
        reviews: 42,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: Date.now() + 5,
        name: "Bookshelf Storage Unit",
        price: 249,
        category: "Storage",
        description: "5-tier bookshelf with modern design. Perfect for home office or living room organization.",
        images: ["/src/assets/images/products/bookshelf1.jpg"],
        stock: 15,
        dimensions: "30\" W x 12\" D x 60\" H",
        material: "MDF Wood",
        features: ["5 Tiers", "Modern Design", "Sturdy Construction", "Easy Assembly"],
        inStock: true,
        rating: 4.4,
        reviews: 27,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Function to add sample products
function addSampleProducts() {
    try {
        // Get existing products
        const existingProducts = JSON.parse(localStorage.getItem('mashallah_products') || '[]');

        // Add sample products
        const allProducts = [...existingProducts, ...sampleProducts];

        // Save to localStorage
        localStorage.setItem('mashallah_products', JSON.stringify(allProducts));

        console.log(`✅ Added ${sampleProducts.length} sample products!`);
        console.log('Total products now:', allProducts.length);

        // Dispatch event to refresh shop
        window.dispatchEvent(new CustomEvent('adminProductSaved', {
            detail: { products: sampleProducts }
        }));

        return `Added ${sampleProducts.length} products successfully!`;

    } catch (error) {
        console.error('❌ Error adding sample products:', error);
        return 'Error adding products';
    }
}

// Auto-run if this script is loaded
if (typeof window !== 'undefined') {
    console.log('🎯 Sample products script loaded!');
    console.log('Run: addSampleProducts() to add sample furniture to your store');
}