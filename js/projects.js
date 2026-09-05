/**
 * KHAMKAR SOLAR — PROJECTS PORTFOLIO & CASE STUDY MODAL
 * Filterable projects grid and detailed case study modal viewer.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectsFilter();
  initCaseStudyModal();
});

const projectsData = [
  {
    id: 'proj-1',
    title: 'Modern Villa Rooftop Solar EPC',
    category: 'residential',
    categoryLabel: 'Residential Rooftop',
    location: 'Residential Suburb',
    capacity: '8.5 kW On-Grid',
    modules: 'Waaree Mono PERC Bi-facial',
    inverter: 'Vsole Smart 8kW String Inverter',
    image: 'assets/images/hero-residential-home.jpg',
    description: 'Turnkey residential rooftop solar EPC project engineered for zero day-time grid dependency. Features high-elevation elevated GI structure allowing complete rooftop terrace utilization.',
    highlights: ['3D Shadow Analysis', 'Elevated Walkable GI Structure', 'DISCOM Net-Metering Handover']
  },
  {
    id: 'proj-2',
    title: 'Industrial Warehouse Solar EPC',
    category: 'industrial',
    categoryLabel: 'Industrial Rooftop',
    location: 'Industrial Zone',
    capacity: '120 kW Industrial Grid-Tie',
    modules: 'Waaree TOPCon High Efficiency Modules',
    inverter: 'Deye 100kW Commercial Inverter',
    image: 'assets/images/hero-industrial-solar.jpg',
    description: 'Comprehensive industrial solar project mounted on pre-engineered metal roofing sheet. Engineered with non-penetrating clamping systems, IP67 safety isolators, and real-time remote cloud monitoring.',
    highlights: ['Non-Penetrating Klip-Lok Clamps', 'Multi-MPPT Optimization', 'Accelerated Depreciation ROI']
  },
  {
    id: 'proj-3',
    title: 'Commercial Office Complex Solar',
    category: 'commercial',
    categoryLabel: 'Commercial Rooftop',
    location: 'Corporate Park',
    capacity: '45 kW Commercial Array',
    modules: 'Waaree High Power Mono PV',
    inverter: 'Vsole Dual-MPPT String Inverter',
    image: 'assets/images/hero-solar-sunset.jpg',
    description: 'Commercial rooftop system powering office HVAC and workstation loads. Significant electricity bill reduction with automated fail-safe protection and Class-II surge arrestors.',
    highlights: ['Optimized String Sizing', 'Type II AC/DC SPDs', 'Continuous Generation Telemetry']
  },
  {
    id: 'proj-4',
    title: 'Executive Bungalow Solar Project',
    category: 'residential',
    categoryLabel: 'Residential Rooftop',
    location: 'Greenfield Estate',
    capacity: '5.2 kW Rooftop PV',
    modules: 'Waaree High Performance Modules',
    inverter: 'Deye Grid-Tied Inverter',
    image: 'assets/images/hero-solar-closeup.jpg',
    description: 'Aesthetic rooftop solar fitting designed with custom flush mounts blending seamlessly with modern home architecture, providing 600+ units of clean electricity monthly.',
    highlights: ['Flush Aluminum Railing', 'Smart Mobile App Monitoring', 'Rapid Net-Metering Sync']
  },
  {
    id: 'proj-5',
    title: 'Manufacturing Facility Solar EPC',
    category: 'epc',
    categoryLabel: 'Turnkey EPC',
    location: 'Manufacturing Corridor',
    capacity: '80 kW Industrial EPC',
    modules: 'Waaree Bifacial PV Modules',
    inverter: 'Vsole Multi-String Inverter',
    image: 'assets/images/solar-installation-work.jpg',
    description: 'Complete engineering, procurement, structural fabrication, HT/LT integration, and DISCOM commissioning for a high-load manufacturing facility.',
    highlights: ['End-to-End Civil & Electrical EPC', 'Comprehensive Quality Audit', 'Earthing & Lightning Protection Grid']
  },
  {
    id: 'proj-6',
    title: 'Commercial Institutional Rooftop',
    category: 'commercial',
    categoryLabel: 'Commercial Rooftop',
    location: 'Institutional Campus',
    capacity: '30 kW Rooftop Array',
    modules: 'Waaree Solar Modules',
    inverter: 'Deye Smart Inverter',
    image: 'assets/images/solar-inverter-system.jpg',
    description: 'Solar power system installed with heavy-duty corrosion-resistant mounting structure and dedicated ACDB/DCDB protection distribution boxes.',
    highlights: ['Dual Layer Galvanization', 'Dedicated Earthing Pit Integration', 'Zero Export Device Compatibility']
  }
];

function initProjectsFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');

  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal || (filterVal === 'rooftop' && cardCat.includes('residential') || cardCat.includes('commercial') || cardCat.includes('industrial'))) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initCaseStudyModal() {
  const modal = document.querySelector('#caseStudyModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.case-study-close');
  const cards = document.querySelectorAll('.project-card');

  const openModal = (proj) => {
    modal.querySelector('#csTitle').textContent = proj.title;
    modal.querySelector('#csCategory').textContent = proj.categoryLabel;
    modal.querySelector('#csLocation').textContent = proj.location;
    modal.querySelector('#csCapacity').textContent = proj.capacity;
    modal.querySelector('#csModules').textContent = proj.modules;
    modal.querySelector('#csInverter').textContent = proj.inverter;
    modal.querySelector('#csImage').src = proj.image;
    modal.querySelector('#csDescription').textContent = proj.description;

    const highlightsList = modal.querySelector('#csHighlights');
    if (highlightsList) {
      highlightsList.innerHTML = proj.highlights.map(h => `<li>✓ ${h}</li>`).join('');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const projId = card.getAttribute('data-project-id');
      const proj = projectsData.find(p => p.id === projId);
      if (proj) openModal(proj);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
