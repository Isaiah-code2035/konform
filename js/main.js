/**
 * KONFORME — main.js
 *
 * Modules:
 *   1. Waitlist Form Handler
 *   2. Scroll Reveal (Intersection Observer)
 *   3. Sticky Nav with class toggle
 *   4. Mobile Navigation Toggle
 *   5. Smooth scroll for anchor links
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
  const revealElements = document.querySelectorAll(
    '.feature-card, .coverage__item, .how__step, .why__point, .compliance-card'
  );

  if (!revealElements.length) return;

  revealElements.forEach((el) => el.classList.add('reveal'));

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
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}


/* ─────────────────────────────────────────
   3. STICKY NAV — toggle class on scroll
───────────────────────────────────────── */

function initStickyNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
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
   INIT — run all modules on DOM ready
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initWaitlistForms();
  initScrollReveal();
  initStickyNav();
  initMobileNav();
  initActiveNavLinks();
});
