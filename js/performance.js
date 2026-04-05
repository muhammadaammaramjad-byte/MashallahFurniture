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
