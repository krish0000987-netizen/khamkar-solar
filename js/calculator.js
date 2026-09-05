/**
 * KHAMKAR SOLAR — INTERACTIVE SOLAR SAVINGS CALCULATOR
 * Real-time engineering estimate engine for Residential, Commercial & Industrial properties.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSolarCalculator();
});

function initSolarCalculator() {
  const calcRoot = document.querySelector('#solarCalculator');
  if (!calcRoot) return;

  const billSlider = calcRoot.querySelector('#calcBillSlider');
  const billValueDisplay = calcRoot.querySelector('#calcBillValDisplay');
  const propTabs = calcRoot.querySelectorAll('.prop-tab-btn');
  
  // Output displays
  const outSystemSize = calcRoot.querySelector('#outSystemSize');
  const outMonthlySavings = calcRoot.querySelector('#outMonthlySavings');
  const outYearlySavings = calcRoot.querySelector('#outYearlySavings');
  const outAreaRequired = calcRoot.querySelector('#outAreaRequired');
  const outUnitsGenerated = calcRoot.querySelector('#outUnitsGenerated');
  const outCo2Offset = calcRoot.querySelector('#outCo2Offset');

  let currentProperty = 'residential'; // residential | commercial | industrial

  const propertyTariffs = {
    residential: 7.5,
    commercial: 9.8,
    industrial: 8.2
  };

  function calculateSolar() {
    const monthlyBill = parseFloat(billSlider.value) || 4500;
    const tariff = propertyTariffs[currentProperty];

    // Estimated monthly units consumed
    const monthlyUnits = monthlyBill / tariff;

    // Sizing: 1 kW generates approx 120-130 units/month in India
    let recommendedKw = (monthlyUnits / 125);
    recommendedKw = Math.max(1, Math.round(recommendedKw * 10) / 10);

    // Generation
    const genMonthlyUnits = Math.round(recommendedKw * 125);
    
    // Monthly Savings (approx 85-90% reduction)
    const monthlySavings = Math.round(Math.min(monthlyBill * 0.90, genMonthlyUnits * tariff));
    const yearlySavings = monthlySavings * 12;

    // Roof Area (approx 90-100 sq ft per kW)
    const roofArea = Math.round(recommendedKw * 95);

    // CO2 Offset (0.82 kg CO2 per kWh)
    const co2Offset = Math.round((genMonthlyUnits * 12 * 0.82) / 1000 * 10) / 10;

    // Update UI
    if (billValueDisplay) {
      billValueDisplay.textContent = `₹${monthlyBill.toLocaleString('en-IN')}`;
    }

    if (outSystemSize) outSystemSize.textContent = `${recommendedKw} kW`;
    if (outMonthlySavings) outMonthlySavings.textContent = `₹${monthlySavings.toLocaleString('en-IN')}`;
    if (outYearlySavings) outYearlySavings.textContent = `₹${yearlySavings.toLocaleString('en-IN')}`;
    if (outAreaRequired) outAreaRequired.textContent = `~${roofArea.toLocaleString()} sq.ft`;
    if (outUnitsGenerated) outUnitsGenerated.textContent = `~${genMonthlyUnits.toLocaleString()} kWh`;
    if (outCo2Offset) outCo2Offset.textContent = `${co2Offset} Tons/yr`;
  }

  // Slider change
  if (billSlider) {
    billSlider.addEventListener('input', calculateSolar);
  }

  // Property tabs
  propTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      propTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentProperty = tab.getAttribute('data-prop-type') || 'residential';
      calculateSolar();
    });
  });

  // Initial calculation
  calculateSolar();
}
