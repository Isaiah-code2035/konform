/**
 * KONFORME — main.js
 *
 * Modules:
 *   1. Waitlist Form Handler
 *   2. Scroll Reveal (Intersection Observer)
 *   3. Sticky Nav with class toggle
 *   4. Mobile Navigation Toggle
 *   5. Active Nav Link Highlighting
 *   6. Smooth Scroll for anchor links
 */

'use strict';

/* ─────────────────────────────────────────
   CONFIG
───────────────────────────────────────── */
const CONFIG = {
  SUCCESS_MESSAGE: 'You\'re on the list. We\'ll be in touch soon.',
  ERROR_MESSAGE:   'Something went wrong. Please try again or email hello@konforme.io',
};


/* ─────────────────────────────────────────
   1. WAITLIST FORM HANDLER
───────────────────────────────────────── */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showSuccess(form, successEl) {
  form.style.display = 'none';
  successEl.textContent = CONFIG.SUCCESS_MESSAGE;
  successEl.classList.add('waitlist-form__success--visible');
}

function showInputError(input) {
  input.classList.add('waitlist-form__input--error');
  input.focus();

  input.addEventListener('input', () => {
    input.classList.remove('waitlist-form__input--error');
  }, { once: true });
}

async function submitEmail(email, formName) {
  try {
    const body = new URLSearchParams({
      'form-name': formName,
      'email': email,
    });

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    return response.ok;
  } catch (error) {
    console.error('[Konforme] Submission error:', error);
    return false;
  }
}

async function handleFormSubmit(form) {
  const input   = form.querySelector('.waitlist-form__input');
  const button  = form.querySelector('.waitlist-form__btn');
  const success = form.nextElementSibling;

  if (!input || !button || !success) return;

  const email = input.value.trim();

  if (!isValidEmail(email)) {
    showInputError(input);
    return;
  }

  const originalHTML = button.innerHTML;
  button.innerHTML = '<span>Submitting...</span>';
  button.disabled = true;
  button.style.opacity = '0.7';

  const ok = await submitEmail(email, form.getAttribute('name'));

  if (ok) {
    showSuccess(form, success);
  } else {
    button.innerHTML = originalHTML;
    button.querySelector('span').textContent = 'Try Again';
    button.disabled = false;
    button.style.opacity = '1';
    alert(CONFIG.ERROR_MESSAGE);
  }
}

function initWaitlistForms() {
  const forms = document.querySelectorAll('.waitlist-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      handleFormSubmit(form);
    });
  });
}


/* ─────────────────────────────────────────
   2. SCROLL REVEAL
   IntersectionObserver with staggered animations
───────────────────────────────────────── */

function initScrollReveal() {
  // Grid/card items — staggered fade up
  const revealElements = document.querySelectorAll(
    '.feature-card, .coverage__item, .how__step, .why__point, .compliance-card, .countries__card, .faq__item'
  );

  // Section headers — fade up
  const headerElements = document.querySelectorAll(
    '.section__label, .section__title, .section__subtitle'
  );

  // Mid-page CTAs
  const ctaElements = document.querySelectorAll('.mid-cta');

  if (revealElements.length) {
    revealElements.forEach((el) => el.classList.add('reveal'));
  }

  if (headerElements.length) {
    headerElements.forEach((el) => el.classList.add('reveal-header'));
  }

  if (ctaElements.length) {
    ctaElements.forEach((el) => el.classList.add('reveal-cta'));
  }

  const allRevealable = [
    ...revealElements,
    ...headerElements,
    ...ctaElements,
  ];

  if (!allRevealable.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  allRevealable.forEach((el) => observer.observe(el));
}


/* ─────────────────────────────────────────
   3. STICKY NAV — toggle class on scroll
───────────────────────────────────────── */

function initStickyNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ─────────────────────────────────────────
   4. MOBILE NAVIGATION TOGGLE
───────────────────────────────────────── */

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('nav__links--open');
    toggle.classList.toggle('nav__hamburger--active');
    toggle.setAttribute('aria-expanded', isOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('nav__links--open');
      toggle.classList.remove('nav__hamburger--active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}


/* ─────────────────────────────────────────
   5. ACTIVE NAV LINK HIGHLIGHTING
───────────────────────────────────────── */

function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a:not(.nav__cta)');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.style.color = link.getAttribute('href') === `#${id}` ? '#00C2D4' : '';
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-72px 0px -50% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}


/* ─────────────────────────────────────────
   6. SMOOTH SCROLL — enhanced for anchor links
───────────────────────────────────────── */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = 88;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}


/* ─────────────────────────────────────────
   7. COOKIE CONSENT BANNER
───────────────────────────────────────── */

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  // If user already made a choice, hide immediately
  if (localStorage.getItem('konforme_cookie_consent')) {
    banner.hidden = true;
    return;
  }

  function hideBanner(choice) {
    localStorage.setItem('konforme_cookie_consent', choice);
    banner.classList.add('cookie-banner--hiding');
    banner.addEventListener('animationend', () => {
      banner.hidden = true;
    }, { once: true });
  }

  document.getElementById('cookie-accept').addEventListener('click', () => hideBanner('accepted'));
  document.getElementById('cookie-decline').addEventListener('click', () => hideBanner('declined'));
}


/* ─────────────────────────────────────────
   INIT — run all modules on DOM ready
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initWaitlistForms();
  initScrollReveal();
  initStickyNav();
  initMobileNav();
  initActiveNavLinks();
  initSmoothScroll();
  initCookieBanner();
});
