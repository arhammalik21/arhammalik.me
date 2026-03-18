const topbar = document.querySelector('.topbar');
const revealItems = document.querySelectorAll('.reveal, .card, .timeline li, .highlight-card');
const subtitle = document.querySelector('.subtitle');
const photo = document.getElementById('main-photo');

const rotatingTags = [
  'emotionally intelligent AI workflows',
  'founder-led product development',
  'cloud-powered automation systems',
  'real-world productivity experiences'
];

let tagIndex = 0;
setInterval(() => {
  tagIndex = (tagIndex + 1) % rotatingTags.length;
  subtitle.innerHTML = `Founder of <strong>DaySavvy</strong> — building ${rotatingTags[tagIndex]}.`;
}, 2800);

window.addEventListener('scroll', () => {
  if (window.scrollY > 24) {
    topbar.classList.add('scrolled');
  } else {
    topbar.classList.remove('scrolled');
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

window.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 8;
  const y = (event.clientY / window.innerHeight - 0.5) * 8;

  if (photo) {
    photo.style.transform = `rotateY(${x * 0.35}deg) rotateX(${-y * 0.35}deg) translateY(-4px)`;
  }

  document.querySelectorAll('.bg-orb').forEach((orb, index) => {
    const intensity = (index + 1) * 1.2;
    orb.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
  });
});
