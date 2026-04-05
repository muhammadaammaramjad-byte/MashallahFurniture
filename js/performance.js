/**
 * Performance utilities for MashallahFurniture.
 */
(function () {
  const lazyImages = document.querySelectorAll('img[data-src]');

  const loadImage = (img) => {
    const src = img.dataset.src;
    if (!src) return;
    img.src = src;
    img.removeAttribute('data-src');
    img.classList.add('loaded');
  };

  if ('IntersectionObserver' in window && lazyImages.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadImage(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '150px 0px' });

    lazyImages.forEach((img) => observer.observe(img));
  } else {
    lazyImages.forEach(loadImage);
  }

  const prefetched = new Set();
  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (prefetched.has(href)) return;
      prefetched.add(href);
      const prefetch = document.createElement('link');
      prefetch.rel = 'prefetch';
      prefetch.href = href;
      document.head.appendChild(prefetch);
    });
  });
})();

// js/performance.js - Expand this
class PerformanceOptimizer {
  // Lazy load images
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    images.forEach(img => observer.observe(img));
  }

  // Prefetch critical pages
  prefetchPages() {
    const pages = ['/shop', '/collections'];
    pages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
  }

  // Virtual scrolling for large product lists
  virtualScroll(container, items, itemHeight, renderItem) {
    // Implementation for rendering only visible items
  }
}
