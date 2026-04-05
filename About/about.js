
document.addEventListener('DOMContentLoaded', function () {
  // Initialize animations on scroll
  initAnimations();

  // Initialize testimonial slider
  initTestimonialSlider();

  // Initialize interactive map
  initInteractiveMap();
});

// Initialize animations on scroll
function initAnimations() {
  const animatedElements = document.querySelectorAll('.value-card, .team-member');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, 100 * Array.from(animatedElements).indexOf(entry.target));
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(element => {
    observer.observe(element);
  });

  // Animate timeline items
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          if (entry.target.classList.contains('timeline-item')) {
            if (index % 2 === 0) {
              entry.target.style.animation = `fadeInLeft 0.6s ease forwards`;
            } else {
              entry.target.style.animation = `fadeInRight 0.6s ease forwards`;
            }
          }
        }, 150 * index);
      }
    });
  }, { threshold: 0.3 });

  timelineItems.forEach(item => {
    timelineObserver.observe(item);
  });
}

// Initialize testimonial slider
function initTestimonialSlider() {
  const track = document.getElementById('testimonialsTrack');
  const navButtons = document.querySelectorAll('.testimonial-nav-btn');
  let currentIndex = 0;

  navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
    });
  });

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    navButtons.forEach((button, index) => {
      if (index === currentIndex) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  // Auto-advance slides
  setInterval(() => {
    currentIndex = (currentIndex + 1) % navButtons.length;
    updateSlider();
  }, 5000);
}

// Initialize interactive map
function initInteractiveMap() {
  const mapContainer = document.getElementById('showroomMap');

  // Create a simple SVG map
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", "0 0 100 100");

  // Create background
  const bg = document.createElementNS(svgNS, "rect");
  bg.setAttribute("width", "100");
  bg.setAttribute("height", "100");
  bg.setAttribute("fill", "#f2f2f2");
  svg.appendChild(bg);

  // Create showroom outline
  const showroom = document.createElementNS(svgNS, "rect");
  showroom.setAttribute("x", "10");
  showroom.setAttribute("y", "10");
  showroom.setAttribute("width", "80");
  showroom.setAttribute("height", "80");
  showroom.setAttribute("fill", "none");
  showroom.setAttribute("stroke", "#000000");
  showroom.setAttribute("stroke-width", "0.5");
  svg.appendChild(showroom);

  // Create furniture sections
  const sections = [
    { x: 15, y: 15, width: 25, height: 25, name: "Living Room" },
    { x: 50, y: 15, width: 25, height: 25, name: "Dining Room" },
    { x: 15, y: 50, width: 25, height: 25, name: "Bedroom" },
    { x: 50, y: 50, width: 25, height: 25, name: "Office" }
  ];

  sections.forEach(section => {
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", section.x);
    rect.setAttribute("y", section.y);
    rect.setAttribute("width", section.width);
    rect.setAttribute("height", section.height);
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "#000000");
    rect.setAttribute("stroke-width", "0.3");
    rect.setAttribute("data-name", section.name);

    // Add hover effect
    rect.addEventListener('mouseenter', () => {
      rect.setAttribute("fill", "rgba(0, 0, 0, 0.1)");
    });

    rect.addEventListener('mouseleave', () => {
      rect.setAttribute("fill", "none");
    });

    svg.appendChild(rect);
  });

  // Add entrance marker
  const entrance = document.createElementNS(svgNS, "circle");
  entrance.setAttribute("cx", "50");
  entrance.setAttribute("cy", "5");
  entrance.setAttribute("r", "2");
  entrance.setAttribute("fill", "#000000");
  svg.appendChild(entrance);

  // Add text
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "50");
  text.setAttribute("y", "95");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "#000000");
  text.setAttribute("font-size", "3");
  text.textContent = "Ramma Furniture Showroom";
  svg.appendChild(text);

  mapContainer.appendChild(svg);
}
