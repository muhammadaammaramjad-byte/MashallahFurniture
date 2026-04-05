import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true
  },
  publicDir: 'public',
  server: {
    headers: {
      'Cache-Control': 'no-cache'
    }
  }
});