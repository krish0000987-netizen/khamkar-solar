/**
 * KHAMKAR SOLAR — SOLAR KNOWLEDGE & FAQ ACCORDION
 * Interactive search filtering and smooth accordion collapse.
 */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initFaqSearch();
});

function initFaqAccordion() {
  const headers = document.querySelectorAll('.faq-accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close other accordions in the same block if desired, or allow multi-open
      const siblingItems = item.parentElement.querySelectorAll('.faq-accordion-item');
      siblingItems.forEach(sibling => {
        if (sibling !== item) sibling.classList.remove('active');
      });

      item.classList.toggle('active', !isActive);
    });
  });
}

function initFaqSearch() {
  const searchInput = document.querySelector('#faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  const catBlocks = document.querySelectorAll('.faq-category-block');

  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    faqItems.forEach(item => {
      const question = item.querySelector('h4')?.textContent.toLowerCase() || '';
      const answer = item.querySelector('.faq-accordion-body')?.textContent.toLowerCase() || '';

      if (question.includes(query) || answer.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });

    // Hide empty category blocks if all items inside are hidden
    catBlocks.forEach(block => {
      const visibleChildren = block.querySelectorAll('.faq-accordion-item:not([style*="display: none"])');
      block.style.display = visibleChildren.length > 0 ? 'block' : 'none';
    });
  });
}
