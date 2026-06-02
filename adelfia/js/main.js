/* ============================================================
   ADÉLFIA AB — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Nav scroll --- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Aktiv nav-länk --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Hamburger-meny --- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Fade-in vid scroll --- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* --- Kontaktformulär --- */
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Skickat ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  /* ----------------------------------------------------------
     INSTÄLLNINGSPANEL — färg + typsnitt
     ---------------------------------------------------------- */
  const html   = document.documentElement;
  const toggle = document.getElementById('settingsToggle');
  const box    = document.getElementById('settingsBox');

  const THEMES = ['dag', 'natt', 'stal'];
  const FONTS  = ['klassisk', 'grotesk', 'editorial'];

  const THEME_KEY = 'adelfia-theme';
  const FONT_KEY  = 'adelfia-font';

  function applyTheme(theme) {
    if (!THEMES.includes(theme)) return;
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('[data-theme-value]').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.themeValue === theme)
    );
  }

  function applyFont(font) {
    if (!FONTS.includes(font)) return;
    html.setAttribute('data-font', font);
    localStorage.setItem(FONT_KEY, font);
    document.querySelectorAll('[data-font-value]').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.fontValue === font)
    );
  }

  /* Panel öppna/stäng */
  if (toggle && box) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = box.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', (e) => {
      const panel = document.getElementById('settingsPanel');
      if (panel && !panel.contains(e.target)) {
        box.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Knappar för färg */
  document.querySelectorAll('[data-theme-value]').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.themeValue));
  });

  /* Knappar för typsnitt */
  document.querySelectorAll('[data-font-value]').forEach(btn => {
    btn.addEventListener('click', () => applyFont(btn.dataset.fontValue));
  });

  /* Initialt läge från localStorage */
  const savedTheme = localStorage.getItem(THEME_KEY);
  const savedFont  = localStorage.getItem(FONT_KEY);

  applyTheme(THEMES.includes(savedTheme) ? savedTheme : 'dag');
  applyFont(FONTS.includes(savedFont)   ? savedFont  : 'klassisk');

});
