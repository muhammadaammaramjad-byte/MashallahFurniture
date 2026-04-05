/**
 * Accessibility utilities for MashallahFurniture.
 */
(function () {
  const body = document.body;
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main';
  }

  if (!body.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = 'position:absolute;top:-48px;left:0;z-index:1000;background:#111;color:#fff;padding:0.75rem 1rem;transition:top 0.2s ease;';
    skipLink.addEventListener('focus', () => (skipLink.style.top = '0'));
    skipLink.addEventListener('blur', () => (skipLink.style.top = '-48px'));
    body.prepend(skipLink);
  }

  let announcer = document.getElementById('aria-live');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'aria-live';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.margin = '-1px';
    announcer.style.padding = '0';
    announcer.style.border = '0';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0 0 0 0)';
    announcer.style.whiteSpace = 'nowrap';
    body.appendChild(announcer);
  }

  window.addEventListener('cartUpdated', (event) => {
    const count = event.detail?.count ?? 0;
    announcer.textContent = `Cart updated, ${count} ${count === 1 ? 'item' : 'items'} in your cart.`;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const cartMini = document.getElementById('cartMini');
    const overlay = document.getElementById('cartOverlay');
    if (cartMini?.classList.contains('open')) {
      cartMini.classList.remove('open');
      overlay?.classList.remove('active');
    }
  });
})();
