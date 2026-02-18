/**
 * KONFORME — main.js
 *
 * Modules:
 *   1. Waitlist Form Handler
 *   2. Scroll Reveal (Intersection Observer)
 *   3. Sticky Nav Shadow on Scroll
 */

'use strict';

/* ─────────────────────────────────────────
   CONFIG
───────────────────────────────────────── */
const CONFIG = {
  SUCCESS_MESSAGE: '✓ You\'re on the list. We\'ll be in touch soon.',
  ERROR_MESSAGE:   'Something went wrong. Please try again or email hello@konforme.io',
};


/* ─────────────────────────────────────────
   1. WAITLIST FORM HANDLER
───────────────────────────────────────── */

/**
 * Validates a basic email format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Shows the success message and hides the form.
 * @param {HTMLElement} form
 * @param {HTMLElement} successEl
 */
function showSuccess(form, successEl) {
  form.style.display = 'none';
  successEl.textContent = CONFIG.SUCCESS_MESSAGE;
  successEl.classList.add('waitlist-form__success--visible');
}

/**
 * Shows an inline error on the email input.
 * @param {HTMLInputElement} input
 */
function showInputError(input) {
  input.classList.add('waitlist-form__input--error');
  input.focus();

  // Clear error styling on next input
  input.addEventListener('input', () => {
    input.classList.remove('waitlist-form__input--error');
  }, { once: true });
}

/**
 * Submits the email to Netlify Forms.
 * @param {string} email
 * @param {string} formName — matches the form's name attribute
 * @returns {Promise<boolean>} success
 */
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

/**
 * Handles form submission for a given form element.
 * @param {HTMLFormElement} form
 */
async function handleFormSubmit(form) {
  const input   = form.querySelector('.waitlist-form__input');
  const button  = form.querySelector('.waitlist-form__btn');
  const success = form.nextElementSibling; // .waitlist-form__success

  if (!input || !button || !success) return;

  const email = input.value.trim();

  // Validate
  if (!isValidEmail(email)) {
    showInputError(input);
    return;
  }

  // Loading state
  button.textContent = 'Submitting…';
  button.disabled = true;

  const ok = await submitEmail(email, form.getAttribute('name'));

  if (ok) {
    showSuccess(form, success);
  } else {
    button.textContent = 'Try Again';
    button.disabled = false;
    alert(CONFIG.ERROR_MESSAGE);
  }
}

/**
 * Attaches submit listeners to all waitlist forms on the page.
 */
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
   Adds .is-visible to elements with .reveal
   as they enter the viewport.
───────────────────────────────────────── */

/**
 * Sets up an IntersectionObserver to animate
 * elements into view as the user scrolls.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.feature-card, .coverage__item, .how__step, .why__point'
  );

  if (!revealElements.length) return;

  // Add reveal class to all targets
  revealElements.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animate once only
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}


/* ─────────────────────────────────────────
   3. STICKY NAV — add shadow on scroll
───────────────────────────────────────── */

/**
 * Adds a subtle shadow to the nav when the
 * user scrolls past the top of the page.
 */
function initStickyNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
    } else {
      nav.style.boxShadow = 'none';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ─────────────────────────────────────────
   INIT — run all modules on DOM ready
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initWaitlistForms();
  initScrollReveal();
  initStickyNav();
});
