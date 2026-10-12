// GCC Atlas - Curated Dataset (Researched 12 October 2026)
// Author: Andluru Sai Punith Reddy

window.GCC_DATA = {
  researchDate: '12 October 2026',
  prototypeLabel: 'Curated four-record prototype, researched on 12 October 2026',
  
  companies: [
    {
      id: 'tesco-bengaluru',
      name: 'Tesco Bengaluru',
      parent: 'Tesco',
      city: 'Bengaluru',
      sector: 'Retail',
      functions: 'Technology and business solutions',
      functionsClassification: 'Company reported',
      establishedYear: 2004,
      establishedDisplay: '2004',
      evidenceStatus: 'Company source supports this claim',
      evidenceSummary: 'The company website describes its Bengaluru capability hub and states that it has operated there since 2004.',
      sources: [
        {
          title: 'Tesco Bengaluru Official Capability Hub Site',
          url: 'https://www.tescobengaluru.com/',
          publicationDate: 'Undated current website',
          isDated: false
        }
      ],
      researchCheckDate: '12 October 2026',
      unresolvedGaps: 'Current hiring capacity, compensation and legal-entity mapping are not verified.',
      verificationNote: 'Primary company source supports operational presence and tenure. Financial compensation benchmarks, entity filings, and present workforce capacity remain unverified.'
    },
    {
      id: 'lowes-india',
      name: 'Lowe’s India',
      parent: 'Lowe’s',
      city: 'Bengaluru',
      sector: 'Retail',
      functions: 'Technology and retail operations',
      functionsClassification: 'Analyst classification',
      establishedYear: null,
      establishedDisplay: 'Not verified',
      evidenceStatus: 'Company source supports this claim',
      evidenceSummary: 'The company lists an India office at Manyata Embassy Business Park in Bengaluru.',
      sources: [
        {
          title: 'Lowe’s India - About Us / Office Locations',
          url: 'https://lowes.co.in/about/',
          publicationDate: 'Undated current website',
          isDated: false
        }
      ],
      researchCheckDate: '12 October 2026',
      unresolvedGaps: 'Start year, current headcount and detailed function coverage need verification.',
      verificationNote: 'Office location is supported by official corporate website. Start year, headcount breakdown, and functional scope are subject to analyst classification and require independent confirmation.'
    },
    {
      id: 'dbs-tech-india',
      name: 'DBS Tech India',
      parent: 'DBS',
      city: 'Hyderabad',
      sector: 'Financial services',
      functions: 'Engineering, cloud, data and AI',
      functionsClassification: 'Company reported',
      establishedYear: 2016,
      establishedDisplay: '2016',
      evidenceStatus: 'Company source supports this claim',
      evidenceSummary: 'DBS’s current site describes its offshore technology centre and its 2016 establishment. The 20 July 2018 company release locates the hub in Hyderabad.',
      sources: [
        {
          title: 'DBS Tech India Capability Centre Portal',
          url: 'https://www.dbs.com/dbstechindia/index.html?linkId=100000401445764',
          publicationDate: 'Undated current website',
          isDated: false
        },
        {
          title: 'DBS Corporate Media Release (Hyderabad Hub)',
          url: 'https://www.dbs.com/gsmc-grp/NewsPrinter.page?locale=en&newsId=jy1w61zy',
          publicationDate: '20 July 2018',
          isDated: true
        }
      ],
      researchCheckDate: '12 October 2026',
      unresolvedGaps: 'Historical workforce milestones do not prove current staffing or hiring availability.',
      verificationNote: 'Establishment year and Hyderabad locus are documented across official releases. Historical headcount milestones reflect past announcements rather than live engineering capacity.'
    },
    {
      id: 'mastercard-tech-hub',
      name: 'Mastercard Tech Hub',
      parent: 'Mastercard',
      city: 'Pune',
      sector: 'Financial services',
      functions: 'Software, cybersecurity and data architecture',
      functionsClassification: 'Company reported',
      establishedYear: 2014,
      establishedDisplay: '2014 (First India Tech Hub)',
      evidenceStatus: 'Company source supports this claim',
      evidenceSummary: 'A 15 October 2024 company release announces a new Pune campus and states that the first India Tech Hub opened in Pune in 2014.',
      sources: [
        {
          title: 'Mastercard Opens New State-of-the-Art Tech Hub in Pune, India',
          url: 'https://newsroom.mastercard.com/news/ap/en/newsroom/press-releases/en/2024/mastercard-opens-new-state-of-the-art-tech-hub-in-pune-india/ ',
          publicationDate: '15 October 2024',
          isDated: true
        }
      ],
      researchCheckDate: '12 October 2026',
      unresolvedGaps: 'Announced campus capacity is not current audited headcount.',
      verificationNote: 'Press release verifies campus opening and origin year (2014). Target facility capacity announced in press statements does not equal current audited employee headcount.'
    }
  ],

  cityScenarios: {
    sharedDefaults: {
      employees: 100,
      sqFtPerEmployee: 100
    },
    cities: [
      {
        id: 'bengaluru',
        name: 'Bengaluru',
        tagline: 'Established GCC Capital with deepest specialized talent pools',
        defaultSalaryLakh: 24, // INR 24 Lakh / employee / year
        defaultRentSqFt: 100,  // INR 100 / sq ft / month
        jllLeasing2025: '24.1M sq ft',
        jllLeasingNumber: 24.1,
        pros: 'Deepest software engineering talent ecosystem, proven global peer density.',
        considerations: 'Highest salary inflation and competitive recruitment friction.'
      },
      {
        id: 'hyderabad',
        name: 'Hyderabad',
        tagline: 'High-velocity tech destination with modern Grade-A infrastructure',
        defaultSalaryLakh: 22, // INR 22 Lakh / employee / year
        defaultRentSqFt: 80,   // INR 80 / sq ft / month
        jllLeasing2025: '11.7M sq ft',
        jllLeasingNumber: 11.7,
        pros: 'Favorable infrastructure planning, proactive regulatory single-window system.',
        considerations: 'Secondary micro-markets have varying transit accessibility.'
      },
      {
        id: 'pune',
        name: 'Pune',
        tagline: 'Manufacturing & financial tech corridor with stable retention',
        defaultSalaryLakh: 21, // INR 21 Lakh / employee / year
        defaultRentSqFt: 85,   // INR 85 / sq ft / month
        jllLeasing2025: '8.1M sq ft',
        jllLeasingNumber: 8.1,
        pros: 'Proximity to Mumbai financial hub, strong university graduate pipeline.',
        considerations: 'Smaller absolute pool of specialized cloud/AI senior architects.'
      }
    ],
    jllSource: {
      title: 'JLL India Office Market Report (Full-Year 2025)',
      url: 'https://www.jll.com/en-in/newsroom/india-s-office-market-scales-unprecedented-highs-with-gross-leasing-activity-at-83-3-million-sq-ft-for-the-year-2025-jll',
      metricLabel: '2025 Gross Commercial Office Leasing',
      cautionLabel: 'Represents ALL office occupiers (domestic, third-party IT, BFSI), not exclusively GCCs, and does NOT indicate engineering talent-pool headcount.'
    }
  },

  providers: [
    {
      id: 'ansr',
      name: 'ANSR',
      focusArea: 'GCC Design, Setup & End-to-End Operations',
      scope: 'Full-lifecycle GCC establishment spanning entity setup, talent acquisition, workspace advisory, and operational handover under Build-Operate-Transfer (BOT) or joint models.',
      sourceUrl: 'https://ansr.com/global-capability-center/',
      evidenceStatus: 'Provider description, outcomes self-reported',
      nextDiligenceSteps: 'Request two relevant mid-market client references with verified project delivery timelines and actual employee attrition rates.',
      verificationNote: 'Scope reflects publicly marketed services on corporate portal. Commercial fees, SLA penalty clauses, and delivery milestones require prospective partner due diligence.'
    },
    {
      id: 'jll-india',
      name: 'JLL India',
      focusArea: 'Commercial Workspace Selection, Design & Property Management',
      scope: 'Commercial real estate advisory, Grade-A office site selection across Tier-1/Tier-2 micro-markets, lease transaction structuring, workplace fit-out design, and facilities operations.',
      sourceUrl: 'https://www.jll.com/en-in/property-types/global-capability-centres',
      evidenceStatus: 'Provider description, no independently checked delivery outcomes in this demo',
      nextDiligenceSteps: 'Request current micro-market building availability quotes, standard commercial transaction fee schedules, and recent GCC client tenant references.',
      verificationNote: 'Commercial lease metrics and micro-market availability vary by quarterly demand cycles. Direct RFPs are required for binding real estate proposals.'
    }
  ]
};
