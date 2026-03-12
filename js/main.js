'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // Sticky Navigation
  // ============================================
  const header = document.getElementById('site-header');
  const SCROLL_THRESHOLD = 50;

  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });

      closeMobileMenu();
    });
  });


  // ============================================
  // Mobile Menu
  // ============================================
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  function openMobileMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });


  // ============================================
  // Scroll Reveal (IntersectionObserver)
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }


  // ============================================
  // Form Validation
  // ============================================
  const form = document.getElementById('quote-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('.form-error').forEach(el => el.classList.remove('form-error'));

    let isValid = true;
    const checkedRadioGroups = new Set();

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (field.type === 'radio') {
        if (checkedRadioGroups.has(field.name)) return;
        checkedRadioGroups.add(field.name);

        const radioGroup = form.querySelectorAll(`[name="${field.name}"]`);
        const isChecked = [...radioGroup].some(r => r.checked);
        if (!isChecked) {
          const fieldset = field.closest('fieldset');
          if (fieldset) {
            fieldset.classList.add('form-error');
            showError(fieldset, 'Please select an option');
          }
          isValid = false;
        }
      } else if (field.tagName === 'SELECT') {
        if (!field.value) {
          field.classList.add('form-error');
          showError(field.parentNode, 'Please select an option');
          isValid = false;
        }
      } else if (!field.value.trim()) {
        field.classList.add('form-error');
        showError(field.parentNode, 'This field is required');
        isValid = false;
      }
    });

    // Email format validation
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
      emailField.classList.add('form-error');
      showError(emailField.parentNode, 'Please enter a valid email address');
      isValid = false;
    }

    if (isValid) {
      form.innerHTML = `
        <div class="form-success">
          <h3>Thank You!</h3>
          <p>Your project details have been received. We'll review them and get back to you within 24 hours.</p>
        </div>
      `;
      form.closest('section').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Scroll to first error
      const firstError = form.querySelector('.form-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  function showError(parentEl, message) {
    // Avoid duplicate errors
    if (parentEl.querySelector('.error-message')) return;
    const error = document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;
    parentEl.appendChild(error);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  // ============================================
  // File Upload Label
  // ============================================
  const fileInput = document.getElementById('plans-upload');
  const fileLabel = document.querySelector('.file-upload-label');

  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      const fileName = fileLabel.querySelector('.file-name');
      if (fileInput.files.length > 0) {
        fileName.textContent = fileInput.files[0].name;
        fileLabel.classList.add('has-file');
      } else {
        fileName.textContent = 'Drag files here or click to browse';
        fileLabel.classList.remove('has-file');
      }
    });
  }

});
