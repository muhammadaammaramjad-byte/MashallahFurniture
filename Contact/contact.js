// Wait for DOM to be fully loaded

document.addEventListener('DOMContentLoaded', function () {

  // Hide loading screen
  setTimeout(() => {
    document.getElementById('loadingScreen').style.opacity = '0';
    document.getElementById('loadingScreen').style.visibility = 'hidden';
  }

    , 1500);

  // Initialize particles.js
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 80, density: {
          enable: true, value_area: 800
        }
      }

      ,
      color: {
        value: "#000000"
      }

      ,
      shape: {
        type: "circle"
      }

      ,
      opacity: {
        value: 0.5, random: true
      }

      ,
      size: {
        value: 3, random: true
      }

      ,
      line_linked: {
        enable: true,
        distance: 150,
        color: "#000000",
        opacity: 0.4,
        width: 1
      }

      ,
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    }

    ,
    interactivity: {

      detect_on: "canvas",
      events: {
        onhover: {
          enable: true, mode: "grab"
        }

        ,
        onclick: {
          enable: true, mode: "push"
        }

        ,
        resize: true
      }

      ,
      modes: {
        grab: {
          distance: 140, line_linked: {
            opacity: 1
          }
        }

        ,
        push: {
          particles_nb: 4
        }
      }
    }

    ,
    retina_detect: true
  });

  // Scroll indicator functionality
  document.getElementById('scrollIndicator').addEventListener('click', function () {
    window.scrollTo({
      top: document.querySelector('.contact-content').offsetTop - 100,
      behavior: 'smooth'
    });
  });

  // Back to top button
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    }

    else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // FAQ accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
    });
  });

  // Testimonials slider
  const testimonialsSlider = document.getElementById('testimonialsSlider');
  const prevTestimonial = document.getElementById('prevTestimonial');
  const nextTestimonial = document.getElementById('nextTestimonial');
  let testimonialIndex = 0;

  nextTestimonial.addEventListener('click', function () {
    testimonialIndex = (testimonialIndex + 1) % 3;

    testimonialsSlider.scrollTo({
      left: testimonialIndex * testimonialsSlider.offsetWidth,
      behavior: 'smooth'
    });
  });

  prevTestimonial.addEventListener('click', function () {
    testimonialIndex = (testimonialIndex - 1 + 3) % 3;

    testimonialsSlider.scrollTo({
      left: testimonialIndex * testimonialsSlider.offsetWidth,
      behavior: 'smooth'
    });
  });

  // Auto-rotate testimonials
  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % 3;

    testimonialsSlider.scrollTo({
      left: testimonialIndex * testimonialsSlider.offsetWidth,
      behavior: 'smooth'
    });
  }

    , 5000);

  // Form submission handling
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;

    // Simple validation
    if (name && email && subject) {
      // Play success sound
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
      audio.play();

      // Launch confetti
      launchConfetti();

      // In a real application, you would send this data to a server
      // Here we'll just show a confirmation message
      alert(`Thank you, $ {
          name
        }

        ! Your message has been sent. We'll get back to you soon at ${email}.`);
      contactForm.reset();
    }

    else {
      alert('Please fill in all required fields.');
    }
  });

  // Animate elements on scroll
  const animateOnScroll = function () {
    const elements = document.querySelectorAll('.info-item, .form-group, .faq-item, .stat-item, .team-member, .process-step');

    elements.forEach(element => {
      const position = element.getBoundingClientRect();

      // If element is in viewport
      if (position.top < window.innerHeight - 100) {
        element.style.animationPlayState = 'running';
      }
    });
  }

    ;

  // Animated counter for stats
  const animateCounters = function () {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      const count = +counter.innerText;
      const increment = Math.ceil(target / speed);

      if (count < target) {
        counter.innerText = Math.min(count + increment, target);
        setTimeout(animateCounters, 1);
      }
    });
  }

    ;

  // Check if stats are in viewport
  const checkStatsViewport = function () {
    const statsSection = document.querySelector('.stats-section');
    const position = statsSection.getBoundingClientRect();

    // If stats section is in viewport
    if (position.top < window.innerHeight && position.bottom >= 0) {
      animateCounters();
      window.removeEventListener('scroll', checkStatsViewport);
    }
  }

    ;

  // Run on load and scroll
  window.addEventListener('load', function () {
    animateOnScroll();
    window.addEventListener('scroll', checkStatsViewport);
  });
  window.addEventListener('scroll', animateOnScroll);

  // Confetti function
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let confetti = [];
    const confettiCount = 300;
    const gravity = 0.5;
    const terminalVelocity = 5;
    const drag = 0.075;

    const colors = [{
      front: '#000000', back: '#333333'
    }

      ,
    {
      front: '#ffffff', back: '#cccccc'
    }

    ];

    // Resize canvas
    window.addEventListener('resize', function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Confetti class
    class Confetti {
      constructor() {
        this.randomModifier = Math.random() * 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];

        this.dimensions = {
          x: Math.random() * 5 + 5,
          y: Math.random() * 5 + 5
        }

          ;

        this.position = {
          x: Math.random() * canvas.width,
          y: -10
        }

          ;
        this.rotation = Math.random() * 2 * Math.PI;

        this.scale = {
          x: 1,
          y: 1
        }

          ;

        this.velocity = {
          x: Math.random() * 10 - 5,
          y: Math.random() * 5 + 5
        }

          ;
        this.oscillation = Math.random() * 10;
      }

      update() {
        this.velocity.x -= this.velocity.x * drag;
        this.velocity.y = Math.min(this.velocity.y + gravity, terminalVelocity);
        this.velocity.y -= this.velocity.y * drag;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.oscillation += 0.1;
        this.scale.y = Math.cos(this.oscillation) * 0.3 + 1;

        if (this.position.y >= canvas.height) {
          this.velocity.y *= -0.5;
          this.position.y = canvas.height;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        ctx.fillStyle = this.color.front;
        ctx.fillRect(-this.dimensions.x / 2, -this.dimensions.y / 2, this.dimensions.x, this.dimensions.y);

        ctx.restore();
      }
    }

    // Initialize confetti
    for (let i = 0; i < confettiCount; i++) {
      confetti.push(new Confetti());
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((confetto, index) => {
        confetto.update();
        confetto.draw();

        // Remove confetti that's off screen
        if (confetto.position.y > canvas.height && confetti.length > confettiCount * 0.25) {
          confetti.splice(index, 1);
        }
      });

      // Continue animation if there are still confetti
      if (confetti.length > 0) {
        requestAnimationFrame(animate);
      }

      else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Start animation
    animate();
  }

  // Add subtle hover effects to all interactive elements
  document.querySelectorAll('button, a, .social-link, .info-item, .faq-question, .team-member, .process-step, .slider-btn').forEach(element => {
    element.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)';
      this.style.transition = 'transform 0.3s ease';
    });

    element.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });
  });

  // Add keyboard navigation for accessibility
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      prevTestimonial.click();
    }

    else if (e.key === 'ArrowRight') {
      nextTestimonial.click();
    }
  });
});
