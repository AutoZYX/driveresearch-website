// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('.nav-links').classList.remove('open');
    }
  });
});

// ===== Navbar background on scroll =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Scrollspy — active section → highlight nav link =====
// Watch each anchored section; whichever is intersecting the top third of
// the viewport wins. Mirrors DRIVEResearch data platform nav active cue.
(() => {
  const sectionIds = ['overview','framework','data','datasets','applications','about','contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;
  const navLinks = new Map();
  document.querySelectorAll('.nav-links > li > a[href^="#"]').forEach(a => {
    navLinks.set(a.getAttribute('href').slice(1), a);
  });
  const setActive = (id) => {
    navLinks.forEach((a, key) => a.classList.toggle('active', key === id));
  };
  const io = new IntersectionObserver(entries => {
    // Pick the most-visible section that's currently intersecting.
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible.length) setActive(visible[0].target.id);
  }, { rootMargin: '-72px 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] });
  sections.forEach(s => io.observe(s));
})();

// ===== Scroll reveal animation =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ===== Counter animation =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    if (target >= 1000000) {
      el.textContent = (current / 1000000).toFixed(1) + 'M' + suffix;
    } else if (target >= 10000) {
      el.textContent = Math.round(current).toLocaleString() + suffix;
    } else {
      el.textContent = (target % 1 === 0) ? Math.round(current) + suffix : current.toFixed(1) + suffix;
    }

    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = '1';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.counter').forEach(el => {
  counterObserver.observe(el);
});
