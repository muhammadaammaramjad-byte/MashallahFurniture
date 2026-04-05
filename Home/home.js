
document.addEventListener('DOMContentLoaded', () => {

  // --- DOM Element Selectors ---
  const header = document.querySelector('header');
  const backToTopBtn = document.querySelector('.back-to-top');
  const fadeElements = document.querySelectorAll('.fade-in');
  const slideLeftElements = document.querySelectorAll('.slide-in-left');
  const slideRightElements = document.querySelectorAll('.slide-in-right');
  const zoomElements = document.querySelectorAll('.zoom-in');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const productActionButtons = document.querySelectorAll('.product-action-btn');
  const newsletterForm = document.querySelector('.newsletter-form');
  const cartCountEl = document.querySelector('.cart-count');
  const toast = document.getElementById('toast');
  const loader = document.querySelector('.loader');
  const loaderProgressBar = document.getElementById('loader-progress-bar');
  const confettiContainer = document.getElementById('confettiContainer');

  // Search
  const searchIcon = document.getElementById('searchIcon');
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchOptions = document.querySelectorAll('.search-option');

  // Wishlist
  const wishlistIcon = document.getElementById('wishlistIcon');
  const wishlistPreview = document.getElementById('wishlistPreview');
  const wishlistItemsPreview = document.getElementById('wishlistItemsPreview');
  const wishlistCountEl = document.getElementById('wishlistCount');

  // Mobile Menu
  const menuToggle = document.getElementById('menuToggle');
  const mobileSidebar = document.getElementById('mobileSidebar');
  const closeSidebarBtn = document.getElementById('closeSidebar');

  // Dark Mode
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeIcon = document.getElementById('darkModeIcon');

  // Music & Sound
  const musicPlayer = document.getElementById('musicPlayer');
  const soundControls = document.getElementById('soundControls');
  const soundUp = document.getElementById('soundUp');
  const soundDown = document.getElementById('soundDown');
  const soundMute = document.getElementById('soundMute');

  // Audio Context for sound effects
  let audioContext;
  let backgroundMusic;
  let gainNode;
  let isMusicPlaying = false;
  let volume = 0.3;
  let isMuted = false;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create gain node for volume control
    gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
  } catch (e) {
    console.log('Web Audio API not supported in this browser');
  }

  // --- State & Data ---
  let products = [
    { id: 1, name: "Modern Elegance Sofa", price: 1299.99, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80", rating: 4.5, badge: "Best Seller", inWishlist: false, category: "sofas", description: "Premium quality leather sofa with modern design." },
    { id: 2, name: "Minimalist Dining Table", price: 899.99, image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80", rating: 5, badge: "New", inWishlist: false, category: "tables", description: "Solid wood dining table with elegant finish." },
    { id: 3, name: "Velvet Accent Chair", price: 459.99, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=930&q=80", rating: 4, badge: "", inWishlist: true, category: "chairs", description: "Stylish accent chair with unique design." },
    { id: 4, name: "Modular Bookshelf", price: 649.99, image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80", rating: 3.5, badge: "Sale", inWishlist: true, category: "storage", description: "Modern bookshelf with multiple compartments." },
    { id: 5, name: "Modern Lounge Chair", price: 299.00, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80", rating: 4.5, badge: "", inWishlist: true, category: "chairs", description: "Elegant modern lounge chair with premium upholstery." },
    { id: 6, name: "Glass Coffee Table", price: 199.00, image: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80", rating: 4, badge: "", inWishlist: false, category: "tables", description: "Elegant coffee table with tempered glass top." }
  ];
  let wishlist = [3, 4, 5];

  // --- Functions ---

  // Simulate loading progress
  const simulateLoading = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setTimeout(() => {
          loader.classList.add('hidden');
          playSound(783.99, 0.5); // G5 note
          startBackgroundMusic();
          createConfetti(); // Launch confetti on load complete
        }, 500);
      }
      loaderProgressBar.style.width = `${progress}%`;
    }, 200);
  };

  // Background music
  const startBackgroundMusic = () => {
    if (!audioContext || isMusicPlaying) return;

    // Create a simple ambient music loop
    const createNote = (frequency, duration, when) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = volume * 0.3; // Music is quieter than effects

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(when);
      gainNode.gain.exponentialRampToValueAtTime(0.001, when + duration);
      oscillator.stop(when + duration);
    };

    // Create a simple melody
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C4 to B4
    let time = audioContext.currentTime;

    // Play initial notes
    for (let i = 0; i < 4; i++) {
      createNote(notes[i % notes.length], 1.5, time);
      time += 1.7;
    }

    // Set up interval for continuous music
    backgroundMusic = setInterval(() => {
      const note = notes[Math.floor(Math.random() * notes.length)];
      createNote(note, 1.5, audioContext.currentTime);
    }, 1700);

    isMusicPlaying = true;
    musicPlayer.classList.add('active');
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusic) {
      clearInterval(backgroundMusic);
      backgroundMusic = null;
    }
    isMusicPlaying = false;
    musicPlayer.classList.remove('active');
  };

  const toggleMusic = () => {
    if (!audioContext) return;

    if (isMusicPlaying) {
      // Pause music
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
      musicPlayer.classList.remove('active');
      isMusicPlaying = false;
      playSound(349.23, 0.2); // F4 note
    } else {
      // Resume music
      gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.5);
      musicPlayer.classList.add('active');
      isMusicPlaying = true;
      playSound(523.25, 0.2); // C5 note
    }
  };

  const adjustVolume = (direction) => {
    if (!audioContext) return;

    if (direction === 'up') {
      volume = Math.min(1, volume + 0.1);
      playSound(659.25, 0.1); // E5 note
    } else {
      volume = Math.max(0, volume - 0.1);
      playSound(493.88, 0.1); // B4 note
    }

    gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.1);

    showToast(`Volume: ${Math.round(volume * 100)}%`);
  };

  const toggleMute = () => {
    if (!audioContext) return;

    if (isMuted) {
      // Unmute
      gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.1);
      soundMute.innerHTML = '<i class="fas fa-volume-mute"></i>';
      playSound(523.25, 0.2); // C5 note
      showToast("Sound unmuted");
    } else {
      // Mute
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      soundMute.innerHTML = '<i class="fas fa-volume-off"></i>';
      playSound(392.00, 0.2); // G4 note
      showToast("Sound muted");
    }

    isMuted = !isMuted;
  };

  // Play sound effects
  const playSound = (frequency, duration, type = 'sine', vol = volume) => {
    if (!audioContext || isMuted) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = vol * 0.5; // Effects are half the volume of music

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
  };

  // Show toast notification
  const showToast = (message, duration = 3000) => {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // Create confetti animation
  const createConfetti = () => {
    const colors = ['#ffffff', '#000000', '#333333', '#cccccc', '#666666'];

    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = (5 + Math.random() * 10) + 'px';
      confetti.style.height = (5 + Math.random() * 10) + 'px';
      confetti.style.opacity = (0.7 + Math.random() * 0.3);
      confetti.style.animationDuration = (3 + Math.random() * 5) + 's';
      confetti.style.animationDelay = (Math.random() * 2) + 's';

      confettiContainer.appendChild(confetti);

      // Remove confetti after animation completes
      setTimeout(() => {
        confetti.remove();
      }, 8000);
    }

    playSound(523.25, 0.5); // C5 note for celebration
  };

  const getRatingStars = (rating) => {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
    return stars;
  };

  const renderProducts = () => {
    const productGrid = document.querySelector('.products-grid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
  <div class="product-card fade-in" data-id="${product.id}">
    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-actions">
          <div class="product-action-btn action-wishlist ${product.inWishlist ? 'in-wishlist' : ''}" data-id="${product.id}" title="Add to Wishlist">
            <i class="fas fa-heart"></i>
          </div>
          <div class="product-action-btn" title="Quick View">
            <i class="fas fa-search"></i>
          </div>
        </div>
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <div class="product-rating">
        ${getRatingStars(product.rating)}
      </div>
      <button class="add-to-cart" data-id="${product.id}">
        <i class="fas fa-shopping-cart"></i> Add to Cart
      </button>
    </div>
  </div>
  `).join('');

    // Re-observe fade-in elements
    const newFadeElements = productGrid.querySelectorAll('.fade-in');
    observeElements(newFadeElements);
  };

  // Scroll-based animations and effects
  const handleScroll = () => {
    const isScrolled = window.scrollY > 100;
    header.classList.toggle('scrolled', isScrolled);
    backToTopBtn.classList.toggle('visible', isScrolled);
  };

  // Intersection Observer for animations
  const observeElements = (elements) => {
    const appearOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, appearOptions);

    elements.forEach(element => appearOnScroll.observe(element));
  };

  // Initialize all animations
  const initScrollAnimations = () => {
    observeElements(fadeElements);
    observeElements(slideLeftElements);
    observeElements(slideRightElements);
    observeElements(zoomElements);
  };

  // Back to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound(523.25, 0.3); // C5 note
  };

  // Add to cart simulation
  const handleAddToCart = (e) => {
    const button = e.currentTarget;
    const productId = parseInt(button.dataset.id);
    const product = products.find(p => p.id === productId);

    button.innerHTML = '<i class="fas fa-check"></i> Added';
    button.style.background = '#28a745';

    let count = parseInt(cartCountEl.textContent);
    cartCountEl.textContent = count + 1;
    cartCountEl.style.transform = 'scale(1.5)';

    playSound(392.00, 0.2); // G4 note

    setTimeout(() => cartCountEl.style.transform = 'scale(1)', 300);

    showToast(`Added ${product.name} to cart!`);

    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
      button.style.background = '';
    }, 2000);
  };

  // Toggle item in wishlist
  const toggleWishlist = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    product.inWishlist = !product.inWishlist;

    if (product.inWishlist) {
      if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        playSound(659.25, 0.3); // E5 note
        showToast(`Added ${product.name} to wishlist!`);
      }
    } else {
      wishlist = wishlist.filter(id => id !== productId);
      playSound(493.88, 0.3); // B4 note
      showToast(`Removed ${product.name} from wishlist!`);
    }

    updateWishlistCount();
    renderWishlistPreview();

    const productGrid = document.querySelector('.products-grid');
    if (productGrid) {
      renderProducts();
    }
  };

  // Newsletter submission simulation
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const button = form.querySelector('button');
    const input = form.querySelector('input');

    if (!input.value || !input.value.includes('@')) {
      showToast('Please enter a valid email address!');
      return;
    }

    button.textContent = 'Subscribed!';
    playSound(523.25, 0.5); // C5 note
    showToast('Thank you for subscribing!');
    createConfetti(); // Celebrate subscription

    setTimeout(() => {
      form.reset();
      button.innerHTML = 'Subscribe <i class="fas fa-paper-plane" id="rotate"></i>';
    }, 2000);
  };

  // Search
  const performSearch = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.search-option.active').dataset.category;

    if (searchTerm.length < 2) {
      searchResults.innerHTML = '<p class="no-results">Type at least 2 characters.</p>';
      return;
    }

    const filtered = products.filter(p =>
      (p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm)) &&
      (activeCategory === 'all' || p.category === activeCategory)
    );

    displaySearchResults(filtered);
  };

  const displaySearchResults = (results) => {
    if (results.length === 0) {
      searchResults.innerHTML = '<p class="no-results">No products found.</p>';
      return;
    }

    searchResults.innerHTML = results.map(p => `
  <div class="search-result-item" data-id="${p.id}">
    <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="search-result-info">
        <h4>${p.name}</h4>
        <p>$${p.price.toFixed(2)} • ${p.category}</p>
      </div>
  </div>`).join('');
  };

  // Wishlist
  const updateWishlistCount = () => {
    wishlistCountEl.textContent = wishlist.length;
    wishlistCountEl.style.display = wishlist.length > 0 ? 'flex' : 'none';
  };

  const findProduct = (id) => products.find(p => p.id === id);

  const renderWishlistPreview = () => {
    wishlistItemsPreview.innerHTML = wishlist.length === 0 ? '<p>Your wishlist is empty.</p>' : '';

    if (wishlist.length > 0) {
      let itemsHtml = '';
      wishlist.slice(0, 3).forEach(productId => {
        const product = findProduct(productId);
        if (product) {
          itemsHtml += `
                <div class="wishlist-item-preview">
                  <img src="${product.image}" alt="${product.name}" loading="lazy">
                  <div class="wishlist-item-info">
                    <h4 class="wishlist-item-name">${product.name}</h4>
                    <p class="wishlist-item-price">$${product.price.toFixed(2)}</p>
                  </div>
                </div>`;
        }
      });

      wishlistItemsPreview.innerHTML = itemsHtml;

      if (wishlist.length > 3) {
        wishlistItemsPreview.innerHTML += `<p style="text-align:center; margin-top:10px; color:var(--accent-gray);">+${wishlist.length - 3} more items</p>`;
      }
    }
  };

  // Mobile Menu
  const toggleMobileMenu = () => {
    mobileSidebar.classList.toggle('active');
    playSound(349.23, 0.2); // F4 note
  };

  // Dark Mode
  const setupDarkMode = () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);
    darkModeIcon.classList.toggle('fa-sun', isDark);
    darkModeIcon.classList.toggle('fa-moon', !isDark);
  };

  const toggleDarkMode = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeIcon.classList.toggle('fa-sun', isDark);
    darkModeIcon.classList.toggle('fa-moon', !isDark);
    playSound(587.33, 0.3); // D5 note
    showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
  };

  // Stats counter animation
  const initStatsCounter = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-target'));
          animateValue(target, 0, endValue, 2000);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
      observer.observe(stat);
    });
  };

  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value + (element.getAttribute('data-target') == '98' ? '%' : '+');

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);

    // Add animation class
    element.classList.add('animated');
  };

  // --- Event Listeners ---
  window.addEventListener('scroll', handleScroll);

  window.addEventListener('load', () => {
    simulateLoading();
    // Initial Render
    renderProducts();
    initStatsCounter();
  });

  backToTopBtn.addEventListener('click', scrollToTop);

  // Event delegation for dynamic product grid
  const productGrid = document.querySelector('.products-grid');
  if (productGrid) {
    productGrid.addEventListener('click', (e) => {
      const target = e.target;

      const wishlistBtn = target.closest('.action-wishlist');
      if (wishlistBtn) {
        const productId = parseInt(wishlistBtn.dataset.id);
        toggleWishlist(productId);
        return;
      }

      const cartBtn = target.closest('.add-to-cart');
      if (cartBtn) {
        handleAddToCart({ currentTarget: cartBtn });
        return;
      }
    });
  }

  // Search listeners
  searchIcon.addEventListener('click', () => {
    searchContainer.classList.toggle('active');
    if (searchContainer.classList.contains('active')) {
      searchInput.focus();
      playSound(523.25, 0.2); // C5 note
    }
  });

  searchInput.addEventListener('input', performSearch);

  searchOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      searchOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      performSearch();
      playSound(392.00, 0.1); // G4 note
    });
  });

  // Wishlist listeners
  wishlistIcon.addEventListener('click', (e) => {
    e.preventDefault();
    wishlistPreview.classList.toggle('active');
    playSound(659.25, 0.2); // E5 note
  });

  // Mobile menu listeners
  menuToggle.addEventListener('click', toggleMobileMenu);
  closeSidebarBtn.addEventListener('click', toggleMobileMenu);

  // Dark mode listener
  darkModeToggle.addEventListener('click', toggleDarkMode);

  // Music and sound control listeners
  musicPlayer.addEventListener('click', () => {
    toggleMusic();
    soundControls.classList.toggle('visible');
  });

  soundUp.addEventListener('click', () => adjustVolume('up'));
  soundDown.addEventListener('click', () => adjustVolume('down'));
  soundMute.addEventListener('click', toggleMute);

  // Close pop-ups when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target) && !searchIcon.contains(e.target)) {
      searchContainer.classList.remove('active');
    }
    if (!wishlistPreview.contains(e.target) && !wishlistIcon.contains(e.target)) {
      wishlistPreview.classList.remove('active');
    }
    if (!soundControls.contains(e.target) && !musicPlayer.contains(e.target)) {
      soundControls.classList.remove('visible');
    }
  });

  // Newsletter form
  newsletterForm.addEventListener('submit', handleNewsletterSubmit);

  // --- Initializations ---
  initScrollAnimations();
  updateWishlistCount();
  renderWishlistPreview();
  setupDarkMode();

});

/* =====================
Tiny, performance-aware runtime
===================== */
(function () {
  const root = document.documentElement;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) root.style.setProperty('--reduce-motion', '1');

  // Elements
  const cursorCore = document.getElementById('cursorCore');
  const cursorOrb = document.getElementById('cursorOrb');
  const starLayer = document.getElementById('starLayer');
  const binaryLayer = document.getElementById('binaryLayer');
  const progressEl = document.getElementById('readingProgress');

  // state
  let mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  let orb = { x: mouse.x, y: mouse.y };
  let last = { x: mouse.x, y: mouse.y };
  let velocity = 0;
  let raf = null;
  let cursorEnabled = true;
  let reduceMotion = (root.style.getPropertyValue('--reduce-motion') === '1');
  let density = 'medium'; // low | medium | high

  // Accessibility: show native cursor over interactive elements
  const clickableSelectors = 'button,a,input,textarea,select,[role="button"],.interactive-element';
  function enableNativeCursorOnInteractive() {
    document.querySelectorAll(clickableSelectors).forEach(el => {
      el.classList.add('hide-custom-cursor');
    });
  }
  enableNativeCursorOnInteractive();

  // Mouse tracking
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
  }, { passive: true });

  // Basic loop for smooth orb & core and velocity calc
  function loop() {
    const dx = mouse.x - last.x, dy = mouse.y - last.y;
    velocity = Math.sqrt(dx * dx + dy * dy);
    last.x = mouse.x; last.y = mouse.y;

    // core snaps quickly
    if (cursorEnabled) cursorCore.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%,-50%)`;
    else cursorCore.style.opacity = 0;

    // orb follows smoothly
    orb.x += (mouse.x - orb.x) * 0.12;
    orb.y += (mouse.y - orb.y) * 0.12;
    const scale = 1 + Math.min(velocity * 0.008, 1.2);
    if (cursorEnabled) cursorOrb.style.transform = `translate(${orb.x}px, ${orb.y}px) translate(-50%,-50%) scale(${scale})`;

    // occasional aura for flair when moving fast
    if (!reduceMotion && velocity > 18 && Math.random() > 0.88) spawnAura(mouse.x, mouse.y, Math.min(36 + velocity * 0.4, 100));

    raf = requestAnimationFrame(loop);
  }
  loop();

  // Aura pool (re-use nodes)
  const auraPool = [];
  function spawnAura(x, y, size) {
    let item = auraPool.find(i => !i.inUse);
    let node;
    if (!item) {
      node = document.createElement('div');
      node.className = 'cursor-aura';
      document.body.appendChild(node);
      auraPool.push({ node, inUse: false });
    } else { item.inUse = true; node = item.node; }

    node.style.width = node.style.height = size + 'px';
    node.style.left = x + 'px'; node.style.top = y + 'px';
    node.style.opacity = '0.9';
    node.style.transition = 'transform 800ms ease-out, opacity 800ms ease-out';
    node.style.transform = 'translate(-50%,-50%) scale(.2)';
    requestAnimationFrame(() => {
      node.style.transform = 'translate(-50%,-50%) scale(2.6)';
      node.style.opacity = '0';
    });
    setTimeout(() => {
      node.style.transition = '';
      node.style.opacity = '0';
      const poolItem = auraPool.find(i => i.node === node);
      if (poolItem) poolItem.inUse = false;
    }, 900);
  }

  // click ripple & particle burst
  function clickRipple(x, y) {
    const el = document.createElement('div');
    el.className = 'shockwave';
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.width = el.style.height = '18px';
    el.style.opacity = '0.9';
    el.style.transform = 'translate(-50%,-50%) scale(.3)';
    el.style.transition = 'transform 700ms cubic-bezier(.2,.9,.28,1), opacity 700ms linear';
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.transform = 'translate(-50%,-50%) scale(8)'; el.style.opacity = '0'; });
    setTimeout(() => el.remove(), 780);
  }
  function burst(x, y, count = 10) {
    if (density === 'low') count = Math.max(4, Math.floor(count / 2));
    if (density === 'high') count = Math.max(14, Math.floor(count * 1.6));
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.style.position = 'fixed';
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.width = p.style.height = '3px';
      p.style.borderRadius = '50%';
      p.style.pointerEvents = 'none';
      p.style.background = 'white';
      p.style.opacity = '0.95';
      p.style.willChange = 'transform,opacity';
      const angle = Math.random() * Math.PI * 2;
      const dist = 18 + Math.random() * 60;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      p.style.transition = `transform ${350 + Math.random() * 600}ms cubic-bezier(.1,.9,.2,1), opacity 500ms linear`;
      document.body.appendChild(p);
      requestAnimationFrame(() => { p.style.transform = `translate(${tx}px, ${ty}px) scale(.9)`; p.style.opacity = '0'; });
      setTimeout(() => p.remove(), 1000 + Math.random() * 400);
    }
  }

  // click handler
  window.addEventListener('click', (e) => {
    if (e.target.closest('button,a,input,textarea')) return; // let native interactions be primary
    clickRipple(e.clientX, e.clientY);
    if (!reduceMotion) burst(e.clientX, e.clientY, 12);
    // cosmic ripple (subtle)
    createCosmicRipple(e.clientX, e.clientY);
  }, { passive: true });

  // cosmic ripple
  function createCosmicRipple(x, y) {
    if (reduceMotion) return;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.className = 'shockwave';
        ripple.style.left = x + 'px'; ripple.style.top = y + 'px';
        ripple.style.width = ripple.style.height = `${16 + i * 10}px`;
        ripple.style.opacity = '0.7';
        ripple.style.transition = `transform ${450 + i * 120}ms ease-out, opacity ${450 + i * 120}ms linear`;
        ripple.style.transform = 'translate(-50%,-50%) scale(.2)';
        document.body.appendChild(ripple);
        requestAnimationFrame(() => { ripple.style.transform = 'translate(-50%,-50%) scale(6)'; ripple.style.opacity = '0'; });
        setTimeout(() => ripple.remove(), 700 + i * 200);
      }, i * 90);
    }
  }

  // reading progress
  function updateProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressEl.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // starfield
  function makeStars(n) {
    const max = Math.min(n || 80, 300);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < max; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const top = Math.random() * 100; const left = Math.random() * 100;
      const size = Math.random() * 2.5 + 0.6;
      s.style.top = top + 'vh'; s.style.left = left + 'vw';
      s.style.width = s.style.height = size + 'px';
      s.style.opacity = (Math.random() * 0.7).toString();
      if (!reduceMotion) {
        s.classList.add('twinkle');
        s.style.animationDelay = (Math.random() * 4) + 's';
      } else {
        s.style.opacity = Math.random() * 0.5;
      }
      frag.appendChild(s);
    }
    starLayer.appendChild(frag);
  }
  const initialStars = Math.max(20, Math.min(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--max-stars')) || 80, 220));
  makeStars(initialStars);

  // binary rain (lightweight spawn)
  function spawnBinaryOnce() {
    if (reduceMotion) return;
    const d = document.createElement('div');
    d.className = 'binary-digit';
    d.textContent = Math.random() > 0.5 ? '1' : '0';
    d.style.left = (Math.random() * 100) + 'vw';
    d.style.top = '-6vh';
    const dur = 3500 + Math.random() * 5200;
    d.style.transition = `transform ${dur}ms linear, opacity ${dur}ms linear`;
    binaryLayer.appendChild(d);
    requestAnimationFrame(() => d.style.transform = `translateY(${110 + Math.random() * 20}vh)`);
    setTimeout(() => d.remove(), dur + 100);
  }
  // spawn periodically but keep low cost
  setInterval(spawnBinaryOnce, 1400);

  // small star spawn when scrolling
  function createRandomStar() {
    if (reduceMotion) return;
    const s = document.createElement('div');
    s.className = 'star';
    s.style.top = (Math.random() * 100) + 'vh';
    s.style.left = (Math.random() * 100) + 'vw';
    s.style.width = s.style.height = (Math.random() * 2.5 + 0.6) + 'px';
    s.style.opacity = (Math.random() * 0.5).toString();
    starLayer.appendChild(s);
    setTimeout(() => s.remove(), 10000);
  }

  window.addEventListener('scroll', () => {
    if (Math.random() > 0.7) createRandomStar();
  }, { passive: true });

  // small performance: pause heavy loops when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) loop();
  });

  // Hover interactions for .interactive-element (pulses orb and emits particles)
  document.querySelectorAll('.interactive-element').forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
      cursorOrb.style.transform = cursorOrb.style.transform.replace(/scale\([^\)]+\)/, 'scale(1.9)');
      // small burst
      const rect = btn.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
    });
    btn.addEventListener('mouseleave', () => {
      cursorOrb.style.transform = cursorOrb.style.transform.replace(/scale\([^\)]+\)/, 'scale(1)');
    });
    btn.addEventListener('click', (e) => {
      // cosmic ripple at center of button
      const rect = e.currentTarget.getBoundingClientRect();
      createCosmicRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });

  // Controls (top-right)
  const toggleCursorBtn = document.getElementById('toggleCursor');
  const toggleMotionBtn = document.getElementById('toggleMotion');
  const densityBtn = document.getElementById('density');

  toggleCursorBtn.addEventListener('click', () => {
    cursorEnabled = !cursorEnabled;
    if (!cursorEnabled) {
      cursorCore.style.opacity = 0; cursorOrb.style.opacity = 0;
      toggleCursorBtn.textContent = 'Cursor: Off';
    } else {
      cursorCore.style.opacity = 1; cursorOrb.style.opacity = 1;
      toggleCursorBtn.textContent = 'Cursor: On';
    }
  });

  toggleMotionBtn.addEventListener('click', () => {
    reduceMotion = !reduceMotion;
    root.style.setProperty('--reduce-motion', reduceMotion ? '1' : '0');
    toggleMotionBtn.textContent = reduceMotion ? 'Reduced Motion' : 'Full Motion';
  });

  densityBtn.addEventListener('click', () => {
    density = density === 'low' ? 'medium' : density === 'medium' ? 'high' : 'low';
    densityBtn.textContent = density === 'low' ? 'Particles: Low' : density === 'medium' ? 'Particles: Medium' : 'Particles: High';
  });

  // Small decorative orbit particles inside the orb
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement('div');
    dot.className = 'orb-particle';
    dot.style.width = dot.style.height = `${4 + i}px`;
    dot.style.left = `${14 + i * 2}px`;
    dot.style.top = '50%';
    dot.style.transform = 'translate(-50%,-50%)';
    dot.style.opacity = (0.6 - i * 0.12);
    dot.style.pointerEvents = 'none';
    cursorOrb.appendChild(dot);
  }

  // Expose quick debug in window (optional)
  window.RammaCursor = { spawnAura, burst, clickRipple, createRandomStar };

  // initial tiny flourish
  setTimeout(() => {
    if (!reduceMotion) {
      spawnAura(innerWidth / 2, innerHeight / 2, 120);
      burst(innerWidth / 2, innerHeight / 2, 18);
    }
  }, 800);

})();
// hero-sections------------

// Simple scroll functionality for the indicator
document.querySelector('.scroll-indicator').addEventListener('click', function () {
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  });
});

// Add intersection observer for animation performance
document.addEventListener('DOMContentLoaded', function () {
  const elements = document.querySelectorAll('.slide-in-left, .slide-in-right, .zoom-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.visibility = 'visible';
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.visibility = 'hidden';
    observer.observe(el);
  });
});
// Confetti Effects
function createConfetti() {
  const confettiContainer = document.getElementById('confettiContainer');
  confettiContainer.innerHTML = '';

  const colors = ['#000000', '#ffffff', '#333333', '#cccccc'];

  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.width = (Math.random() * 12 + 6) + 'px';
    confetti.style.height = (Math.random() * 12 + 6) + 'px';
    confetti.style.opacity = Math.random() * 0.9 + 0.1;
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

    confettiContainer.appendChild(confetti);

    // Remove confetti after animation completes
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.remove();
      }
    }, 5000);
  }
}

function createMiniConfetti(element) {
  const rect = element.getBoundingClientRect();
  const confettiContainer = document.getElementById('confettiContainer');

  const colors = ['#000000', '#ffffff', '#333333', '#cccccc'];

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = (rect.left + rect.width / 2 - 5) + 'px';
    confetti.style.top = (rect.top + rect.height / 2) + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
    confetti.style.width = (Math.random() * 8 + 4) + 'px';
    confetti.style.height = (Math.random() * 8 + 4) + 'px';
    confetti.style.opacity = Math.random() * 0.8 + 0.2;
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

    confettiContainer.appendChild(confetti);

    // Remove confetti after animation completes
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.remove();
      }
    }, 3000);
  }
}
// *-----------*
