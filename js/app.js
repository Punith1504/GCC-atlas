// GCC Atlas - Application Controller
// Author: Andluru Sai Punith Reddy

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
    costResults: {}
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

    // Calculator inputs
    inputEmployees: document.getElementById('input-employees'),
    inputSqft: document.getElementById('input-sqft'),
    inputBlrSalary: document.getElementById('input-blr-salary'),
    inputBlrRent: document.getElementById('input-blr-rent'),
    inputHydSalary: document.getElementById('input-hyd-salary'),
    inputHydRent: document.getElementById('input-hyd-rent'),
    inputPunSalary: document.getElementById('input-pun-salary'),
    inputPunRent: document.getElementById('input-pun-rent'),
    btnResetAssumptions: document.getElementById('btn-reset-assumptions'),

    // Calculator outputs
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
    btnStartGuidedTour: document.getElementById('btn-start-guided-tour')
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

    // Close mobile nav drawer if open
    if (elements.appSidebar.classList.contains('mobile-open')) {
      elements.appSidebar.classList.remove('mobile-open');
      elements.mobileNavToggle.setAttribute('aria-expanded', 'false');
    }

    // Scroll to top of viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh view specific components
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

    // Attach card event listeners
    container.querySelectorAll('.btn-inspect-evidence').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        openEvidenceDrawer(id, btn);
      });
    });

    container.querySelectorAll('.btn-toggle-shortlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        window.GCC_STORAGE.toggleSave(id);
      });
    });
  }

  // Evidence Drawer Controller
  function openEvidenceDrawer(companyId, triggerElement) {
    const company = window.GCC_DATA.companies.find(c => c.id === companyId);
    if (!company) return;

    state.activeDrawerCompanyId = companyId;
    state.lastFocusedElement = triggerElement || document.activeElement;

    // Populate drawer elements
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

    // Render Sources with safe attributes
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

    // Update shortlist button in drawer
    updateDrawerShortlistButton();

    // Show drawer
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

    // Restore focus
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

  // Cost Scenario Calculator Wiring
  function updateScenarioCalculations() {
    const employees = Number(elements.inputEmployees.value) || 0;
    const sqFtPerEmployee = Number(elements.inputSqft.value) || 0;

    const blrSalary = Number(elements.inputBlrSalary.value) || 0;
    const blrRent = Number(elements.inputBlrRent.value) || 0;

    const hydSalary = Number(elements.inputHydSalary.value) || 0;
    const hydRent = Number(elements.inputHydRent.value) || 0;

    const punSalary = Number(elements.inputPunSalary.value) || 0;
    const punRent = Number(elements.inputPunRent.value) || 0;

    // Store in state
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

    // Render Bengaluru
    elements.valTotalBlr.textContent = window.GCC_CALCULATOR.formatCrore(calcBlr.totalCrore);
    elements.valSalaryBlr.textContent = window.GCC_CALCULATOR.formatCrore(calcBlr.salaryCrore);
    elements.valRentBlr.textContent = window.GCC_CALCULATOR.formatCrore(calcBlr.rentCrore);
    elements.valAreaBlr.textContent = `${window.GCC_CALCULATOR.formatNumber(calcBlr.totalAreaSqFt)} sq ft`;

    // Render Hyderabad
    elements.valTotalHyd.textContent = window.GCC_CALCULATOR.formatCrore(calcHyd.totalCrore);
    elements.valSalaryHyd.textContent = window.GCC_CALCULATOR.formatCrore(calcHyd.salaryCrore);
    elements.valRentHyd.textContent = window.GCC_CALCULATOR.formatCrore(calcHyd.rentCrore);
    elements.valAreaHyd.textContent = `${window.GCC_CALCULATOR.formatNumber(calcHyd.totalAreaSqFt)} sq ft`;

    // Render Pune
    elements.valTotalPun.textContent = window.GCC_CALCULATOR.formatCrore(calcPun.totalCrore);
    elements.valSalaryPun.textContent = window.GCC_CALCULATOR.formatCrore(calcPun.salaryCrore);
    elements.valRentPun.textContent = window.GCC_CALCULATOR.formatCrore(calcPun.rentCrore);
    elements.valAreaPun.textContent = `${window.GCC_CALCULATOR.formatNumber(calcPun.totalAreaSqFt)} sq ft`;

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
    elements.inputSqft.value = def.sqFtPerEmployee;

    elements.inputBlrSalary.value = def.cities.bengaluru.salaryLakh;
    elements.inputBlrRent.value = def.cities.bengaluru.monthlyRent;

    elements.inputHydSalary.value = def.cities.hyderabad.salaryLakh;
    elements.inputHydRent.value = def.cities.hyderabad.monthlyRent;

    elements.inputPunSalary.value = def.cities.pune.salaryLakh;
    elements.inputPunRent.value = def.cities.pune.monthlyRent;

    updateScenarioCalculations();
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
        window.GCC_STORAGE.remove(btn.getAttribute('data-id'));
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

  // Bind Event Listeners
  function bindEvents() {
    // Nav buttons
    elements.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');
        switchView(targetView);
      });
    });

    // Mobile nav toggle
    elements.mobileNavToggle.addEventListener('click', () => {
      const isOpen = elements.appSidebar.classList.toggle('mobile-open');
      elements.mobileNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Search input
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

    // City & Sector Filters
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
    });

    // Calculator Inputs (Real-time updates)
    const calcInputs = [
      elements.inputEmployees,
      elements.inputSqft,
      elements.inputBlrSalary,
      elements.inputBlrRent,
      elements.inputHydSalary,
      elements.inputHydRent,
      elements.inputPunSalary,
      elements.inputPunRent
    ];

    calcInputs.forEach(input => {
      input.addEventListener('input', updateScenarioCalculations);
      input.addEventListener('change', updateScenarioCalculations);
    });

    elements.btnResetAssumptions.addEventListener('click', resetAssumptions);

    // Shortlist actions
    elements.btnClearShortlist.addEventListener('click', () => {
      if (window.confirm('Clear all peer records from your shortlist?')) {
        window.GCC_STORAGE.clearShortlist();
      }
    });

    elements.btnGotoExplore.addEventListener('click', () => {
      switchView('explore');
    });

    elements.btnExportMd.addEventListener('click', () => triggerExport('md'));
    elements.btnExportTxt.addEventListener('click', () => triggerExport('txt'));

    // Drawer events
    elements.btnCloseDrawer.addEventListener('click', closeEvidenceDrawer);
    elements.drawerSecondaryClose.addEventListener('click', closeEvidenceDrawer);

    elements.drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.drawerBackdrop) {
        closeEvidenceDrawer();
      }
    });

    elements.drawerBtnToggleShortlist.addEventListener('click', () => {
      if (state.activeDrawerCompanyId) {
        window.GCC_STORAGE.toggleSave(state.activeDrawerCompanyId);
        updateDrawerShortlistButton();
      }
    });

    // Tour modal events
    elements.btnOpenTour.addEventListener('click', openTourModal);
    elements.btnCloseTour.addEventListener('click', closeTourModal);
    elements.tourModalBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.tourModalBackdrop) {
        closeTourModal();
      }
    });
    elements.btnStartGuidedTour.addEventListener('click', () => {
      closeTourModal();
      switchView('explore');
      elements.exploreSearch.focus();
    });

    // Global Keyboard Listeners (Escape key handling)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (elements.drawerBackdrop.classList.contains('open')) {
          closeEvidenceDrawer();
        } else if (elements.tourModalBackdrop.classList.contains('open')) {
          closeTourModal();
        }
      }
    });

    // Storage subscriber for reactive updates across the entire app
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
