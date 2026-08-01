// ============================================
// ARHAM MALIK — Portfolio JavaScript
// Particle System · Preloader · Animations
// ============================================

// ── Preloader ──
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const terminal = document.getElementById('preloader-terminal');
  const barFill = document.getElementById('preloader-bar-fill');
  
  if (!preloader || !terminal || !barFill) return;

  const lines = terminal.querySelectorAll('.line');
  let progress = 0;

  function showLines() {
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('visible');
        progress = Math.min(100, ((i + 1) / lines.length) * 100);
        barFill.style.width = progress + '%';

        // After last line, dismiss preloader
        if (i === lines.length - 1) {
          setTimeout(() => {
            barFill.style.width = '100%';
            setTimeout(() => {
              preloader.classList.add('loaded');
              document.body.style.overflow = '';
            }, 400);
          }, 300);
        }
      }, 200 + i * 280);
    });
  }

  // Prevent scrolling during preloader
  document.body.style.overflow = 'hidden';
  showLines();
})();


// ── Particle Network Background ──
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -999, y: -999 };
  let animationId;

  const CONFIG = {
    particleCount: 80,
    maxDistance: 150,
    particleSize: { min: 1, max: 2.5 },
    speed: 0.3,
    mouseRadius: 200,
    colors: ['rgba(0, 240, 255, ', 'rgba(168, 85, 247, ', 'rgba(99, 102, 241, ']
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const colorBase = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      size: CONFIG.particleSize.min + Math.random() * (CONFIG.particleSize.max - CONFIG.particleSize.min),
      colorBase: colorBase,
      alpha: 0.3 + Math.random() * 0.5,
      pulseOffset: Math.random() * Math.PI * 2
    };
  }

  function initParticles() {
    particles = [];
    // Scale particle count based on screen width
    const count = window.innerWidth < 768 ? 40 : CONFIG.particleCount;
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticle(p, time) {
    const pulse = Math.sin(time * 0.002 + p.pulseOffset) * 0.3 + 0.7;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
    ctx.fillStyle = p.colorBase + (p.alpha * pulse) + ')';
    ctx.fill();
  }

  function drawConnections(time) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxDistance) {
          const alpha = (1 - dist / CONFIG.maxDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Connect to mouse
      const mdx = particles[i].x - mouse.x;
      const mdy = particles[i].y - mouse.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mDist < CONFIG.mouseRadius) {
        const alpha = (1 - mDist / CONFIG.mouseRadius) * 0.4;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  function updateParticles() {
    particles.forEach(p => {
      // Mouse attraction
      const mdx = mouse.x - p.x;
      const mdy = mouse.y - p.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mDist < CONFIG.mouseRadius && mDist > 0) {
        const force = (CONFIG.mouseRadius - mDist) / CONFIG.mouseRadius * 0.01;
        p.vx += (mdx / mDist) * force;
        p.vy += (mdy / mDist) * force;
      }

      // Apply velocity with damping
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Wrap around edges
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
    });
  }

  function animate(time) {
    ctx.clearRect(0, 0, width, height);
    drawConnections(time);
    particles.forEach(p => drawParticle(p, time));
    updateParticles();
    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  resize();
  initParticles();
  animate(0);

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });
})();


// ── Typewriter Effect ──
const roles = [
  "Founder & Developer.",
  "Full-Stack Engineer.",
  "DevOps Enthusiast.",
  "Cloud Architect.",
  "AI Builder."
];
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

  let typeSpeed = isDeleting ? 35 : 70;

  if (!isDeleting && charIndex === currentRole.length) {
    typeSpeed = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 400;
  }

  setTimeout(type, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(type, 1500);
});


// ── Animated Counters ──
function animateCounters() {
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const target = parseInt(entry.target.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          entry.target.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.textContent = target.toLocaleString();
          }
        }

        requestAnimationFrame(updateCounter);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => counterObserver.observe(counter));
}

animateCounters();


// ── Navigation ──
const nav = document.getElementById('main-nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Topbar scroll effect
window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
}, { passive: true });

// Hamburger toggle
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Active section tracking
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = navLinks ? navLinks.querySelectorAll('a[href^="#"]') : [];

  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + currentSection) {
      a.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// ── Scroll Reveal Animations ──
const revealElements = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// Staggered List Animations
const animatedLists = document.querySelectorAll('.animated-list');
const listObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

animatedLists.forEach(list => listObserver.observe(list));


// ── 3D Tilt Effect on Cards & Images ──
const tiltElements = document.querySelectorAll('.tilt-card');
tiltElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x / rect.width - 0.5) * 12;
    const yPct = (y / rect.height - 0.5) * -12;

    el.style.transform = `perspective(1000px) rotateY(${xPct}deg) rotateX(${yPct}deg) scale3d(1.02, 1.02, 1.02)`;
    el.style.transition = 'none';
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    el.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
});


// ── Magnetic Hover Effect ──
const magneticElements = document.querySelectorAll('.magnetic-btn, .magnetic');
magneticElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const hx = e.clientX - rect.left - rect.width / 2;
    const hy = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${hx * 0.25}px, ${hy * 0.25}px)`;
    el.style.transition = 'none';
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = `translate(0px, 0px)`;
    el.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
});


// ── Card Spotlight Glow Tracking ──
const glowCards = document.querySelectorAll('.premium-card');
glowCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Animate RGB border angle
    const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI);
    card.style.setProperty('--rgb-angle', `${angle + 135}deg`);
  });
});


// ── Auto-playing Image Carousel ──
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;

function nextSlide() {
  if (slides.length === 0) return;
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

if (slides.length > 0) {
  setInterval(nextSlide, 4500);
}


// ── Parallax on Scroll ──
const heroVisual = document.querySelector('.hero-visual');

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (heroVisual) {
        heroVisual.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
      }
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });


// ── Custom Cursor with LERP ──
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');

if (cursor && cursorDot) {
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(updateCursor);
  }

  requestAnimationFrame(updateCursor);

  // Hover effects
  const hoverables = document.querySelectorAll('a, button, .btn, .premium-card, .magnetic-btn, .social-btn, .tech-tag, .skill-pill, .tech-icon-wrap');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}


// ── Skill Pill Hover Sound Effect (visual pulse) ──
document.querySelectorAll('.skill-pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.animation = 'none';
    pill.offsetHeight; // trigger reflow
    pill.style.animation = '';
  });
});
