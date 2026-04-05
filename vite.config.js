import { defineConfig } from 'vite';
import { visualizer } from 'vite-plugin-bundle-visualizer';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['axios', 'lodash'], // Add your dependencies
          ui: ['@popperjs/core', 'focus-trap']
        }
      }
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true
      }
    },
    // Performance budget
    chunkSizeWarningLimit: 500, // KB
    reportCompressedSize: true
  },
  plugins: [visualizer()],
  server: {
    headers: {
      'Cache-Control': 'no-cache'
    }
  }
});