// Typewriter Effect
const roles = ["Founder.", "Full-Stack Developer.", "Cloud Architect."];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

function type() {
  if (!typewriterElement) return;
  
  const currentRole = roles[roleIndex];
  
  if (isDeleting) {
    typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentRole.length) {
    typeSpeed = 2000; // Pause at end of word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 500; // Pause before typing new word
  }

  setTimeout(type, typeSpeed);
}

// Start typewriter on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(type, 1000);
});

// Topbar Blur on Scroll
const nav = document.querySelector('.premium-nav');
window.addEventListener('scroll', () => {
  if (nav) {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
});

// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal-up');
const revealOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Staggered List Animations
const animatedLists = document.querySelectorAll('.animated-list');
const listObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

animatedLists.forEach(list => listObserver.observe(list));

// 3D Tilt Effect on Cards & Images
const tiltElements = document.querySelectorAll('.tilt-card');
tiltElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-10 to 10 degrees)
    const xPct = (x / rect.width - 0.5) * 15;
    const yPct = (y / rect.height - 0.5) * -15;
    
    el.style.transform = `perspective(1000px) rotateY(${xPct}deg) rotateX(${yPct}deg) scale3d(1.02, 1.02, 1.02)`;
    el.style.transition = 'none';
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    el.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
});

// Magnetic Hover Effect for Buttons and Links
const magneticElements = document.querySelectorAll('.magnetic-btn, .magnetic');
magneticElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const hx = e.clientX - rect.left - rect.width / 2;
    const hy = e.clientY - rect.top - rect.height / 2;
    
    // Move element slightly towards mouse
    el.style.transform = `translate(${hx * 0.3}px, ${hy * 0.3}px)`;
    el.style.transition = 'none';
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = `translate(0px, 0px)`;
    el.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
});

// Card Hover Glow Tracking
const glowCards = document.querySelectorAll('.hover-glow');
glowCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if(target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Auto-playing Image Carousel
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;

function nextSlide() {
  if(slides.length === 0) return;
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

if(slides.length > 0) {
  setInterval(nextSlide, 4000); // Change image every 4 seconds
}

// Global Parallax & Dynamic Animations on Scroll
window.addEventListener('scroll', () => {
  // Parallax effect on Hero Visual
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    const scrollY = window.scrollY;
    heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
  }
  
  // Parallax effect on tech grid
  const techGrid = document.querySelector('.tech-grid-overlay');
  if (techGrid) {
    techGrid.style.transform = `perspective(500px) rotateX(60deg) scale(2) translateY(${window.scrollY * 0.05}px)`;
  }
});

// Custom Cursor Animation
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');

if (cursor && cursorDot) {
  window.addEventListener('mousemove', (e) => {
    // Fast tracking for the dot
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    
    // Smooth trailing for the outline
    cursor.animate({
      left: `${e.clientX}px`,
      top: `${e.clientY}px`
    }, { duration: 500, fill: "forwards" });
  });

  // Cursor hover effects on links and buttons
  const hoverables = document.querySelectorAll('a, .btn, .premium-card, .magnetic-btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '60px';
      cursor.style.height = '60px';
      cursor.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.backgroundColor = 'transparent';
    });
  });
}
