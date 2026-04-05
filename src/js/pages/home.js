// Home Page JavaScript
import { getProducts } from '../services/api.js';
import { createProductCard } from '../components/productCard.js';
import { formatCurrency } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeHomePage();
});

async function initializeHomePage() {
    try {
        // Load featured categories
        await loadCategories();

        // Load featured products
        await loadFeaturedProducts();

        // Load testimonials
        await loadTestimonials();

        // Initialize hero section
        initializeHero();

    } catch (error) {
        console.error('Error initializing home page:', error);
    }
}

async function loadCategories() {
    try {
        // For now, use mock data since we don't have the API endpoint
        const categories = [
            {
                id: 'living-room',
                name: 'Living Room',
                description: 'Comfortable seating and entertainment furniture',
                image: '/assets/images/categories/living-room.jpg',
                productCount: 25
            },
            {
                id: 'bedroom',
                name: 'Bedroom',
                description: 'Restful and stylish bedroom furniture',
                image: '/assets/images/categories/bedroom.jpg',
                productCount: 18
            },
            {
                id: 'dining',
                name: 'Dining',
                description: 'Elegant dining sets and furniture',
                image: '/assets/images/categories/dining.jpg',
                productCount: 12
            },
            {
                id: 'office',
                name: 'Office',
                description: 'Functional and comfortable office furniture',
                image: '/assets/images/categories/office.jpg',
                productCount: 15
            }
        ];

        const categoriesGrid = document.querySelector('.categories-grid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = categories.map(category => 
            <div class='category-card card'>
                <div class='category-image'>
                    <img src='' alt='' loading='lazy'>
                </div>
                <div class='category-info'>
                    <h3></h3>
                    <p></p>
                    <span class='product-count'> products</span>
                    <a href='/shop?category=' class='btn btn-outline'>Shop Now</a>
                </div>
            </div>
        ).join('');

    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadFeaturedProducts() {
    try {
        // For now, use mock data
        const products = [
            {
                id: 1,
                name: 'Classic Wooden Dining Table',
                description: 'Beautiful handcrafted dining table made from premium oak wood',
                price: 899.99,
                image: '/assets/images/products/dining-table-1.jpg',
                category: 'dining',
                rating: 4.5,
                reviewCount: 23
            },
            {
                id: 2,
                name: 'Modern Leather Sofa',
                description: 'Comfortable 3-seater sofa with premium leather upholstery',
                price: 1299.99,
                image: '/assets/images/products/sofa-1.jpg',
                category: 'living-room',
                rating: 4.8,
                reviewCount: 45
            },
            {
                id: 3,
                name: 'Rustic Bedroom Wardrobe',
                description: 'Spacious 3-door wardrobe with rustic wood finish',
                price: 749.99,
                image: '/assets/images/products/wardrobe-1.jpg',
                category: 'bedroom',
                rating: 4.3,
                reviewCount: 18
            }
        ];

        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = products.map(product => {
            const card = createProductCard(product);
            return card.outerHTML;
        }).join('');

    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

async function loadTestimonials() {
    try {
        // Mock testimonials
        const testimonials = [
            {
                id: 1,
                name: 'Ahmed Hassan',
                role: 'Homeowner',
                content: 'The dining table we purchased is absolutely stunning. The craftsmanship is exceptional and it fits perfectly in our home. Highly recommend!',
                rating: 5,
                image: '/assets/images/testimonials/ahmed.jpg'
            },
            {
                id: 2,
                name: 'Fatima Ali',
                role: 'Interior Designer',
                content: 'I have been working with Mashallah Furniture for several projects. Their attention to detail and quality materials make them my go-to choice.',
                rating: 5,
                image: '/assets/images/testimonials/fatima.jpg'
            },
            {
                id: 3,
                name: 'Omar Khan',
                role: 'Business Owner',
                content: 'The office furniture we got has transformed our workspace. Comfortable, durable, and beautifully designed. Excellent customer service too!',
                rating: 4,
                image: '/assets/images/testimonials/omar.jpg'
            }
        ];

        const testimonialsGrid = document.querySelector('.testimonials-grid');
        if (!testimonialsGrid) return;

        testimonialsGrid.innerHTML = testimonials.map(testimonial => 
            <div class='testimonial-card card'>
                <div class='testimonial-rating'>
                    
                </div>
                <p class='testimonial-content'>''</p>
                <div class='testimonial-author'>
                    <img src='' alt='' class='author-avatar'>
                    <div class='author-info'>
                        <h4></h4>
                        <span></span>
                    </div>
                </div>
            </div>
        ).join('');

    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

function initializeHero() {
    // Add any hero section animations or interactions here
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Example: Add scroll animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });

    observer.observe(hero);
}
