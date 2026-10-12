// GCC Atlas - Decision Brief Exporter
// Generates and downloads an inspectable, formatted decision brief (Markdown / Plain Text)

(function (window) {
  'use strict';

  function generateDecisionBriefMarkdown(options) {
    const {
      shortlistCompanies = [],
      allCompanies = [],
      scenarioInputs = {},
      costResults = {},
      exportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } = options;

    const companiesToInclude = shortlistCompanies.length > 0 ? shortlistCompanies : allCompanies;
    const isShortlistFiltered = shortlistCompanies.length > 0;

    const { employees = 100, sqFtPerEmployee = 100 } = scenarioInputs;
    const totalArea = employees * sqFtPerEmployee;

    let md = '';

    md += `# GCC ATLAS — INDIA EXPANSION LOCATION SHORTLIST DECISION BRIEF\n\n`;
    md += `**Document Purpose:** Defensible location selection brief for executive leadership\n`;
    md += `**Target Profile:** Global mid-market enterprise establishing 50–200 person engineering / data capability hub\n`;
    md += `**Author / Analyst:** Andluru Sai Punith Reddy (Flexiple Product Intern Assignment)\n`;
    md += `**Date of Generation:** ${exportDate}\n`;
    md += `**Research Check Date:** 12 October 2026\n`;
    md += `**Methodology Boundary:** Curated prototype analysis; deterministic scenario model\n\n`;
    md += `---\n\n`;

    md += `## 1. EXECUTIVE SUMMARY & CONTEXT\n\n`;
    md += `A first-time India capability hub expansion requires a defensible shortlist of 2–3 candidate cities before entering commercial broker or setup partner negotiations. This brief synthesizes:\n`;
    md += `1. **Peer Footprints:** Primary corporate evidence for peer GCCs in target sectors (Retail & Financial Services).\n`;
    md += `2. **Deterministic Cost Scenario:** Salary and base office rent baseline for a ${employees}-seat initial team (${totalArea.toLocaleString('en-IN')} sq ft).\n`;
    md += `3. **Commercial Real Estate Depth:** JLL FY2025 macro leasing context across candidate micro-markets.\n`;
    md += `4. **Next Diligence Directives:** Concrete audit questions for legal entity mapping, recruitment, and service providers.\n\n`;

    md += `> **CRITICAL SELECTION PRINCIPLE:**\n`;
    md += `> Do **not** treat the lowest-cost city as the default recommendation. Cost differentials are frequently offset by hiring velocity, specialized domain depth (e.g. AI/platform architects), and senior site-leader availability.\n\n`;

    md += `## 2. PEER FOOTPRINTS & INSPECTABLE EVIDENCE\n\n`;
    if (!isShortlistFiltered) {
      md += `*Note: No custom shortlist was filtered; presenting the full 4 curated prototype records researched on 12 October 2026.*\n\n`;
    } else {
      md += `*Displaying ${shortlistCompanies.length} peer record(s) explicitly saved to the candidate shortlist:*\n\n`;
    }

    companiesToInclude.forEach((c, idx) => {
      md += `### ${idx + 1}. ${c.name} (${c.city})\n`;
      md += `- **Global Parent:** ${c.parent}\n`;
      md += `- **City Location:** ${c.city}\n`;
      md += `- **Sector:** ${c.sector}\n`;
      md += `- **Functions:** ${c.functions} *(${c.functionsClassification || 'Company reported'})*\n`;
      md += `- **Established Year:** ${c.establishedDisplay || c.establishedYear || 'Not verified'}\n`;
      md += `- **Evidence Status:** ${c.evidenceStatus}\n`;
      md += `- **Primary Claim:** ${c.evidenceSummary}\n`;
      md += `- **Sources:**\n`;
      c.sources.forEach(s => {
        md += `  - [${s.title}](${s.url}) — *Publication Date: ${s.publicationDate}*\n`;
      });
      md += `- **Research-Check Date:** ${c.researchCheckDate}\n`;
      md += `- **Unresolved Diligence Gaps:** ⚠️ *${c.unresolvedGaps}*\n\n`;
    });

    md += `## 3. LOCATION COST SCENARIO MODEL (SALARY + BASE RENT)\n\n`;
    md += `### 3.1 Model Assumptions & Shared Parameters\n`;
    md += `- **Target Headcount:** ${employees} employees\n`;
    md += `- **Workspace Allocation:** ${sqFtPerEmployee} sq ft per employee (Total requirement: ${totalArea.toLocaleString('en-IN')} sq ft)\n`;
    md += `- **Calculation Period:** Annual (12 months)\n`;
    md += `- **Formula:**\n`;
    md += `  \`\`\`text\n`;
    md += `  Annual Total (INR Crore) =\n`;
    md += `    [Employees × Annual Salary (Lakh) / 100] +\n`;
    md += `    [Employees × SqFt per Employee × Monthly Rent (INR) × 12 / 10,000,000]\n`;
    md += `  \`\`\`\n\n`;

    md += `### 3.2 City Comparison Table\n\n`;
    md += `| City | Assumed Salary (Lakh/Yr) | Assumed Rent (₹/sq ft/mo) | Annual Salary (₹ Cr) | Annual Base Rent (₹ Cr) | Total Annual Cost (₹ Cr) |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    const cityKeys = ['bengaluru', 'hyderabad', 'pune'];
    cityKeys.forEach(cityKey => {
      const city = costResults[cityKey];
      if (city) {
        md += `| **${city.name}** | ₹${city.salaryLakh} Lakh | ₹${city.monthlyRent}/sq ft | ₹${city.salaryCrore.toFixed(2)} Cr | ₹${city.rentCrore.toFixed(2)} Cr | **₹${city.totalCrore.toFixed(2)} Cr** |\n`;
      }
    });

    md += `\n`;
    md += `### 3.3 Explicit Model Disclosures & Exclusions\n`;
    md += `- **DISCLOSURE:** All salary and rental figures above are **ILLUSTRATIVE ASSUMPTIONS**, not sourced compensation benchmarks or verified landlord quotations.\n`;
    md += `- **COVERAGE:** Model includes strictly gross annual employee compensation and bare-shell / warm-shell base office lease.\n`;
    md += `- **EXCLUDED COSTS (Mandatory HQ Budget Additions):**\n`;
    md += `  1. Mandatory statutory benefits (Provident Fund 12%, Gratuity ~4.81%, ESIC, medical insurance).\n`;
    md += `  2. Capital expenditure / interior fit-out (typically ₹3,500 – ₹5,500 per sq ft amortized over 3–5 years).\n`;
    md += `  3. Corporate entity establishment, GST registration, transfer pricing compliance, and statutory audit.\n`;
    md += `  4. Executive recruiting / agency fees (typically 15% – 20% of first-year CTC per hired lead).\n`;
    md += `  5. High-spec IT infrastructure, redundant internet links, and compliance monitoring.\n`;
    md += `  6. State industrial policies and potential IT/ITES subsidies (varies across Karnataka, Telangana, and Maharashtra).\n\n`;

    md += `## 4. COMMERCIAL REAL ESTATE MACRO CONTEXT\n\n`;
    md += `Gross commercial office leasing activity across target markets (Full-Year 2025, per JLL India Research):\n`;
    md += `- **Bengaluru:** 24.1 million sq ft gross leasing (India's highest single-city leasing volume)\n`;
    md += `- **Hyderabad:** 11.7 million sq ft gross leasing (Continued expansion in HITEC City / Financial District)\n`;
    md += `- **Pune:** 8.1 million sq ft gross leasing (Robust absorption in Kharadi and Hinjawadi corridors)\n\n`;
    md += `*Source:* [JLL India 2025 Office Market Report](https://www.jll.com/en-in/newsroom/india-s-office-market-scales-unprecedented-highs-with-gross-leasing-activity-at-83-3-million-sq-ft-for-the-year-2025-jll)\n`;
    md += `> **Cautionary Note:** This JLL figure measures **ALL** commercial office occupiers (including IT services, domestic banking, and manufacturing), not exclusively GCCs, and must not be used as an indicator of engineering talent pool size.\n\n`;

    md += `## 5. SERVICE PROVIDER SCOPE & DILIGENCE CHECKLIST\n\n`;
    md += `### 1. ANSR (GCC Design, Setup & Operations)\n`;
    md += `- **Service Scope:** Full-cycle GCC setup spanning talent acquisition, workspace advisory, and operational handover.\n`;
    md += `- **Evidence Status:** Provider description; operational outcomes self-reported.\n`;
    md += `- **Source:** [https://ansr.com/global-capability-center/](https://ansr.com/global-capability-center/)\n`;
    md += `- **Diligence Directives:** Request two relevant mid-market client references with verified project delivery timelines and actual employee attrition rates.\n\n`;

    md += `### 2. JLL India (Commercial Real Estate & Project Management)\n`;
    md += `- **Service Scope:** Site evaluation, commercial leasing, workplace design, and facilities management.\n`;
    md += `- **Evidence Status:** Provider description; no independently checked delivery outcomes in this prototype.\n`;
    md += `- **Source:** [https://www.jll.com/en-in/property-types/global-capability-centres](https://www.jll.com/en-in/property-types/global-capability-centres)\n`;
    md += `- **Diligence Directives:** Request current micro-market building availability quotes, standard commercial transaction fee schedules, and recent GCC client tenant references.\n\n`;

    md += `## 6. RECOMMENDED HEADQUARTERS ACTION PLAN\n\n`;
    md += `| Milestone | Horizon | Key Deliverables |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Phase 1: Location Downselect** | Weeks 1–3 | Downselect from 3 candidate cities to top 2 based on domain talent availability rather than nominal rent. |\n`;
    md += `| **Phase 2: Legal Entity Structuring** | Weeks 4–6 | Form India Private Limited subsidiary; establish transfer pricing agreement and board structure. |\n`;
    md += `| **Phase 3: Real Estate Inspection** | Weeks 7–9 | Inspect managed office / co-working options (e.g. 6-12 month bridge) vs permanent lease. |\n`;
    md += `| **Phase 4: Site Leader Recruitment** | Weeks 8–12 | Hire India Managing Director / Site Head before committing to broad hiring campaigns. |\n\n`;

    md += `---\n`;
    md += `*Exported from GCC Atlas Prototype (Author: Andluru Sai Punith Reddy) on ${exportDate}*\n`;
    md += `*Methodology: Browser-local deterministic prototype. No live LLM or generative AI was executed to produce these figures.*\n`;

    return md;
  }

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  }

  function exportDecisionBrief(options, format = 'md') {
    const markdown = generateDecisionBriefMarkdown(options);
    const dateSlug = new Date().toISOString().slice(0, 10);
    
    if (format === 'txt') {
      const text = markdown
        .replace(/#+\s/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/>\s/g, '  ');
      downloadFile(text, `GCC_Atlas_Decision_Brief_${dateSlug}.txt`, 'text/plain;charset=utf-8');
    } else {
      downloadFile(markdown, `GCC_Atlas_Decision_Brief_${dateSlug}.md`, 'text/markdown;charset=utf-8');
    }
  }

  window.GCC_EXPORTER = {
    generateDecisionBriefMarkdown,
    exportDecisionBrief
  };
})(window);
