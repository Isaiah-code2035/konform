/**
 * KONFORME — main.js
 * Editorial publication site
 */
'use strict';

/* ─── Mobile Nav ─────────────────────── */
function initMobileNav() {
  const btn = document.getElementById('menu-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  const close = document.getElementById('mobile-nav-close');
  if (close) {
    close.addEventListener('click', () => {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  }

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ─── FAQ Accordion ──────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-item__q');
    const a = item.querySelector('.faq-item__a');
    if (!q || !a) return;

    q.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open);
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    });
  });
}

/* ─── Cookie Banner ──────────────────── */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  if (localStorage.getItem('konforme_cookie_consent')) {
    banner.hidden = true;
    return;
  }

  const accept = document.getElementById('cookie-accept');
  const decline = document.getElementById('cookie-decline');

  function hide(choice) {
    localStorage.setItem('konforme_cookie_consent', choice);
    banner.style.transform = 'translateY(100%)';
    banner.style.transition = 'transform 0.3s ease';
    setTimeout(() => { banner.hidden = true; }, 300);
  }

  if (accept) accept.addEventListener('click', () => hide('accepted'));
  if (decline) decline.addEventListener('click', () => hide('declined'));
}

/* ─── Scroll Reveal ──────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
}

/* ─── Smooth Scroll ──────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Language Switcher ─────────────── */
function initLangSwitch() {
  const switcher = document.getElementById('lang-switch');
  const dropdown = document.getElementById('lang-dropdown');
  if (!switcher || !dropdown) return;

  const toggle = switcher.querySelector('.lang-switch__toggle');
  if (!toggle) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dropdown.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', (e) => {
    if (!switcher.contains(e.target)) {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ─── Init ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFAQ();
  initCookieBanner();
  initReveal();
  initSmoothScroll();
  initLangSwitch();
});
