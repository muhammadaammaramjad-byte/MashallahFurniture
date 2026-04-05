// scripts/health-check.js
const fs = require('fs');
const path = require('path');

const checks = {
  dataFiles: ['data/products.json', 'data/categories.json'],
  criticalPages: ['index.html', 'Shop/shop.html', 'Collections/collections.html'],
  assets: ['css/global.css', 'js/store.js'],
  configs: ['.env.example', 'vite.config.js']
};

let passed = 0;
let failed = 0;

Object.entries(checks).forEach(([category, files]) => {
  console.log(`\n📁 Checking ${category}...`);
  files.forEach(file => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      console.log(`  ✅ ${file}`);
      passed++;
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      failed++;
    }
  });
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);