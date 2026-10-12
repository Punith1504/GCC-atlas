// GCC Atlas - Application Controller
// Author: Andluru Sai Punith Reddy
// Includes: Reactive filtering, interactive sliders, visual stacked bar graphs,
// toast notifications, live brief inspector, and automated 90s demo player.

(function (window, document) {
  'use strict';

  // State
  const state = {
    currentView: 'explore',
    searchQuery: '',
    filterCity: 'all',
    filterSector: 'all',
    activeDrawerCompanyId: null,
    lastFocusedElement: null,
    scenario: {
      employees: 100,
      sqFtPerEmployee: 100,
      bengaluru: { salaryLakh: 24, monthlyRent: 100 },
      hyderabad: { salaryLakh: 22, monthlyRent: 80 },
      pune: { salaryLakh: 21, monthlyRent: 85 }
    },
    costResults: {},
    isAutoDemoRunning: false
  };

  // DOM Elements Cache
  const elements = {
    // Nav
    navButtons: document.querySelectorAll('.nav-item-btn'),
    viewPanels: document.querySelectorAll('.app-view-panel'),
    mobileNavToggle: document.getElementById('mobile-nav-toggle'),
    appSidebar: document.getElementById('app-sidebar'),
    sidebarExploreCount: document.getElementById('sidebar-explore-count'),
    sidebarShortlistCount: document.getElementById('sidebar-shortlist-count'),

    // Explore
    exploreSearch: document.getElementById('explore-search'),
    exploreSearchClear: document.getElementById('explore-search-clear'),
    filterCity: document.getElementById('filter-city'),
    filterSector: document.getElementById('filter-sector'),
    exploreCountStatus: document.getElementById('explore-count-status'),
    exploreCompaniesContainer: document.getElementById('explore-companies-container'),
    exploreEmptyState: document.getElementById('explore-empty-state'),
    btnResetFilters: document.getElementById('btn-reset-filters'),

    // Calculator inputs & sliders
    inputEmployees: document.getElementById('input-employees'),
    rangeEmployees: document.getElementById('range-employees'),
    inputSqft: document.getElementById('input-sqft'),
    inputBlrSalary: document.getElementById('input-blr-salary'),
    rangeBlrSalary: document.getElementById('range-blr-salary'),
    inputBlrRent: document.getElementById('input-blr-rent'),
    rangeBlrRent: document.getElementById('range-blr-rent'),
    inputHydSalary: document.getElementById('input-hyd-salary'),
    rangeHydSalary: document.getElementById('range-hyd-salary'),
    inputHydRent: document.getElementById('input-hyd-rent'),
    rangeHydRent: document.getElementById('range-hyd-rent'),
    inputPunSalary: document.getElementById('input-pun-salary'),
    rangePunSalary: document.getElementById('range-pun-salary'),
    inputPunRent: document.getElementById('input-pun-rent'),
    rangePunRent: document.getElementById('range-pun-rent'),
    btnResetAssumptions: document.getElementById('btn-reset-assumptions'),
    presetChips: document.querySelectorAll('.preset-chip'),

    // Visual Bar Chart
    chartTotalBlr: document.getElementById('chart-total-blr'),
    barSalBlr: document.getElementById('bar-sal-blr'),
    barRentBlr: document.getElementById('bar-rent-blr'),
    chartTotalHyd: document.getElementById('chart-total-hyd'),
    barSalHyd: document.getElementById('bar-sal-hyd'),
    barRentHyd: document.getElementById('bar-rent-hyd'),
    deltaHyd: document.getElementById('delta-hyd'),
    chartTotalPun: document.getElementById('chart-total-pun'),
    barSalPun: document.getElementById('bar-sal-pun'),
    barRentPun: document.getElementById('bar-rent-pun'),
    deltaPun: document.getElementById('delta-pun'),

    // Calculator card outputs
    valTotalBlr: document.getElementById('val-total-blr'),
    valSalaryBlr: document.getElementById('val-salary-blr'),
    valRentBlr: document.getElementById('val-rent-blr'),
    valAreaBlr: document.getElementById('val-area-blr'),

    valTotalHyd: document.getElementById('val-total-hyd'),
    valSalaryHyd: document.getElementById('val-salary-hyd'),
    valRentHyd: document.getElementById('val-rent-hyd'),
    valAreaHyd: document.getElementById('val-area-hyd'),

    valTotalPun: document.getElementById('val-total-pun'),
    valSalaryPun: document.getElementById('val-salary-pun'),
    valRentPun: document.getElementById('val-rent-pun'),
    valAreaPun: document.getElementById('val-area-pun'),

    cardCostBlr: document.getElementById('card-cost-bengaluru'),
    cardCostHyd: document.getElementById('card-cost-hyderabad'),
    cardCostPun: document.getElementById('card-cost-pune'),

    // Shortlist
    shortlistStatusHeading: document.getElementById('shortlist-status-heading'),
    shortlistCompaniesContainer: document.getElementById('shortlist-companies-container'),
    shortlistEmptyState: document.getElementById('shortlist-empty-state'),
    btnClearShortlist: document.getElementById('btn-clear-shortlist'),
    btnGotoExplore: document.getElementById('btn-goto-explore'),
    btnExportMd: document.getElementById('btn-export-md'),
    btnExportTxt: document.getElementById('btn-export-txt'),
    btnPreviewBrief: document.getElementById('btn-preview-brief'),

    // Evidence Drawer
    drawerBackdrop: document.getElementById('evidence-drawer-backdrop'),
    btnCloseDrawer: document.getElementById('btn-close-drawer'),
    drawerSecondaryClose: document.getElementById('drawer-secondary-close'),
    drawerCityBadge: document.getElementById('drawer-city-badge'),
    drawerCompanyName: document.getElementById('drawer-company-name'),
    drawerParentLabel: document.getElementById('drawer-parent-label'),
    drawerStatusTitle: document.getElementById('drawer-status-title'),
    drawerStatusNote: document.getElementById('drawer-status-note'),
    drawerClaimSummary: document.getElementById('drawer-claim-summary'),
    drawerPropSector: document.getElementById('drawer-prop-sector'),
    drawerPropFunctions: document.getElementById('drawer-prop-functions'),
    drawerPropClassification: document.getElementById('drawer-prop-classification'),
    drawerPropEstablished: document.getElementById('drawer-prop-established'),
    drawerPropChecked: document.getElementById('drawer-prop-checked'),
    drawerSourcesContainer: document.getElementById('drawer-sources-container'),
    drawerGapsText: document.getElementById('drawer-gaps-text'),
    drawerBtnToggleShortlist: document.getElementById('drawer-btn-toggle-shortlist'),
    drawerShortlistActionText: document.getElementById('drawer-shortlist-action-text'),

    // Tour modal
    tourModalBackdrop: document.getElementById('tour-modal-backdrop'),
    btnOpenTour: document.getElementById('btn-open-tour'),
    btnCloseTour: document.getElementById('btn-close-tour'),
    btnStartGuidedTour: document.getElementById('btn-start-guided-tour'),
    btnAutoDemo: document.getElementById('btn-auto-demo'),

    // Toast Container
    toastContainer: document.getElementById('toast-container'),

    // Live Brief Preview Modal
    briefModalBackdrop: document.getElementById('brief-modal-backdrop'),
    briefModalContent: document.getElementById('brief-modal-content'),
    btnCloseBriefModal: document.getElementById('btn-close-brief-modal'),
    btnCopyBriefModal: document.getElementById('btn-copy-brief-modal')
  };

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Toast Notification System
  function showToast(message, icon = '✨') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Navigation Logic
  function switchView(targetViewId) {
    state.currentView = targetViewId;

    elements.navButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-view') === targetViewId;
      btn.classList.toggle('active', isTarget);
      if (isTarget) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    elements.viewPanels.forEach(panel => {
      const isPanel = panel.id === `view-${targetViewId}`;
      panel.style.display = isPanel ? 'block' : 'none';
    });

    if (elements.appSidebar.classList.contains('mobile-open')) {
      elements.appSidebar.classList.remove('mobile-open');
      elements.mobileNavToggle.setAttribute('aria-expanded', 'false');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (targetViewId === 'shortlist') {
      renderShortlistView();
    } else if (targetViewId === 'explore') {
      renderExploreCards();
    }
  }

  // Filter & Search Logic
  function getFilteredCompanies() {
    const query = state.searchQuery.trim().toLowerCase();
    const city = state.filterCity;
    const sector = state.filterSector;

    return window.GCC_DATA.companies.filter(c => {
      const matchesCity = city === 'all' || c.city.toLowerCase() === city.toLowerCase();
      const matchesSector = sector === 'all' || c.sector.toLowerCase() === sector.toLowerCase();

      if (!matchesCity || !matchesSector) return false;
      if (!query) return true;

      const searchableText = [
        c.name,
        c.parent,
        c.city,
        c.sector,
        c.functions,
        c.evidenceSummary,
        c.unresolvedGaps,
        c.establishedDisplay
      ].join(' ').toLowerCase();

      return searchableText.includes(query);
    });
  }

  // Render Explore View Cards
  function renderExploreCards() {
    const filtered = getFilteredCompanies();
    const totalCount = window.GCC_DATA.companies.length;
    const container = elements.exploreCompaniesContainer;

    elements.exploreCountStatus.textContent = `Showing ${filtered.length} of ${totalCount} records`;
    elements.sidebarExploreCount.textContent = totalCount;

    if (filtered.length === 0) {
      container.innerHTML = '';
      elements.exploreEmptyState.style.display = 'flex';
      return;
    }

    elements.exploreEmptyState.style.display = 'none';

    container.innerHTML = filtered.map(c => {
      const isSaved = window.GCC_STORAGE.isSaved(c.id);
      const isAnalyst = c.functionsClassification === 'Analyst classification';
      const sourceDate = c.sources[0]?.publicationDate || 'Undated';

      return `
        <article class="company-card" data-id="${c.id}" aria-labelledby="comp-title-${c.id}">
          <div>
            <div class="company-card-header">
              <div class="company-title-wrap">
                <h2 id="comp-title-${c.id}" class="company-name">${escapeHtml(c.name)}</h2>
                <span class="company-parent">Global Parent: ${escapeHtml(c.parent)}</span>
              </div>
              <span class="badge badge-city">${escapeHtml(c.city)}</span>
            </div>

            <div class="company-badges-row">
              <span class="badge badge-sector">${escapeHtml(c.sector)}</span>
              ${isAnalyst ? '<span class="badge badge-analyst">Analyst classification</span>' : ''}
              <span class="badge badge-evidence">Source Verified</span>
            </div>

            <div class="company-props-list">
              <div class="prop-row">
                <span class="prop-key">Verified Functions:</span>
                <span class="prop-val">${escapeHtml(c.functions)}</span>
              </div>
              <div class="prop-row">
                <span class="prop-key">Established Year:</span>
                <span class="prop-val">${escapeHtml(c.establishedDisplay)}</span>
              </div>
              <div class="prop-row">
                <span class="prop-key">Primary Source Date:</span>
                <span class="prop-val">${escapeHtml(sourceDate)}</span>
              </div>
            </div>

            <div class="company-claim-excerpt" title="Evidence claim from primary corporate source">
              ${escapeHtml(c.evidenceSummary)}
            </div>
          </div>

          <div class="company-card-actions">
            <button type="button" class="btn btn-secondary btn-sm btn-inspect-evidence" data-id="${c.id}" aria-label="Inspect evidence and sources for ${escapeHtml(c.name)}">
              <span>Inspect Evidence</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
            </button>
            <button type="button" class="btn btn-sm ${isSaved ? 'btn-saved' : 'btn-accent'} btn-toggle-shortlist" data-id="${c.id}" aria-label="${isSaved ? 'Remove from shortlist' : 'Save to shortlist'}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              <span>${isSaved ? 'Saved in Shortlist' : 'Save to Shortlist'}</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('.btn-inspect-evidence').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openEvidenceDrawer(id, btn);
      });
    });

    container.querySelectorAll('.btn-toggle-shortlist').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const isNowSaved = window.GCC_STORAGE.toggleSave(id);
        const comp = window.GCC_DATA.companies.find(item => item.id === id);
        if (isNowSaved) {
          showToast(`Added ${comp.name} to your shortlist!`, '🔖');
        } else {
          showToast(`Removed ${comp.name} from shortlist`, '🗑️');
        }
      });
    });
  }

  // Evidence Drawer Controller
  function openEvidenceDrawer(companyId, triggerElement) {
    const company = window.GCC_DATA.companies.find(c => c.id === companyId);
    if (!company) return;

    state.activeDrawerCompanyId = companyId;
    state.lastFocusedElement = triggerElement || document.activeElement;

    elements.drawerCompanyName.textContent = company.name;
    elements.drawerParentLabel.textContent = `Global Parent: ${company.parent}`;
    elements.drawerCityBadge.textContent = company.city;
    elements.drawerClaimSummary.textContent = company.evidenceSummary;
    elements.drawerStatusTitle.textContent = company.evidenceStatus;
    elements.drawerStatusNote.textContent = company.verificationNote || 'Primary source supports presence. Headcount and compensation require direct audit.';

    elements.drawerPropSector.textContent = company.sector;
    elements.drawerPropFunctions.textContent = company.functions;
    elements.drawerPropClassification.textContent = company.functionsClassification || 'Company reported';
    elements.drawerPropEstablished.textContent = company.establishedDisplay;
    elements.drawerPropChecked.textContent = company.researchCheckDate;
    elements.drawerGapsText.textContent = company.unresolvedGaps;

    elements.drawerSourcesContainer.innerHTML = company.sources.map(s => `
      <div class="source-item-card">
        <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="source-link" aria-label="Open source in new window: ${escapeHtml(s.title)}">
          ${escapeHtml(s.title)} ↗
        </a>
        <span class="source-date-tag">
          Publication Date: <strong>${escapeHtml(s.publicationDate)}</strong>
          ${s.isDated ? '' : ' <em>(Undated primary website)</em>'}
        </span>
      </div>
    `).join('');

    updateDrawerShortlistButton();

    elements.drawerBackdrop.classList.add('open');
    elements.drawerBackdrop.setAttribute('aria-hidden', 'false');
    elements.btnCloseDrawer.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeEvidenceDrawer() {
    elements.drawerBackdrop.classList.remove('open');
    elements.drawerBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.activeDrawerCompanyId = null;

    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
      state.lastFocusedElement.focus();
    }
  }

  function updateDrawerShortlistButton() {
    if (!state.activeDrawerCompanyId) return;
    const isSaved = window.GCC_STORAGE.isSaved(state.activeDrawerCompanyId);
    elements.drawerShortlistActionText.textContent = isSaved ? 'Remove from Shortlist' : 'Save to Shortlist';
    elements.drawerBtnToggleShortlist.className = isSaved ? 'btn btn-secondary btn-sm' : 'btn btn-accent btn-sm';
  }

  // Cost Scenario Calculator & Visual Chart Wiring
  function updateScenarioCalculations() {
    const employees = Number(elements.inputEmployees.value) || 0;
    const sqFtPerEmployee = Number(elements.inputSqft.value) || 0;

    const blrSalary = Number(elements.inputBlrSalary.value) || 0;
    const blrRent = Number(elements.inputBlrRent.value) || 0;

    const hydSalary = Number(elements.inputHydSalary.value) || 0;
    const hydRent = Number(elements.inputHydRent.value) || 0;

    const punSalary = Number(elements.inputPunSalary.value) || 0;
    const punRent = Number(elements.inputPunRent.value) || 0;

    state.scenario = {
      employees,
      sqFtPerEmployee,
      bengaluru: { salaryLakh: blrSalary, monthlyRent: blrRent },
      hyderabad: { salaryLakh: hydSalary, monthlyRent: hydRent },
      pune: { salaryLakh: punSalary, monthlyRent: punRent }
    };

    // Calculate costs
    const calcBlr = window.GCC_CALCULATOR.calculateCityCost(employees, sqFtPerEmployee, blrSalary, blrRent);
    const calcHyd = window.GCC_CALCULATOR.calculateCityCost(employees, sqFtPerEmployee, hydSalary, hydRent);
    const calcPun = window.GCC_CALCULATOR.calculateCityCost(employees, sqFtPerEmployee, punSalary, punRent);

    state.costResults = {
      bengaluru: { ...calcBlr, name: 'Bengaluru' },
      hyderabad: { ...calcHyd, name: 'Hyderabad' },
      pune: { ...calcPun, name: 'Pune' }
    };

    // Card Displays
    elements.valTotalBlr.textContent = window.GCC_CALCULATOR.formatCrore(calcBlr.totalCrore);
    elements.valSalaryBlr.textContent = window.GCC_CALCULATOR.formatCrore(calcBlr.salaryCrore);
    elements.valRentBlr.textContent = window.GCC_CALCULATOR.formatCrore(calcBlr.rentCrore);
    elements.valAreaBlr.textContent = `${window.GCC_CALCULATOR.formatNumber(calcBlr.totalAreaSqFt)} sq ft`;

    elements.valTotalHyd.textContent = window.GCC_CALCULATOR.formatCrore(calcHyd.totalCrore);
    elements.valSalaryHyd.textContent = window.GCC_CALCULATOR.formatCrore(calcHyd.salaryCrore);
    elements.valRentHyd.textContent = window.GCC_CALCULATOR.formatCrore(calcHyd.rentCrore);
    elements.valAreaHyd.textContent = `${window.GCC_CALCULATOR.formatNumber(calcHyd.totalAreaSqFt)} sq ft`;

    elements.valTotalPun.textContent = window.GCC_CALCULATOR.formatCrore(calcPun.totalCrore);
    elements.valSalaryPun.textContent = window.GCC_CALCULATOR.formatCrore(calcPun.salaryCrore);
    elements.valRentPun.textContent = window.GCC_CALCULATOR.formatCrore(calcPun.rentCrore);
    elements.valAreaPun.textContent = `${window.GCC_CALCULATOR.formatNumber(calcPun.totalAreaSqFt)} sq ft`;

    // Visual Stacked Bar Chart Displays
    if (elements.chartTotalBlr) {
      elements.chartTotalBlr.textContent = window.GCC_CALCULATOR.formatCrore(calcBlr.totalCrore);
      elements.chartTotalHyd.textContent = window.GCC_CALCULATOR.formatCrore(calcHyd.totalCrore);
      elements.chartTotalPun.textContent = window.GCC_CALCULATOR.formatCrore(calcPun.totalCrore);

      const blrSalPct = calcBlr.totalCrore > 0 ? (calcBlr.salaryCrore / calcBlr.totalCrore) * 100 : 95;
      const blrRentPct = 100 - blrSalPct;
      elements.barSalBlr.style.width = `${blrSalPct.toFixed(1)}%`;
      elements.barSalBlr.textContent = `${blrSalPct.toFixed(0)}% Sal`;
      elements.barRentBlr.style.width = `${blrRentPct.toFixed(1)}%`;
      elements.barRentBlr.textContent = `${blrRentPct.toFixed(0)}%`;

      const hydSalPct = calcHyd.totalCrore > 0 ? (calcHyd.salaryCrore / calcHyd.totalCrore) * 100 : 96;
      const hydRentPct = 100 - hydSalPct;
      elements.barSalHyd.style.width = `${hydSalPct.toFixed(1)}%`;
      elements.barSalHyd.textContent = `${hydSalPct.toFixed(0)}% Sal`;
      elements.barRentHyd.style.width = `${hydRentPct.toFixed(1)}%`;
      elements.barRentHyd.textContent = `${hydRentPct.toFixed(0)}%`;

      const punSalPct = calcPun.totalCrore > 0 ? (calcPun.salaryCrore / calcPun.totalCrore) * 100 : 95;
      const punRentPct = 100 - punSalPct;
      elements.barSalPun.style.width = `${punSalPct.toFixed(1)}%`;
      elements.barSalPun.textContent = `${punSalPct.toFixed(0)}% Sal`;
      elements.barRentPun.style.width = `${punRentPct.toFixed(1)}%`;
      elements.barRentPun.textContent = `${punRentPct.toFixed(0)}%`;

      // Delta badges vs Bengaluru
      if (calcBlr.totalCrore > 0) {
        const diffHyd = ((calcHyd.totalCrore - calcBlr.totalCrore) / calcBlr.totalCrore) * 100;
        elements.deltaHyd.textContent = `${diffHyd >= 0 ? '+' : ''}${diffHyd.toFixed(1)}% vs BLR`;
        elements.deltaHyd.className = diffHyd < 0 ? 'delta-badge delta-savings' : 'delta-badge delta-baseline';

        const diffPun = ((calcPun.totalCrore - calcBlr.totalCrore) / calcBlr.totalCrore) * 100;
        elements.deltaPun.textContent = `${diffPun >= 0 ? '+' : ''}${diffPun.toFixed(1)}% vs BLR`;
        elements.deltaPun.className = diffPun < 0 ? 'delta-badge delta-savings' : 'delta-badge delta-baseline';
      }
    }

    // Highlight lowest cost card
    const totals = [
      { key: 'bengaluru', el: elements.cardCostBlr, total: calcBlr.totalCrore },
      { key: 'hyderabad', el: elements.cardCostHyd, total: calcHyd.totalCrore },
      { key: 'pune', el: elements.cardCostPun, total: calcPun.totalCrore }
    ];
    const lowest = totals.reduce((min, curr) => curr.total < min.total ? curr : min, totals[0]);

    totals.forEach(t => {
      t.el.classList.toggle('highlight-lowest', t.key === lowest.key);
    });
  }

  function resetAssumptions() {
    const def = window.GCC_CALCULATOR.DEFAULTS;
    elements.inputEmployees.value = def.employees;
    if (elements.rangeEmployees) elements.rangeEmployees.value = def.employees;
    elements.inputSqft.value = def.sqFtPerEmployee;

    elements.inputBlrSalary.value = def.cities.bengaluru.salaryLakh;
    if (elements.rangeBlrSalary) elements.rangeBlrSalary.value = def.cities.bengaluru.salaryLakh;
    elements.inputBlrRent.value = def.cities.bengaluru.monthlyRent;
    if (elements.rangeBlrRent) elements.rangeBlrRent.value = def.cities.bengaluru.monthlyRent;

    elements.inputHydSalary.value = def.cities.hyderabad.salaryLakh;
    if (elements.rangeHydSalary) elements.rangeHydSalary.value = def.cities.hyderabad.salaryLakh;
    elements.inputHydRent.value = def.cities.hyderabad.monthlyRent;
    if (elements.rangeHydRent) elements.rangeHydRent.value = def.cities.hyderabad.monthlyRent;

    elements.inputPunSalary.value = def.cities.pune.salaryLakh;
    if (elements.rangePunSalary) elements.rangePunSalary.value = def.cities.pune.salaryLakh;
    elements.inputPunRent.value = def.cities.pune.monthlyRent;
    if (elements.rangePunRent) elements.rangePunRent.value = def.cities.pune.monthlyRent;

    elements.presetChips.forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-size') === '100');
    });

    updateScenarioCalculations();
    showToast('Assumptions reset to initial assignment defaults (BLR: ₹25.20 Cr)', '🔄');
  }

  // Shortlist View Controller
  function renderShortlistView() {
    const savedIds = window.GCC_STORAGE.getShortlistIds();
    const savedCompanies = window.GCC_DATA.companies.filter(c => savedIds.includes(c.id));
    const container = elements.shortlistCompaniesContainer;

    elements.sidebarShortlistCount.textContent = savedIds.length;
    elements.sidebarShortlistCount.classList.toggle('has-items', savedIds.length > 0);

    elements.shortlistStatusHeading.textContent = `${savedCompanies.length} Saved Peer Record${savedCompanies.length === 1 ? '' : 's'}`;

    if (savedCompanies.length === 0) {
      container.innerHTML = '';
      elements.shortlistEmptyState.style.display = 'flex';
      elements.btnClearShortlist.style.display = 'none';
      return;
    }

    elements.shortlistEmptyState.style.display = 'none';
    elements.btnClearShortlist.style.display = 'inline-block';

    container.innerHTML = savedCompanies.map(c => {
      const sourceDate = c.sources[0]?.publicationDate || 'Undated';
      return `
        <article class="company-card" data-id="${c.id}">
          <div>
            <div class="company-card-header">
              <div class="company-title-wrap">
                <h2 class="company-name">${escapeHtml(c.name)}</h2>
                <span class="company-parent">Global Parent: ${escapeHtml(c.parent)}</span>
              </div>
              <span class="badge badge-city">${escapeHtml(c.city)}</span>
            </div>

            <div class="company-badges-row">
              <span class="badge badge-sector">${escapeHtml(c.sector)}</span>
              <span class="badge badge-evidence">Source Verified</span>
            </div>

            <div class="company-props-list">
              <div class="prop-row">
                <span class="prop-key">Verified Functions:</span>
                <span class="prop-val">${escapeHtml(c.functions)}</span>
              </div>
              <div class="prop-row">
                <span class="prop-key">Established Year:</span>
                <span class="prop-val">${escapeHtml(c.establishedDisplay)}</span>
              </div>
              <div class="prop-row">
                <span class="prop-key">Primary Source Date:</span>
                <span class="prop-val">${escapeHtml(sourceDate)}</span>
              </div>
            </div>

            <div class="company-claim-excerpt">
              ${escapeHtml(c.evidenceSummary)}
            </div>
          </div>

          <div class="company-card-actions">
            <button type="button" class="btn btn-secondary btn-sm btn-inspect-evidence" data-id="${c.id}">
              <span>Inspect Evidence</span>
            </button>
            <button type="button" class="btn btn-secondary btn-sm btn-remove-saved" data-id="${c.id}" aria-label="Remove ${escapeHtml(c.name)} from shortlist">
              <span>Remove</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('.btn-inspect-evidence').forEach(btn => {
      btn.addEventListener('click', () => {
        openEvidenceDrawer(btn.getAttribute('data-id'), btn);
      });
    });

    container.querySelectorAll('.btn-remove-saved').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.GCC_STORAGE.remove(id);
        showToast('Removed from shortlist', '🗑️');
      });
    });
  }

  // Export Brief Trigger
  function triggerExport(format) {
    const savedIds = window.GCC_STORAGE.getShortlistIds();
    const shortlistCompanies = window.GCC_DATA.companies.filter(c => savedIds.includes(c.id));
    const allCompanies = window.GCC_DATA.companies;

    window.GCC_EXPORTER.exportDecisionBrief({
      shortlistCompanies,
      allCompanies,
      scenarioInputs: {
        employees: state.scenario.employees,
        sqFtPerEmployee: state.scenario.sqFtPerEmployee
      },
      costResults: state.costResults
    }, format);

    showToast(`Decision Brief downloaded (.${format})!`, '📄');
  }

  // Live Brief Inspector Modal
  function openBriefModal() {
    const savedIds = window.GCC_STORAGE.getShortlistIds();
    const shortlistCompanies = window.GCC_DATA.companies.filter(c => savedIds.includes(c.id));
    const allCompanies = window.GCC_DATA.companies;

    const markdown = window.GCC_EXPORTER.generateDecisionBriefMarkdown({
      shortlistCompanies,
      allCompanies,
      scenarioInputs: {
        employees: state.scenario.employees,
        sqFtPerEmployee: state.scenario.sqFtPerEmployee
      },
      costResults: state.costResults
    });

    if (elements.briefModalContent) {
      elements.briefModalContent.textContent = markdown;
    }

    elements.briefModalBackdrop.classList.add('open');
    elements.briefModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBriefModal() {
    elements.briefModalBackdrop.classList.remove('open');
    elements.briefModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Tour Modal
  function openTourModal() {
    state.lastFocusedElement = document.activeElement;
    elements.tourModalBackdrop.classList.add('open');
    elements.tourModalBackdrop.setAttribute('aria-hidden', 'false');
    elements.btnCloseTour.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeTourModal() {
    elements.tourModalBackdrop.classList.remove('open');
    elements.tourModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
      state.lastFocusedElement.focus();
    }
  }

  // Automated 90s Walkthrough Rehearsal Player
  function runAutoDemo() {
    if (state.isAutoDemoRunning) return;
    state.isAutoDemoRunning = true;
    closeTourModal();
    showToast('Starting 90-Second Walkthrough Demonstration...', '🎬');

    // Step 1: Switch to Explore and search "DBS"
    switchView('explore');
    elements.exploreSearch.value = '';
    elements.exploreSearch.focus();

    let queryText = 'DBS';
    let charIdx = 0;
    const typeInterval = setInterval(() => {
      elements.exploreSearch.value += queryText[charIdx];
      state.searchQuery = elements.exploreSearch.value;
      elements.exploreSearchClear.style.display = 'block';
      renderExploreCards();
      charIdx++;
      if (charIdx >= queryText.length) {
        clearInterval(typeInterval);
        
        // Step 2: Open Evidence Drawer for DBS
        setTimeout(() => {
          showToast('Step 2: Inspecting DBS Tech India primary citations...', '🔍');
          openEvidenceDrawer('dbs-tech-india');

          // Step 3: Save to shortlist
          setTimeout(() => {
            window.GCC_STORAGE.add('dbs-tech-india');
            updateDrawerShortlistButton();
            showToast('Step 3: Bookmarked DBS to executive shortlist!', '🔖');

            // Step 4: Close drawer and switch to Compare Cities
            setTimeout(() => {
              closeEvidenceDrawer();
              switchView('compare');
              showToast('Step 4: Comparing Bengaluru, Hyderabad, and Pune costs...', '📊');

              // Step 5: Animate BLR salary from 24 to 26 Lakh
              setTimeout(() => {
                showToast('Step 5: Testing sensitivity (BLR Salary 24 → 26 Lakh)...', '⚡');
                elements.inputBlrSalary.value = '26';
                if (elements.rangeBlrSalary) elements.rangeBlrSalary.value = '26';
                updateScenarioCalculations();

                // Step 6: Go to Shortlist
                setTimeout(() => {
                  switchView('shortlist');
                  showToast('Walkthrough complete! Brief ready for download.', '✅');
                  state.isAutoDemoRunning = false;
                }, 2200);
              }, 2000);
            }, 1800);
          }, 1800);
        }, 1200);
      }
    }, 250);
  }

  // Synchronize range sliders with inputs
  function setupRangeSync(inputEl, rangeEl) {
    if (!inputEl || !rangeEl) return;
    inputEl.addEventListener('input', () => {
      rangeEl.value = inputEl.value;
      updateScenarioCalculations();
    });
    rangeEl.addEventListener('input', () => {
      inputEl.value = rangeEl.value;
      updateScenarioCalculations();
    });
  }

  // Bind Event Listeners
  function bindEvents() {
    elements.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');
        switchView(targetView);
      });
    });

    elements.mobileNavToggle.addEventListener('click', () => {
      const isOpen = elements.appSidebar.classList.toggle('mobile-open');
      elements.mobileNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    elements.exploreSearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      elements.exploreSearchClear.style.display = state.searchQuery ? 'block' : 'none';
      renderExploreCards();
    });

    elements.exploreSearchClear.addEventListener('click', () => {
      elements.exploreSearch.value = '';
      state.searchQuery = '';
      elements.exploreSearchClear.style.display = 'none';
      elements.exploreSearch.focus();
      renderExploreCards();
    });

    elements.filterCity.addEventListener('change', (e) => {
      state.filterCity = e.target.value;
      renderExploreCards();
    });

    elements.filterSector.addEventListener('change', (e) => {
      state.filterSector = e.target.value;
      renderExploreCards();
    });

    elements.btnResetFilters.addEventListener('click', () => {
      elements.exploreSearch.value = '';
      state.searchQuery = '';
      elements.exploreSearchClear.style.display = 'none';
      elements.filterCity.value = 'all';
      state.filterCity = 'all';
      elements.filterSector.value = 'all';
      state.filterSector = 'all';
      renderExploreCards();
      showToast('Filters reset to default view', '🔄');
    });

    // Sync sliders
    setupRangeSync(elements.inputEmployees, elements.rangeEmployees);
    setupRangeSync(elements.inputBlrSalary, elements.rangeBlrSalary);
    setupRangeSync(elements.inputBlrRent, elements.rangeBlrRent);
    setupRangeSync(elements.inputHydSalary, elements.rangeHydSalary);
    setupRangeSync(elements.inputHydRent, elements.rangeHydRent);
    setupRangeSync(elements.inputPunSalary, elements.rangePunSalary);
    setupRangeSync(elements.inputPunRent, elements.rangePunRent);

    elements.inputSqft.addEventListener('input', updateScenarioCalculations);

    // Headcount Presets
    elements.presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const size = Number(chip.getAttribute('data-size'));
        elements.inputEmployees.value = size;
        if (elements.rangeEmployees) elements.rangeEmployees.value = size;
        elements.presetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        updateScenarioCalculations();
        showToast(`Headcount set to ${size} employees`, '👥');
      });
    });

    elements.btnResetAssumptions.addEventListener('click', resetAssumptions);

    elements.btnClearShortlist.addEventListener('click', () => {
      if (window.confirm('Clear all peer records from your shortlist?')) {
        window.GCC_STORAGE.clearShortlist();
        showToast('Shortlist cleared', '🗑️');
      }
    });

    elements.btnGotoExplore.addEventListener('click', () => switchView('explore'));

    elements.btnExportMd.addEventListener('click', () => triggerExport('md'));
    elements.btnExportTxt.addEventListener('click', () => triggerExport('txt'));
    if (elements.btnPreviewBrief) {
      elements.btnPreviewBrief.addEventListener('click', openBriefModal);
    }

    if (elements.btnCloseBriefModal) {
      elements.btnCloseBriefModal.addEventListener('click', closeBriefModal);
    }
    if (elements.briefModalBackdrop) {
      elements.briefModalBackdrop.addEventListener('click', (e) => {
        if (e.target === elements.briefModalBackdrop) closeBriefModal();
      });
    }
    if (elements.btnCopyBriefModal) {
      elements.btnCopyBriefModal.addEventListener('click', () => {
        if (elements.briefModalContent) {
          navigator.clipboard.writeText(elements.briefModalContent.textContent).then(() => {
            showToast('Decision Brief copied to clipboard!', '📋');
          });
        }
      });
    }

    // Drawer events
    elements.btnCloseDrawer.addEventListener('click', closeEvidenceDrawer);
    elements.drawerSecondaryClose.addEventListener('click', closeEvidenceDrawer);
    elements.drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.drawerBackdrop) closeEvidenceDrawer();
    });

    elements.drawerBtnToggleShortlist.addEventListener('click', () => {
      if (state.activeDrawerCompanyId) {
        const isNowSaved = window.GCC_STORAGE.toggleSave(state.activeDrawerCompanyId);
        updateDrawerShortlistButton();
        const comp = window.GCC_DATA.companies.find(c => c.id === state.activeDrawerCompanyId);
        showToast(isNowSaved ? `Added ${comp.name} to shortlist!` : `Removed ${comp.name} from shortlist`, isNowSaved ? '🔖' : '🗑️');
      }
    });

    // Tour modal events
    elements.btnOpenTour.addEventListener('click', openTourModal);
    elements.btnCloseTour.addEventListener('click', closeTourModal);
    elements.tourModalBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.tourModalBackdrop) closeTourModal();
    });
    elements.btnStartGuidedTour.addEventListener('click', () => {
      closeTourModal();
      switchView('explore');
      elements.exploreSearch.focus();
    });
    if (elements.btnAutoDemo) {
      elements.btnAutoDemo.addEventListener('click', runAutoDemo);
    }

    // Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (elements.drawerBackdrop.classList.contains('open')) {
          closeEvidenceDrawer();
        } else if (elements.tourModalBackdrop.classList.contains('open')) {
          closeTourModal();
        } else if (elements.briefModalBackdrop && elements.briefModalBackdrop.classList.contains('open')) {
          closeBriefModal();
        }
      }
    });

    // Storage subscriber
    window.GCC_STORAGE.subscribe((ids) => {
      elements.sidebarShortlistCount.textContent = ids.length;
      elements.sidebarShortlistCount.classList.toggle('has-items', ids.length > 0);
      if (state.currentView === 'explore') {
        renderExploreCards();
      } else if (state.currentView === 'shortlist') {
        renderShortlistView();
      }
      updateDrawerShortlistButton();
    });
  }

  // Initialize
  function init() {
    bindEvents();
    renderExploreCards();
    updateScenarioCalculations();
    renderShortlistView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
