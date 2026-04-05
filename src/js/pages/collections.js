
// Enhanced JavaScript for Collections Page
document.addEventListener('DOMContentLoaded', function () {
  // Page Loader
  const loader = document.getElementById('page-loader');
  const progressBar = document.getElementById('loader-progress-bar');

  // Simulate loading progress
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      setTimeout(() => {
        loader.classList.add('hidden');
        createConfetti(); // Celebrate page load
        playSuccessSound(); // Play success sound
      }, 500);
    }
    progressBar.style.width = `${progress}%`;
  }, 200);

  // Scroll to Top Button
  const scrollButton = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollButton.classList.add('active');
    } else {
      scrollButton.classList.remove('active');
    }
  });

  scrollButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    playClickSound();
  });

  // Filter Toggle
  const filterToggle = document.querySelector('.filter-toggle');
  const filterSidebar = document.querySelector('.filter-sidebar');
  const filterClose = document.querySelector('.filter-close');

  filterToggle.addEventListener('click', () => {
    filterSidebar.classList.add('active');
    playClickSound();
  });

  filterClose.addEventListener('click', () => {
    filterSidebar.classList.remove('active');
    playClickSound();
  });

  // Quick View Modal
  const quickViewButtons = document.querySelectorAll('.quick-view-btn');
  const modal = document.getElementById('quickViewModal');
  const modalClose = document.querySelector('.modal-close');

  quickViewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      // In a real implementation, you would fetch product data based on ID
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      playModalOpenSound();
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    playModalCloseSound();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      playModalCloseSound();
    }
  });

  // Category Filtering
  const categoryButtons = document.querySelectorAll('.category-btn');
  const productCards = document.querySelectorAll('.product-card');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      const category = button.getAttribute('data-category');

      // Filter products
      productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });

      playFilterSound();
    });
  });

  // Quantity Selector
  const quantityButtons = document.querySelectorAll('.quantity-btn');

  quantityButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('.quantity-input');
      let value = parseInt(input.value);

      if (button.textContent === '+') {
        value++;
        playIncreaseSound();
      } else if (button.textContent === '-' && value > 1) {
        value--;
        playDecreaseSound();
      }

      input.value = value;
    });
  });

  // Color and Option Selection
  const colorOptions = document.querySelectorAll('.color-option');
  const optionValues = document.querySelectorAll('.option-value');

  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      option.parentElement.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('active');
      });
      option.classList.add('active');
      playSelectSound();
    });
  });

  optionValues.forEach(value => {
    value.addEventListener('click', () => {
      value.parentElement.querySelectorAll('.option-value').forEach(val => {
        val.classList.remove('active');
      });
      value.classList.add('active');
      playSelectSound();
    });
  });

  // Add to Cart Animation
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Animation effect
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 200);

      // Update cart count
      const cartCount = document.querySelector('.cart-count');
      let count = parseInt(cartCount.textContent);
      count++;
      cartCount.textContent = count;

      // Show toast notification
      showToast('Item added to cart successfully!');

      // Play add to cart sound
      playAddToCartSound();

      // Create confetti effect
      createConfetti();
    });
  });

  // Animate elements on scroll
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  animateElements.forEach(element => {
    observer.observe(element);
  });

  // Music Player
  const musicPlayer = document.getElementById('musicPlayer');
  let audio = null;
  let isPlaying = false;

  musicPlayer.addEventListener('click', () => {
    if (!audio) {
      audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3');
      audio.loop = true;
    }

    if (isPlaying) {
      audio.pause();
      musicPlayer.innerHTML = '<i class="fas fa-music"></i>';
      playPauseSound();
    } else {
      audio.play();
      musicPlayer.innerHTML = '<i class="fas fa-pause"></i>';
      playPauseSound();
    }

    isPlaying = !isPlaying;
  });

  // Sound Controls
  const soundUp = document.getElementById('soundUp');
  const soundDown = document.getElementById('soundDown');
  const soundMute = document.getElementById('soundMute');

  let volume = 0.5;

  soundUp.addEventListener('click', () => {
    if (volume < 1) volume += 0.1;
    if (audio) audio.volume = volume;
    playVolumeChangeSound();
  });

  soundDown.addEventListener('click', () => {
    if (volume > 0) volume -= 0.1;
    if (audio) audio.volume = volume;
    playVolumeChangeSound();
  });

  soundMute.addEventListener('click', () => {
    if (audio) {
      audio.muted = !audio.muted;
      soundMute.innerHTML = audio.muted ?
        '<i class="fas fa-volume-off"></i>' :
        '<i class="fas fa-volume-mute"></i>';
      playMuteSound();
    }
  });

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeIcon = document.getElementById('darkModeIcon');

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      darkModeIcon.classList.remove('fa-moon');
      darkModeIcon.classList.add('fa-sun');
      // In a real implementation, you would update CSS variables for dark mode
    } else {
      darkModeIcon.classList.remove('fa-sun');
      darkModeIcon.classList.add('fa-moon');
    }

    playModeToggleSound();
  });

  // Newsletter Form
  const newsletterForm = document.querySelector('.newsletter-form');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;

    // Simulate subscription success
    showToast('Thank you for subscribing to our newsletter!');
    newsletterForm.reset();

    playSuccessSound();
    createConfetti();
  });

  // Toast Notification Function
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Confetti Effect
  function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    confettiContainer.innerHTML = '';

    const colors = ['#000000', '#ffffff', '#333333', '#cccccc'];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.width = (Math.random() * 10 + 5) + 'px';
      confetti.style.height = (Math.random() * 10 + 5) + 'px';

      confettiContainer.appendChild(confetti);

      // Remove confetti after animation completes
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }

  // Sound Functions
  function playClickSound() {
    // In a real implementation, you would play an actual sound
    console.log('Click sound played');
  }

  function playModalOpenSound() {
    console.log('Modal open sound played');
  }

  function playModalCloseSound() {
    console.log('Modal close sound played');
  }

  function playFilterSound() {
    console.log('Filter sound played');
  }

  function playIncreaseSound() {
    console.log('Increase sound played');
  }

  function playDecreaseSound() {
    console.log('Decrease sound played');
  }

  function playSelectSound() {
    console.log('Select sound played');
  }

  function playAddToCartSound() {
    console.log('Add to cart sound played');
  }

  function playPauseSound() {
    console.log('Pause sound played');
  }

  function playVolumeChangeSound() {
    console.log('Volume change sound played');
  }

  function playMuteSound() {
    console.log('Mute sound played');
  }

  function playModeToggleSound() {
    console.log('Mode toggle sound played');
  }

  function playSuccessSound() {
    console.log('Success sound played');
  }
});
// < !--Background Elements-- >

document.addEventListener('DOMContentLoaded', function () {
  // Preload assets
  window.addEventListener('load', function () {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
      loader.classList.add('hidden');
      initializePage();
    }, 1000);
  });

  // Scroll progress indicator
  window.addEventListener('scroll', function () {
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const winScroll = window.scrollY || document.documentElement.scrollTop;
    const scrolled = (winScroll / (docHeight - winHeight)) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';

    // Show/hide scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (winScroll > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  // Scroll to top functionality
  document.getElementById('scrollTop').addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  function initializePage() {
    // Initialize theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference or respect OS preference
    if (localStorage.getItem('theme') === 'dark' ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
      body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', function () {
      body.classList.toggle('dark-mode');
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
      playToggleSound();
    });

    // Initialize sound toggle
    const soundToggle = document.getElementById('soundToggle');
    let soundEnabled = true;

    if (localStorage.getItem('sound') === 'muted') {
      soundEnabled = false;
      soundToggle.classList.add('muted');
    }

    soundToggle.addEventListener('click', function () {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundToggle.classList.remove('muted');
        localStorage.setItem('sound', 'unmuted');
      } else {
        soundToggle.classList.add('muted');
        localStorage.setItem('sound', 'muted');
      }
      playToggleSound();
    });

    // Create background elements
    createBackgroundElements();

    // Create floating particles
    createFloatingParticles();

    // Initialize brand items animation
    const brandItems = document.querySelectorAll('.brand-item');
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animateElements.forEach(element => {
      observer.observe(element);
    });

    // Animate header elements
    setTimeout(() => {
      document.querySelector('.brands-header h2').style.animation = 'fadeInUp 1.2s var(--cubic-power) forwards';
      document.querySelector('.brands-header p').style.animation = 'fadeInUp 1.2s var(--cubic-power) 0.3s forwards';
    }, 300);

    // NEW: Initialize brand filtering
    initializeBrandFilter();

    // Brand item click interaction
    brandItems.forEach(item => {
      item.addEventListener('click', function () {
        // Toggle expanded class
        this.classList.toggle('expanded');

        // Close other expanded items
        brandItems.forEach(otherItem => {
          if (otherItem !== this && otherItem.classList.contains('expanded')) {
            otherItem.classList.remove('expanded');
          }
        });

        // Play interaction sound
        playInteractionSound();

        // Create mini confetti effect on expand
        if (this.classList.contains('expanded')) {
          createMiniConfetti(this);
        }
      });
    });

    // NEW: Brand link click to open modal
    document.querySelectorAll('.brand-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const brand = this.getAttribute('data-brand');
        openBrandModal(brand);
      });
    });

    // Hover sound effect
    brandItems.forEach(item => {
      item.addEventListener('mouseenter', function () {
        playHoverSound();
      });
    });

    // CTA button interaction
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function (e) {
      e.preventDefault();
      playSuccessSound();
      createConfetti();

      // Button animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    });

    // NEW: Modal close functionality
    document.getElementById('modalClose').addEventListener('click', closeBrandModal);
    document.getElementById('brandModal').addEventListener('click', function (e) {
      if (e.target === this) closeBrandModal();
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        // Close all expanded brand items
        brandItems.forEach(item => {
          item.classList.remove('expanded');
        });
        // Close modal if open
        closeBrandModal();
      }
    });

    // Add touch events for mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', function (e) {
      touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function (e) {
      const touchEndY = e.changedTouches[0].screenY;
      const diffY = touchEndY - touchStartY;

      // If swiping down significantly, close expanded items
      if (diffY > 50) {
        brandItems.forEach(item => {
          if (item.classList.contains('expanded')) {
            item.classList.remove('expanded');
            playInteractionSound();
          }
        });
      }
    });

    // NEW: Add parallax effect to background elements
    addParallaxEffect();
  }

  // NEW: Initialize brand filtering
  function initializeBrandFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const brandItems = document.querySelectorAll('.brand-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', function () {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        // Filter brands
        brandItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category').includes(filter)) {
            item.style.display = 'flex';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(50px) scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });

        playFilterSound();
      });
    });
  }

  // NEW: Open brand modal
  function openBrandModal(brand) {
    const modal = document.getElementById('brandModal');
    const modalBody = document.getElementById('modalBody');

    // In a real implementation, you would fetch brand data from an API
    // For this example, we'll use static content
    const brandData = {
      nordicdesign: {
        name: "NordicDesign",
        description: "Scandinavian minimalism meets functional design. NordicDesign brings the essence of Nordic living to modern interiors with clean lines and natural materials.",
        details: "Founded in 1999, NordicDesign has been at the forefront of Scandinavian furniture design for over two decades. Each piece is crafted with attention to detail and respect for traditional Nordic craftsmanship techniques combined with modern innovation.",
        specialties: ["Minimalist Design", "Natural Materials", "Functional Furniture"],
        year: 1999,
        collections: 12,
        satisfaction: 98
      },
      minimalliving: {
        name: "MinimalLiving",
        description: "Embrace simplicity with purpose. MinimalLiving creates transformative pieces that maximize space and minimize clutter without compromising on style.",
        details: "Since 2009, MinimalLiving has been creating furniture that is not only beautiful but also mindful of the environment and living spaces. Their philosophy is that good design can be transformative.",
        specialties: ["Sustainable Materials", "Space-Saving Design", "Minimalist Aesthetics"],
        year: 2009,
        collections: 8,
        satisfaction: 96
      },
      urbancraft: {
        name: "UrbanCraft",
        description: "Where urban aesthetics meet artisanal craftsmanship. UrbanCraft blends industrial elements with handcrafted details for distinctive statement pieces.",
        details: "Established in 2006, UrbanCraft is for those who appreciate the beauty in imperfection. Their pieces often feature raw materials like exposed metal and reclaimed wood, creating a look that is both edgy and timeless.",
        specialties: ["Industrial Design", "Handcrafted Details", "Statement Pieces"],
        year: 2006,
        collections: 10,
        satisfaction: 97
      },
      scandistyle: {
        name: "ScandiStyle",
        description: "Authentic Scandinavian design philosophy that prioritizes light, space and harmony. ScandiStyle creates environments that promote wellbeing and comfort.",
        details: "For over two decades, ScandiStyle has been a beacon of classic Scandinavian design. Their commitment to sustainability and quality materials has made them a favorite among designers and homeowners alike who seek to create bright, airy, and harmonious living spaces.",
        specialties: ["Scandinavian Design", "Sustainable Practices", "Comfort & Wellbeing"],
        year: 2002,
        collections: 14,
        satisfaction: 99
      },
      artisanwood: {
        name: "ArtisanWood",
        description: "Celebrating the natural beauty of wood through master craftsmanship. ArtisanWood creates heirloom-quality pieces using sustainable practices and traditional techniques.",
        details: "With 30 years of experience, ArtisanWood represents the pinnacle of woodworking. Each piece is a testament to the skill of their craftsmen, who use time-honored techniques to create furniture that is built to last for generations. They are committed to using sustainably sourced timber.",
        specialties: ["Master Craftsmanship", "Heirloom Quality", "Traditional Techniques"],
        year: 1994,
        collections: 6,
        satisfaction: 100
      },
      modernist: {
        name: "Modernist",
        description: "Bold, forward-thinking designs that challenge conventions. Modernist combines cutting-edge materials with innovative forms to create the furniture of tomorrow.",
        details: "Since 2012, Modernist has been pushing the boundaries of furniture design. They are known for their experimental use of materials and sculptural forms, creating pieces that are not just furniture, but works of art.",
        specialties: ["Forward-Thinking Design", "Cutting-Edge Materials", "Innovative Forms"],
        year: 2012,
        collections: 9,
        satisfaction: 95
      }
    };

    const data = brandData[brand] || brandData.nordicdesign;

    modalBody.innerHTML = `
  <div style="padding: 3rem;">
    <h2 style="margin-bottom: 1.5rem; font-size: 2.5rem;">${data.name}</h2>
    <p style="margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.7;">${data.description}</p>
    <p style="margin-bottom: 2rem; line-height: 1.6;">${data.details}</p>
    <div style="margin-bottom: 2rem;">
      <h3 style="margin-bottom: 1rem;">Specialties</h3>
      <ul style="list-style: none; display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${data.specialties.map(spec => `<li style="background: var(--accent-gray); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">${spec}</li>`).join('')}
      </ul>
    </div>
    <div style="display: flex; gap: 2rem; margin-top: 2rem;">
      <div style="text-align: center;">
        <div style="font-size: 2rem; font-weight: bold;">${data.year}</div>
        <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Established</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 2rem; font-weight: bold;">${data.collections}</div>
        <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Collections</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 2rem; font-weight: bold;">${data.satisfaction}%</div>
        <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Satisfaction</div>
      </div>
    </div>
  </div>
  `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playModalSound();
  }

  // NEW: Close brand modal
  function closeBrandModal() {
    const modal = document.getElementById('brandModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    playModalSound();
  }

  // Create background decorative elements
  function createBackgroundElements() {
    const bgElementsContainer = document.getElementById('bgElements');
    const elementCount = 15;

    for (let i = 0; i < elementCount; i++) {
      const element = document.createElement('div');
      element.classList.add('bg-element');
      element.classList.add('parallax-element');

      // Random size and position
      const size = Math.random() * 100 + 20;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;

      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${posX}%`;
      element.style.top = `${posY}%`;
      element.style.opacity = Math.random() * 0.2;
      element.style.transform = `rotate(${Math.random() * 90}deg)`;
      element.style.transition = `all ${Math.random() * 10 + 5}s ease-in-out`;

      bgElementsContainer.appendChild(element);
    }

    // Create decorative lines
    const lineCount = 8;
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      line.classList.add('decorative-line');
      line.classList.add('parallax-element');

      const width = Math.random() * 300 + 100;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const rotation = Math.random() * 180;

      line.style.width = `${width}px`;
      line.style.left = `${posX}%`;
      line.style.top = `${posY}%`;
      line.style.transform = `rotate(${rotation}deg)`;

      bgElementsContainer.appendChild(line);
    }

    // Animate background elements
    animateBackgroundElements();
  }

  function animateBackgroundElements() {
    const elements = document.querySelectorAll('.bg-element');

    elements.forEach(element => {
      // Random animation
      const animX = (Math.random() - 0.5) * 20;
      const animY = (Math.random() - 0.5) * 20;
      const animRotate = (Math.random() - 0.5) * 45;

      element.style.transform = `translate(${animX}px, ${animY}px) rotate(${animRotate}deg)`;
    });
  }

  // NEW: Add parallax effect to background elements
  function addParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-element');

    window.addEventListener('mousemove', function (e) {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
        const x = (mouseX - 0.5) * speed * 100;
        const y = (mouseY - 0.5) * speed * 100;

        element.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  // Create floating particles
  function createFloatingParticles() {
    const container = document.getElementById('floatingParticles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 8 + 2;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 10;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `-${delay}s`;

      container.appendChild(particle);
    }
  }

  // Sound Functions
  function playInteractionSound() {
    if (!soundEnabled) return;
    // In a real implementation, you would play an actual sound
    console.log('Interaction sound played');
    // Example: Howler.js or Web Audio API implementation would go here
  }

  function playHoverSound() {
    if (!soundEnabled) return;
    console.log('Hover sound played');
  }

  function playSuccessSound() {
    if (!soundEnabled) return;
    console.log('Success sound played');
  }

  function playToggleSound() {
    if (!soundEnabled) return;
    console.log('Toggle sound played');
  }

  function playFilterSound() {
    if (!soundEnabled) return;
    console.log('Filter sound played');
  }

  function playModalSound() {
    if (!soundEnabled) return;
    console.log('Modal sound played');
  }

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
});
