const R = document.documentElement;
const hdr = document.getElementById('hdr');
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const dd = document.getElementById('dd');
const ddb = dd.querySelector('button');
const prog = document.getElementById('prog');


const links = [...document.querySelectorAll('.nav a.link')];
const secs = ['home', 'about', 'plans', 'location'].map(id => document.getElementById(id));

// Scroll & Scrollspy Handlers
function onScroll() {
  hdr.classList.toggle('scrolled', window.scrollY > 20);
  prog.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  
  let currentSection = 0;
  secs.forEach((sec, i) => {
    if (sec.getBoundingClientRect().top < 140) {
      currentSection = i;
    }
  });

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + secs[currentSection].id);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Dropdown Handlers
function setDD(open) {
  dd.classList.toggle('open', open);
  ddb.setAttribute('aria-expanded', open);
}

ddb.addEventListener('click', (e) => {
  e.stopPropagation();
  setDD(!dd.classList.contains('open'));
});

if (window.matchMedia('(hover:hover) and (min-width:901px)').matches) {
  dd.addEventListener('mouseenter', () => setDD(true));
  dd.addEventListener('mouseleave', () => setDD(false));
}

document.addEventListener('click', (e) => {
  if (!dd.contains(e.target)) setDD(false);
});

// Mobile Navigation Handlers
function closeNav() {
  nav.classList.remove('open');
  burger.classList.remove('on');
  burger.setAttribute('aria-expanded', 'false');
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    setDD(false);
    closeNav();
  }
});

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  burger.classList.toggle('on', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) closeNav();
});


// Sliding Active Indicator
const ind = document.createElement('i');
ind.className = 'ind';
nav.appendChild(ind);

const targets = [...links, ddb];
let isHovered = false;

function place(el) {
  if (!el || getComputedStyle(ind).display === 'none') return;
  const navRect = nav.getBoundingClientRect();
  const targetRect = el.getBoundingClientRect();
  ind.style.width = (targetRect.width - 28) + 'px';
  ind.style.transform = 'translateX(' + (targetRect.left - navRect.left + 14) + 'px)';
  ind.style.opacity = '1';
}

function rest() {
  place(links.find(link => link.classList.contains('active')));
}

targets.forEach(target => {
  target.addEventListener('mouseenter', () => {
    isHovered = true;
    place(target);
  });
});

nav.addEventListener('mouseleave', () => {
  isHovered = false;
  dd.classList.contains('open') ? place(ddb) : rest();
});

window.addEventListener('resize', () => {
  place(links.find(link => link.classList.contains('active')));
});

(document.fonts ? document.fonts.ready : Promise.resolve()).then(rest);

window.addEventListener('scroll', () => {
  if (!isHovered && !dd.classList.contains('open')) rest();
}, { passive: true });

// Auto-hide Navbar on Scroll Down, Show on Scroll Up
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const isMenuBusy = nav.classList.contains('open') || dd.classList.contains('open');
  
  hdr.classList.toggle('hide', currentScrollY > lastScrollY && currentScrollY > 160 && !isMenuBusy);
  lastScrollY = currentScrollY;
}, { passive: true });

// Cursor Radial Light Effect
hdr.addEventListener('mousemove', (e) => {
  hdr.style.setProperty('--mx', e.clientX + 'px');
});

// Prevent Body Scroll When Mobile Menu is Open
new MutationObserver(() => {
  document.body.classList.toggle('lock', nav.classList.contains('open'));
}).observe(nav, { attributes: true, attributeFilter: ['class'] });

// Reveal content as it enters the viewport without animating the initial hero.
const revealItems = document.querySelectorAll('#about, #plans, #signup, .gym-gallery-item, .single-coach-spotlight, .reviews-card, .plan-card, .join-info-card, .join-form-card');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => {
    item.classList.add('scroll-reveal');
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}