/**
 * KHAMKAR SOLAR — PRODUCTS & TECHNOLOGY MODULE
 * Handles component specs enquiry triggers and datasheet modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductEnquiries();
});

function initProductEnquiries() {
  const productButtons = document.querySelectorAll('.btn-product-enquiry');
  const quoteModal = document.querySelector('#quoteModal');

  productButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product-name') || 'Solar Component';
      
      if (quoteModal) {
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const reqSelect = quoteModal.querySelector('#quoteRequirement');
        const msgField = quoteModal.querySelector('#quoteMessage');
        
        if (reqSelect) reqSelect.value = 'Solar Panels';
        if (msgField) msgField.value = `Enquiry regarding specifications and availability for: ${productName}`;
      }
    });
  });
}
