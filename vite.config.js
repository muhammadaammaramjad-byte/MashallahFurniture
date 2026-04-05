import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    minify: 'esbuild', // Use built-in esbuild instead of terser
    reportCompressedSize: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'Home/home.html'),
        shop: resolve(__dirname, 'Shop/shop.html'),
        collections: resolve(__dirname, 'Collections/collections.html'),
        contact: resolve(__dirname, 'Contact/contact.html'),
        offers: resolve(__dirname, 'Offers/offers.html'),
        search: resolve(__dirname, 'Search/search.html'),
        about: resolve(__dirname, 'About/about.html'),
        cart: resolve(__dirname, 'nav-btn/cart.html'),
        favourite: resolve(__dirname, 'nav-btn/favourite.html'),
        account: resolve(__dirname, 'nav-btn/Account/account.html')
      }
    }
  },
  publicDir: 'public',
  server: {
    headers: {
      'Cache-Control': 'no-cache'
    }
  }
});