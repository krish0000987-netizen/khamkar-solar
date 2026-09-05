/**
 * KHAMKAR SOLAR — MAIN APPLICATION SCRIPT
 * Handles: Header scroll, mobile drawer, hero 3s slideshow, multi-step quote modal,
 * lead management, and global interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  initHeroSlider();
  initQuoteModal();
  initScrollAnimations();
  initAdminDrawer();
});

/* ==========================================================================
   1. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  const mobileLinks = drawer.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   3. HERO SLIDESHOW (3-SECOND AUTO TRANSITION & KEN BURNS)
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator-item');
  const slideNum = document.querySelector('.slide-number-indicator');

  if (slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideInterval = 3000; // 3 seconds per specification
  let timer = null;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });

    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
      const prog = ind.querySelector('.indicator-progress');
      if (prog) {
        if (i === index) {
          prog.style.width = '100%';
          prog.style.transition = `width ${slideInterval}ms linear`;
        } else {
          prog.style.width = '0%';
          prog.style.transition = 'none';
        }
      }
    });

    if (slideNum) {
      slideNum.textContent = `0${index + 1} / 0${totalSlides}`;
    }

    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    showSlide(next);
  }

  function startTimer() {
    stopTimer();
    showSlide(currentSlide);
    timer = setInterval(nextSlide, slideInterval);
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
  }

  indicators.forEach((ind, idx) => {
    ind.addEventListener('click', () => {
      stopTimer();
      showSlide(idx);
      startTimer();
    });
  });

  // Start slideshow
  startTimer();
}

/* ==========================================================================
   4. MULTI-STEP QUOTE MODAL & LEAD ENGINE
   ========================================================================== */
function initQuoteModal() {
  const modal = document.querySelector('#quoteModal');
  const openButtons = document.querySelectorAll('.btn-open-quote-modal, [data-open-quote]');
  const closeBtn = document.querySelector('.quote-modal-close');
  const backdrop = modal;

  if (!modal) return;

  // Open modal
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const presetRequirement = btn.getAttribute('data-requirement') || '';
      if (presetRequirement) {
        const reqSelect = modal.querySelector('#quoteRequirement');
        if (reqSelect) reqSelect.value = presetRequirement;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      resetQuoteForm();
    });
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Multi-step logic
  let currentStep = 1;
  const totalSteps = 5;

  const stepPanes = modal.querySelectorAll('.quote-step-pane');
  const stepNodes = modal.querySelectorAll('.step-node');
  const btnNext = modal.querySelector('#quoteBtnNext');
  const btnPrev = modal.querySelector('#quoteBtnPrev');
  const btnSubmit = modal.querySelector('#quoteBtnSubmit');
  const form = modal.querySelector('#multiStepQuoteForm');

  // Option selection cards
  const radioOptions = modal.querySelectorAll('.radio-box-option');
  radioOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const parent = opt.parentElement;
      parent.querySelectorAll('.radio-box-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  function updateStepView() {
    stepPanes.forEach((pane, idx) => {
      pane.classList.toggle('active', idx + 1 === currentStep);
    });

    stepNodes.forEach((node, idx) => {
      node.classList.toggle('active', idx + 1 === currentStep);
      node.classList.toggle('completed', idx + 1 < currentStep);
    });

    if (btnPrev) {
      btnPrev.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    }

    if (btnNext && btnSubmit) {
      if (currentStep === totalSteps) {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'inline-flex';
      } else {
        btnNext.style.display = 'inline-flex';
        btnSubmit.style.display = 'none';
      }
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          currentStep++;
          updateStepView();
        }
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepView();
      }
    });
  }

  function validateStep(step) {
    if (step === 4) {
      const name = modal.querySelector('#quoteName')?.value.trim();
      const phone = modal.querySelector('#quotePhone')?.value.trim();
      if (!name || !phone || phone.length < 10) {
        alert('Please enter a valid Name and 10-digit Phone number.');
        return false;
      }
    }
    return true;
  }

  function resetQuoteForm() {
    currentStep = 1;
    updateStepView();
    const successPane = modal.querySelector('.quote-success-state');
    const formFields = modal.querySelector('.quote-form-wizard');
    if (successPane) successPane.style.display = 'none';
    if (formFields) formFields.style.display = 'block';
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = {
        propertyType: modal.querySelector('input[name="propertyType"]:checked')?.value || 'Residential',
        billRange: modal.querySelector('#quoteBillRange')?.value || '₹3,000 - ₹6,000',
        city: modal.querySelector('#quoteCity')?.value || 'Not specified',
        name: modal.querySelector('#quoteName')?.value || 'Customer',
        phone: modal.querySelector('#quotePhone')?.value || '',
        email: modal.querySelector('#quoteEmail')?.value || '',
        requirement: modal.querySelector('#quoteRequirement')?.value || 'Solar EPC Rooftop',
        message: modal.querySelector('#quoteMessage')?.value || '',
        date: new Date().toLocaleString()
      };

      // Store in localStorage
      saveLead(formData);

      // Show Success Pane
      const successPane = modal.querySelector('.quote-success-state');
      const formFields = modal.querySelector('.quote-form-wizard');
      if (formFields) formFields.style.display = 'none';
      if (successPane) {
        successPane.style.display = 'block';
        const clientNameSpan = successPane.querySelector('.success-client-name');
        if (clientNameSpan) clientNameSpan.textContent = formData.name;

        // WhatsApp direct link button
        const waLink = successPane.querySelector('.btn-wa-submit');
        if (waLink) {
          const waMessage = `Hello Khamkar Solar team, I have requested a quote on your website.%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Property:* ${encodeURIComponent(formData.propertyType)}%0A*Bill:* ${encodeURIComponent(formData.billRange)}%0A*City:* ${encodeURIComponent(formData.city)}%0A*Requirement:* ${encodeURIComponent(formData.requirement)}`;
          waLink.href = `https://wa.me/919898783838?text=${waMessage}`;
        }
      }
    });
  }
}

/* Lead storage helpers */
function saveLead(leadData) {
  try {
    const leads = JSON.parse(localStorage.getItem('khamkar_solar_leads') || '[]');
    leads.unshift(leadData);
    localStorage.setItem('khamkar_solar_leads', JSON.stringify(leads));
  } catch (err) {
    console.warn('Could not save lead to localStorage', err);
  }
}

/* ==========================================================================
   5. CMS / ADMIN LEADS DRAWER
   ========================================================================== */
function initAdminDrawer() {
  const adminBtn = document.querySelector('#openAdminLeads');
  const drawer = document.querySelector('#adminDrawer');
  const closeBtn = document.querySelector('#closeAdminDrawer');
  const leadsContainer = document.querySelector('#adminLeadsList');
  const exportBtn = document.querySelector('#exportLeadsJson');
  const clearBtn = document.querySelector('#clearLeadsBtn');

  if (!drawer || !adminBtn) return;

  const renderLeads = () => {
    if (!leadsContainer) return;
    const leads = JSON.parse(localStorage.getItem('khamkar_solar_leads') || '[]');
    
    if (leads.length === 0) {
      leadsContainer.innerHTML = `
        <div style="text-align: center; color: #64748B; padding: 40px 20px;">
          <p>No customer enquiries recorded yet.</p>
          <p style="font-size: 0.8rem; margin-top: 6px;">Submit a quote enquiry on the website to see it appear here in real-time.</p>
        </div>
      `;
      return;
    }

    leadsContainer.innerHTML = leads.map((lead, idx) => `
      <div class="lead-item-card">
        <div class="lead-header-row">
          <span class="lead-name">${idx + 1}. ${lead.name} (${lead.phone})</span>
          <span class="lead-time">${lead.date || ''}</span>
        </div>
        <div class="lead-details-text">
          <strong>Type:</strong> ${lead.propertyType} | <strong>Bill:</strong> ${lead.billRange} | <strong>City:</strong> ${lead.city}<br/>
          <strong>Requirement:</strong> ${lead.requirement}<br/>
          ${lead.message ? `<em>Note: ${lead.message}</em><br/>` : ''}
          <a href="https://wa.me/91${lead.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color: #25D366; font-weight: 600; font-size: 0.8rem; margin-top: 6px; display: inline-block;">
            💬 Open WhatsApp Chat
          </a>
        </div>
      </div>
    `).join('');
  };

  adminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderLeads();
    drawer.classList.add('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('active'));
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const leads = localStorage.getItem('khamkar_solar_leads') || '[]';
      const blob = new Blob([leads], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `khamkar-solar-leads-${Date.now()}.json`;
      a.click();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all recorded enquiry leads?')) {
        localStorage.removeItem('khamkar_solar_leads');
        renderLeads();
      }
    });
  }
}

/* ==========================================================================
   6. SCROLL REVEAL & NUMBER COUNTERS
   ========================================================================== */
function initScrollAnimations() {
  const animatedItems = document.querySelectorAll('.count-up');
  if (animatedItems.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-target') || '0');
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        
        animateNumber(el, targetVal, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  animatedItems.forEach(item => observer.observe(item));
}

function animateNumber(element, target, prefix, suffix) {
  let start = 0;
  const duration = 1200;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    const formatted = Math.floor(start).toLocaleString();
    element.textContent = `${prefix}${formatted}${suffix}`;
  }, stepTime);
}
