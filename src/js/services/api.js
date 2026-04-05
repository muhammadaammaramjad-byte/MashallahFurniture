// API Service
import { config } from '../config.js';

class ApiService {
    constructor() {
        this.baseURL = config.API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const mergedOptions = { ...defaultOptions, ...options };

        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            mergedOptions.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, mergedOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint);
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }
}

export const api = new ApiService();

// Product API functions
export async function getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return api.get(`/products?${queryParams}`);
}

export async function getProductById(id) {
    return api.get(`/products/${id}`);
}

export async function getCategories() {
    return api.get('/categories');
}

export async function getCollections() {
    return api.get('/collections');
}

// Cart API functions
export async function createOrder(orderData) {
    return api.post('/orders', orderData);
}

export async function getUserOrders() {
    return api.get('/orders');
}

// Auth API functions
export async function login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.token) {
        localStorage.setItem('authToken', response.token);
    }
    return response;
}

export async function register(userData) {
    return api.post('/auth/register', userData);
}

export async function logout() {
    localStorage.removeItem('authToken');
    return api.post('/auth/logout');
}