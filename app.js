/**
 * Platinum Fitness Club - Core Application Logic
 * Mobile-First UX, Fluid Micro-interactions & Modal Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    const toggleMenu = (forceState) => {
      const isOpen = forceState !== undefined ? forceState : !mobileDrawer.classList.contains('active');
      mobileDrawer.classList.toggle('active', isOpen);
      mobileMenuBtn.classList.toggle('menu-open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileMenuBtn.addEventListener('click', () => toggleMenu());

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('active') && 
          !mobileDrawer.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  // 2. Interactive Memberships / Cards Filtering
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const tariffCards = document.querySelectorAll('.tariff-card');

  if (filterTabs.length && tariffCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;

        filterTabs.forEach(t => {
          t.classList.remove('active', 'bg-slate-900', 'text-white', 'shadow-sm');
          t.classList.add('text-slate-700');
        });
        tab.classList.add('active', 'bg-slate-900', 'text-white', 'shadow-sm');
        tab.classList.remove('text-slate-700');

        // Smoothly center active tab in mobile horizontal scroll
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        tariffCards.forEach(card => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden-card');
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.classList.add('hidden-card');
          }
        });
      });
    });
  }

  // 3. Booking Modal System
  const bookingModal = document.getElementById('booking-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalPlanInput = document.getElementById('modal-plan-select');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const bookingForm = document.getElementById('booking-form');
  const formSuccess = document.getElementById('form-success');

  const openModal = (planName = '') => {
    if (!bookingModal) return;
    if (modalPlanInput && planName) {
      modalPlanInput.value = planName;
    }
    bookingModal.classList.remove('hidden');
    bookingModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
      const firstInput = document.getElementById('guest-name');
      if (firstInput) firstInput.focus();
    }, 100);
  };

  const closeModal = () => {
    if (!bookingModal) return;
    bookingModal.classList.add('hidden');
    bookingModal.classList.remove('flex');
    document.body.style.overflow = '';
    if (bookingForm) {
      bookingForm.reset();
      bookingForm.classList.remove('hidden');
    }
    if (formSuccess) {
      formSuccess.classList.add('hidden');
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'Гостевой визит (Тест-драйв)';
      openModal(plan);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && !bookingModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // 4. Form Submission Simulation
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2">⟳</span>
        Отправка заявки...
      `;

      setTimeout(() => {
        bookingForm.classList.add('hidden');
        if (formSuccess) {
          formSuccess.classList.remove('hidden');
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 700);
    });
  }

  // 5. Contact Section Lead Form
  const leadSectionForm = document.getElementById('lead-section-form');
  const leadSuccessMsg = document.getElementById('lead-success-msg');
  if (leadSectionForm) {
    leadSectionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = leadSectionForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> Оформляем...`;

      setTimeout(() => {
        leadSectionForm.classList.add('hidden');
        if (leadSuccessMsg) leadSuccessMsg.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }, 700);
    });
  }

  // 6. Interactive FAQ Accordion
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.faq-icon');
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      // Close all other FAQs
      faqToggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          otherToggle.setAttribute('aria-expanded', 'false');
          if (otherToggle.nextElementSibling) {
            otherToggle.nextElementSibling.classList.add('hidden');
          }
          const otherIcon = otherToggle.querySelector('.faq-icon');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle current
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      if (content) {
        content.classList.toggle('hidden', isExpanded);
      }
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(45deg)';
      }
    });
  });

  // 7. Scroll Reveals via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 8. Mobile Bottom Bar hide when near footer to avoid overlap
  const mobileBottomBar = document.getElementById('mobile-bottom-bar');
  const footer = document.querySelector('footer');
  if (mobileBottomBar && footer && 'IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mobileBottomBar.style.transform = 'translateY(100px)';
          mobileBottomBar.style.opacity = '0';
        } else {
          mobileBottomBar.style.transform = 'translateY(0)';
          mobileBottomBar.style.opacity = '1';
        }
      });
    }, { threshold: 0.1 });
    footerObserver.observe(footer);
  }
});
