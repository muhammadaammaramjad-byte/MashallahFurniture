import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'src/pages/index.html',
                shop: 'src/pages/shop.html',
                about: 'src/pages/about.html',
                collections: 'src/pages/collections.html',
                contact: 'src/pages/contact.html',
                offers: 'src/pages/offers.html',
                cart: 'src/pages/cart.html',
                wishlist: 'src/pages/wishlist.html',
                checkout: 'src/pages/checkout.html',
                account: 'src/pages/account/profile.html',
                'image-uploader-demo': 'src/pages/image-uploader-demo.html'
            }
        }
    },
    server: {
        port: 3000,
        open: true
    },
    publicDir: 'public'
    },
    resolve: {
        alias: {
            '@': '/src',
            '@components': '/src/js/components',
            '@utils': '/src/js/utils',
            '@services': '/src/js/services'
        }
    }
});