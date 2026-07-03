const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function formatRand(value) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function numberValue(id) {
  return Number(document.getElementById(id)?.value) || 0;
}

function updateSavingsCalculator() {
  const fuelSpend = numberValue('fuelSpend');
  const maintenanceSpend = numberValue('maintenanceSpend');
  const tyreSpend = numberValue('tyreSpend');
  const fineSpend = numberValue('fineSpend');
  const fuelSaving = numberValue('fuelSaving') / 100;
  const maintenanceSaving = numberValue('maintenanceSaving') / 100;

  const fuelSaved = fuelSpend * fuelSaving;
  const maintenanceSaved = maintenanceSpend * maintenanceSaving;
  const tyreSaved = tyreSpend * 0.08;
  const fineSaved = fineSpend * 0.35;
  const monthlySaving = fuelSaved + maintenanceSaved + tyreSaved + fineSaved;
  const reviewedSpend = fuelSpend + maintenanceSpend + tyreSpend + fineSpend;

  const monthlySavingEl = document.getElementById('monthlySaving');
  const annualSavingEl = document.getElementById('annualSaving');
  const reviewedSpendEl = document.getElementById('reviewedSpend');

  if (monthlySavingEl) monthlySavingEl.textContent = formatRand(monthlySaving);
  if (annualSavingEl) annualSavingEl.textContent = formatRand(monthlySaving * 12);
  if (reviewedSpendEl) reviewedSpendEl.textContent = formatRand(reviewedSpend);
}

function updateKpiDashboard() {
  const fleetSize = Math.max(numberValue('fleetSize'), 1);
  const availableVehicles = numberValue('availableVehicles');
  const monthlyKm = numberValue('monthlyKm');
  const fuelLitres = Math.max(numberValue('fuelLitres'), 1);
  const openFines = numberValue('openFines');
  const expiryItems = numberValue('expiryItems');

  const availability = Math.min((availableVehicles / fleetSize) * 100, 100);
  const fuelEfficiency = monthlyKm / fuelLitres;

  const availabilityEl = document.getElementById('availabilityKpi');
  const fuelEfficiencyEl = document.getElementById('fuelEfficiencyKpi');
  const fineEl = document.getElementById('fineKpi');
  const complianceEl = document.getElementById('complianceKpi');
  const availabilityStatusEl = document.getElementById('availabilityStatus');
  const fuelStatusEl = document.getElementById('fuelStatus');
  const summaryEl = document.getElementById('dashboardSummary');

  if (availabilityEl) availabilityEl.textContent = `${availability.toFixed(1)}%`;
  if (fuelEfficiencyEl) fuelEfficiencyEl.textContent = `${fuelEfficiency.toFixed(2)} km/L`;
  if (fineEl) fineEl.textContent = openFines.toString();
  if (complianceEl) complianceEl.textContent = expiryItems.toString();

  const availabilityStatus = availability >= 90 ? 'healthy availability' : availability >= 75 ? 'needs monitoring' : 'high downtime risk';
  const fuelStatus = fuelEfficiency >= 7 ? 'strong efficiency' : fuelEfficiency >= 4 ? 'monitor consumption' : 'review urgently';

  if (availabilityStatusEl) availabilityStatusEl.textContent = availabilityStatus;
  if (fuelStatusEl) fuelStatusEl.textContent = fuelStatus;

  if (summaryEl) {
    summaryEl.textContent = `Snapshot: ${availability.toFixed(1)}% of the fleet is available, fuel efficiency is ${fuelEfficiency.toFixed(2)} km/L, with ${openFines} open fines and ${expiryItems} compliance items needing attention.`;
  }
}

function updateHealthCheck() {
  const answers = [...document.querySelectorAll('.health-answer')];
  if (!answers.length) return;

  const score = answers.reduce((total, answer) => {
    return total + (Number(answer.value) || 0) * (Number(answer.dataset.weight) || 0);
  }, 0);

  const roundedScore = Math.round(score);
  const healthScoreEl = document.getElementById('healthScore');
  const healthStatusEl = document.getElementById('healthStatus');
  const healthAdviceEl = document.getElementById('healthAdvice');
  const scoreCircle = document.querySelector('.score-circle');

  if (healthScoreEl) healthScoreEl.textContent = `${roundedScore}%`;
  if (scoreCircle) scoreCircle.style.background = `conic-gradient(var(--gold) ${roundedScore * 3.6}deg, rgba(255,255,255,.14) 0deg)`;

  let status = 'High-risk fleet setup';
  let advice = 'Your fleet may need urgent structure around compliance, fuel, fines, reporting and driver accountability.';

  if (roundedScore >= 80) {
    status = 'Strong fleet foundation';
    advice = 'Your fleet has good control points. A Fleetpoint Africa review can still identify cost savings, reporting improvements and stronger performance measures.';
  } else if (roundedScore >= 50) {
    status = 'Moderate control, improvement needed';
    advice = 'Your fleet has some systems in place, but there are likely gaps in compliance, cost review, driver control or reporting that should be tightened.';
  }

  if (healthStatusEl) healthStatusEl.textContent = status;
  if (healthAdviceEl) healthAdviceEl.textContent = advice;
}

document.querySelectorAll('#tools input').forEach(input => {
  input.addEventListener('input', () => {
    updateSavingsCalculator();
    updateKpiDashboard();
  });
});

document.querySelectorAll('.health-answer').forEach(answer => {
  answer.addEventListener('change', updateHealthCheck);
});

updateSavingsCalculator();
updateKpiDashboard();
updateHealthCheck();
