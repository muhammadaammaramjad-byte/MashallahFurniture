import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    minify: 'esbuild', // Use built-in esbuild instead of terser
    reportCompressedSize: true
  },
  publicDir: 'public',
  server: {
    headers: {
      'Cache-Control': 'no-cache'
    }
  }
});