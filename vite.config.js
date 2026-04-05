import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        shop: resolve(__dirname, 'src/shop.html'),
        product: resolve(__dirname, 'src/product.html'),
        cart: resolve(__dirname, 'src/cart.html'),
        wishlist: resolve(__dirname, 'src/wishlist.html'),
        about: resolve(__dirname, 'src/about.html'),
        contact: resolve(__dirname, 'src/contact.html'),
        collections: resolve(__dirname, 'src/collections.html'),
        offers: resolve(__dirname, 'src/offers.html'),
        checkout: resolve(__dirname, 'src/checkout.html'),
        adminProducts: resolve(__dirname, 'src/admin/products.html'),
        imageUploaderDemo: resolve(__dirname, 'src/image-uploader-demo.html')
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
    resolve: {
        alias: {
            '@': '/src',
            '@components': '/src/js/components',
            '@utils': '/src/js/utils',
            '@services': '/src/js/services'
        }
    }
});