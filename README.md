# GCC Atlas — India Expansion Diligence Workspace

**Prepared for:** Flexiple Product Intern Assignment  
**Author:** Andluru Sai Punith Reddy  
**Research Date:** 12 October 2026  
**Target Profile:** Strategy or Operations Lead at a global mid-market company planning a 50–200 person engineering or data team in India  

---

## 🎯 Executive Summary & Job-to-be-Done

When an international mid-market enterprise expands to India, the expansion lead needs a **defensible shortlist of 2–3 cities** before engaging commercial brokers, legal advisors, or setup partners.

Traditional expansion leads rely on opaque PDF analyst reports, vendor sales pitches, and ad-hoc spreadsheets. **GCC Atlas** replaces that fragmented workflow with an inspectable diligence workspace:
1. **Explore GCC Footprints:** Curated primary corporate evidence for peer capability centres with explicit verification statuses, source timestamps, and unverified diligence gaps.
2. **Deterministic Cost Scenario Model:** Transparent salary and office lease calculator across Bengaluru, Hyderabad, and Pune that reacts instantly to team size and micro-market assumptions.
3. **Commercial Real Estate Context:** JLL FY2025 macro leasing data with explicit disclosures.
4. **Service Provider Diligence:** Public service scopes for setup and real-estate partners with targeted diligence questions (no fabricated ratings).
5. **Shortlist & Decision Brief Export:** Browser-local shortlist management with one-click export of an inspectable executive decision brief (`.md` and `.txt`).

---

## 🛠️ Architecture & Boundaries

- **Zero-Dependency Runtime:** Built using modern HTML5, pure CSS3, and modular JavaScript. Runs locally on any static HTTP server or directly in any modern browser.
- **Browser-Local Storage:** Shortlists persist across page reloads via `localStorage` with automated recovery from corrupted or blocked storage.
- **Deterministic Calculation:** Zero black-box algorithms. All cost arithmetic is transparent and reproducible.
- **AI Boundary Disclosure:** AI tools accelerated code scaffolding and research formatting; **no live LLM inference runs inside this prototype runtime**.

---

## 🚀 Quick Start (Running Locally)

### Option 1: Built-in Node Server (Zero External Dependencies)
```bash
# Run the built-in HTTP server
node server.js
```
Open your browser to: **[http://localhost:3000](http://localhost:3000)**

### Option 2: Direct Browser File
Double-click `index.html` in your file explorer to open it directly in Chrome, Edge, Safari, or Firefox.

### Option 3: Automated Test Verification Suite
Run the 37-point test verification script:
```bash
node test_verification.js
```

---

## ⏱️ 90-Second Reviewer Walkthrough Guide

Follow this sequence to evaluate the core user journey:

1. **Explore GCCs & Search DBS:**
   - On the **Explore GCCs** tab, enter `DBS` into the search box.
   - The list immediately filters to **1 record: DBS Tech India** (`Showing 1 of 4 records`).
2. **Inspect Evidence & Unresolved Gaps:**
   - Click **"Inspect Evidence"** on the DBS card to open the slide-over drawer.
   - Review the verified claims, primary source links (undated portal and dated 20 July 2018 corporate release), and the highlighted **Unresolved Diligence Gaps** (historical milestones do not guarantee current hiring capacity).
3. **Save to Shortlist:**
   - Click **"Save to shortlist"** in the drawer or on the card.
   - The badge updates and the sidebar counter reflects `1` saved record.
4. **Compare Cities & Test Math:**
   - Switch to **"2. Compare cities"**.
   - Verify the default annual salary + rent totals for a 100-person team:
     - **Bengaluru:** ₹25.20 Cr
     - **Hyderabad:** ₹22.96 Cr
     - **Pune:** ₹22.02 Cr
5. **Test Scenario Sensitivity:**
   - Under *Bengaluru Assumptions*, change **Annual Salary / Head** from `24` to `26` Lakh.
   - Watch the Bengaluru total update immediately to **₹27.20 Cr**.
6. **Export Executive Decision Brief:**
   - Navigate to **"4. My shortlist"**.
   - Review saved candidate peers and click **"Export Decision Brief (.md)"**.
   - Your browser downloads `GCC_Atlas_Decision_Brief_<date>.md` with all selected peers, source citations, current scenario inputs, and matching totals.

---

## 📊 Verification Test Matrix

All 9 acceptance criteria specified in the product deck have been verified:

| # | Acceptance Check | Test Status | Details |
|---|---|:---:|---|
| 1 | Initial 4 records; DBS search = 1; nonsense search = empty state; filters combine | **PASS** | Exact match across keywords and dropdowns |
| 2 | Evidence drawer shows sources, dates, gaps; undated sources labeled | **PASS** | Primary links open with safe attributes; undated sites preserved |
| 3 | Shortlist persists across reload; handles corrupt storage safely | **PASS** | Unit-tested with syntax-corrupted JSON without throwing errors |
| 4 | Default scenario: BLR ₹25.20 Cr, HYD ₹22.96 Cr, PUN ₹22.02 Cr | **PASS** | Exact mathematical verification |
| 5 | BLR salary 24 → 26 produces ₹27.20 Cr; double team doubles totals | **PASS** | Reactive inputs tested; invalid values never yield `NaN` |
| 6 | Export downloads nonempty file with matching totals and assumptions | **PASS** | Markdown and plain text file downloads functional |
| 7 | Providers show public scope and diligence; no fake ratings | **PASS** | ANSR and JLL profiles contain audit directives |
| 8 | Keyboard focus, Escape dialog close, mobile layout | **PASS** | Accessible ARIA labels and `:focus-visible` styling |
| 9 | No secret API keys or private contact details | **PASS** | 100% clean browser-local architecture |

---

## 🌐 Public Deployment Guide

This repository is ready for instant 1-click deployment on any modern web host:

### GitHub Pages:
1. Push this directory to a GitHub repository (e.g. `gcc-atlas`).
2. Go to **Settings > Pages > Branch: main / root**.
3. Your app will be live at `https://<username>.github.io/gcc-atlas/`.

### Vercel / Netlify / Cloudflare Pages:
- Zero build configuration required. Set build command to `None` and publish directory to `.` (root).

---

## 📬 Flexiple Submission Draft

**Recipients:** `hrishikesh@flexiple.com`, `tanya@flexiple.com`  
**Subject:** Flexiple Product Intern Assignment Submission — GCC Atlas (Andluru Sai Punith Reddy)

```text
Hi Hrishikesh and Tanya,

I have completed the Flexiple Product Intern assignment. Below are the submission links for my slide deck and the live working prototype:

1. Slide Deck: [Link to Google Drive / PDF] (Viewer access enabled for Anyone with the link)
2. Live Prototype: [Link to Deployed Prototype / GitHub Repository]

Key Prototype Highlights:
- Curated Peer Footprints: Inspectable primary sources, undated website timestamps, and unverified diligence gaps for 4 researched capability centres (Tesco, Lowe’s, DBS, Mastercard).
- Deterministic Cost Model: Real-time scenario calculator comparing Bengaluru, Hyderabad, and Pune across salary and office leasing with transparent assumptions.
- Executive Decision Brief Export: Generates and downloads a complete briefing document (.md / .txt) without requiring accounts or backend servers.

A 90-second reviewer walkthrough and test verification matrix are documented in the repository README.

Looking forward to your feedback.

Best regards,
Andluru Sai Punith Reddy
```
