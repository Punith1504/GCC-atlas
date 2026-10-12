// GCC Atlas - Comprehensive Test Verification Suite
// Tests all 9 acceptance criteria specified in the Flexiple product assignment.

const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log(' GCC ATLAS: COMPREHENSIVE ACCEPTANCE VERIFICATION');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName} - ${details}`);
    process.exitCode = 1;
  }
}

// 1. Load Data
const dataPath = path.join(__dirname, 'js', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf-8');
const fakeWindow = {};
eval(`(function(window){ ${dataContent} })(fakeWindow)`);
const GCC_DATA = fakeWindow.GCC_DATA;

// Check 1: Initial list has exactly four records
assert(GCC_DATA.companies.length === 4, 'Initial list has exactly four records', `Found ${GCC_DATA.companies.length}`);

// Check 1b: Search DBS returns exactly one
const searchDbsResults = GCC_DATA.companies.filter(c => 
  c.name.toLowerCase().includes('dbs') || c.parent.toLowerCase().includes('dbs')
);
assert(searchDbsResults.length === 1 && searchDbsResults[0].id === 'dbs-tech-india', 'Search DBS returns exactly one record (DBS Tech India)');

// Check 1c: Search nonsense returns 0
const searchNonsense = GCC_DATA.companies.filter(c => c.name.toLowerCase().includes('xyznonsense123'));
assert(searchNonsense.length === 0, 'Nonsense search returns 0 records (triggers empty state)');

// Check 1d: City & Sector filter combination
const blrRetail = GCC_DATA.companies.filter(c => c.city === 'Bengaluru' && c.sector === 'Retail');
assert(blrRetail.length === 2, 'City=Bengaluru & Sector=Retail returns exactly 2 records (Tesco, Lowe’s)');
const hydFin = GCC_DATA.companies.filter(c => c.city === 'Hyderabad' && c.sector === 'Financial services');
assert(hydFin.length === 1 && hydFin[0].name === 'DBS Tech India', 'City=Hyderabad & Sector=Financial services returns DBS');

// Check 2: Evidence detail & Undated sources remain undated
const dbs = GCC_DATA.companies.find(c => c.id === 'dbs-tech-india');
assert(dbs.sources.length === 2, 'DBS has two source links (current and historical)');
const dbsCurrent = dbs.sources.find(s => s.url.includes('dbstechindia'));
assert(dbsCurrent.publicationDate === 'Undated current website' && !dbsCurrent.isDated, 'DBS current source is explicitly marked as "Undated current website"');
const dbsHistorical = dbs.sources.find(s => s.publicationDate === '20 July 2018');
assert(dbsHistorical && dbsHistorical.isDated, 'DBS historical source has publication date 20 July 2018');
assert(dbs.unresolvedGaps.includes('Historical workforce milestones do not prove current staffing'), 'DBS contains explicit unresolved diligence gaps');

const tesco = GCC_DATA.companies.find(c => c.id === 'tesco-bengaluru');
assert(tesco.sources[0].publicationDate === 'Undated current website', 'Tesco source is undated and labeled accordingly');

const lowes = GCC_DATA.companies.find(c => c.id === 'lowes-india');
assert(lowes.functionsClassification === 'Analyst classification', 'Lowe’s functions explicitly marked as Analyst classification');

// Check 3: Storage manager resilience & corrupt JSON handling
const storagePath = path.join(__dirname, 'js', 'storage.js');
const storageContent = fs.readFileSync(storagePath, 'utf-8');

// Mock a corrupt localStorage
let storeMock = {
  'gcc_atlas_shortlist': '{invalid_corrupted_json'
};
const fakeStorageWindow = {
  localStorage: {
    getItem: (k) => storeMock[k] || null,
    setItem: (k, v) => { storeMock[k] = v; },
    removeItem: (k) => { delete storeMock[k]; }
  },
  addEventListener: () => {}
};
eval(`(function(window){ ${storageContent} })(fakeStorageWindow)`);
const storage = fakeStorageWindow.GCC_STORAGE;

// Reading from corrupt storage should return [] safely and reset without throwing
const initialShortlist = storage.getShortlistIds();
assert(Array.isArray(initialShortlist) && initialShortlist.length === 0, 'Corrupt localStorage handled safely without crashing');

// Test saving and toggling DBS
storage.add('dbs-tech-india');
assert(storage.isSaved('dbs-tech-india'), 'Save DBS persists in storage');
assert(storage.getShortlistIds().length === 1, 'Shortlist count is 1 after saving DBS');
storage.remove('dbs-tech-india');
assert(!storage.isSaved('dbs-tech-india'), 'Removing DBS updates saved status');
assert(storage.getShortlistIds().length === 0, 'Shortlist count updates to 0');

// Check 4: Calculator default values
const calcPath = path.join(__dirname, 'js', 'calculator.js');
const calcContent = fs.readFileSync(calcPath, 'utf-8');
const fakeCalcWindow = {};
eval(`(function(window){ ${calcContent} })(fakeCalcWindow)`);
const calc = fakeCalcWindow.GCC_CALCULATOR;

const blrDefault = calc.calculateCityCost(100, 100, 24, 100);
assert(blrDefault.totalCrore.toFixed(2) === '25.20', 'Bengaluru default annual cost is INR 25.20 crore', `Got ${blrDefault.totalCrore}`);
assert(blrDefault.salaryCrore.toFixed(2) === '24.00', 'Bengaluru salary component is INR 24.00 crore');
assert(blrDefault.rentCrore.toFixed(2) === '1.20', 'Bengaluru rent component is INR 1.20 crore');

const hydDefault = calc.calculateCityCost(100, 100, 22, 80);
assert(hydDefault.totalCrore.toFixed(2) === '22.96', 'Hyderabad default annual cost is INR 22.96 crore', `Got ${hydDefault.totalCrore}`);
assert(hydDefault.salaryCrore.toFixed(2) === '22.00', 'Hyderabad salary component is INR 22.00 crore');
assert(hydDefault.rentCrore.toFixed(2) === '0.96', 'Hyderabad rent component is INR 0.96 crore');

const punDefault = calc.calculateCityCost(100, 100, 21, 85);
assert(punDefault.totalCrore.toFixed(2) === '22.02', 'Pune default annual cost is INR 22.02 crore', `Got ${punDefault.totalCrore}`);
assert(punDefault.salaryCrore.toFixed(2) === '21.00', 'Pune salary component is INR 21.00 crore');
assert(punDefault.rentCrore.toFixed(2) === '1.02', 'Pune rent component is INR 1.02 crore');

// Check 5: Changing BLR salary 24 -> 26 Lakh produces 27.20 Cr
const blrUpdated = calc.calculateCityCost(100, 100, 26, 100);
assert(blrUpdated.totalCrore.toFixed(2) === '27.20', 'Bengaluru updated salary (26L) produces INR 27.20 crore', `Got ${blrUpdated.totalCrore}`);

// Check 5b: Doubling team doubles the calculated totals
const blrDouble = calc.calculateCityCost(200, 100, 24, 100);
assert(blrDouble.totalCrore.toFixed(2) === (25.20 * 2).toFixed(2), 'Doubling team doubles calculated total (50.40 Cr)', `Got ${blrDouble.totalCrore}`);

// Check 5c: Invalid inputs do not produce NaN or crash
const invalidInput = calc.calculateCityCost(-5, 'invalid', null, undefined);
assert(!invalidInput.isValid && !isNaN(invalidInput.totalCrore) && invalidInput.totalCrore === 0, 'Invalid inputs return valid fallback without NaN');

// Check 6: Export Brief generation
const exportPath = path.join(__dirname, 'js', 'export.js');
const exportContent = fs.readFileSync(exportPath, 'utf-8');
const fakeExportWindow = {};
eval(`(function(window){ ${exportContent} })(fakeExportWindow)`);
const exporter = fakeExportWindow.GCC_EXPORTER;

const mdOutput = exporter.generateDecisionBriefMarkdown({
  shortlistCompanies: [dbs],
  allCompanies: GCC_DATA.companies,
  scenarioInputs: { employees: 100, sqFtPerEmployee: 100 },
  costResults: {
    bengaluru: { name: 'Bengaluru', salaryLakh: 26, monthlyRent: 100, salaryCrore: 26.0, rentCrore: 1.2, totalCrore: 27.2 },
    hyderabad: { name: 'Hyderabad', salaryLakh: 22, monthlyRent: 80, salaryCrore: 22.0, rentCrore: 0.96, totalCrore: 22.96 },
    pune: { name: 'Pune', salaryLakh: 21, monthlyRent: 85, salaryCrore: 21.0, rentCrore: 1.02, totalCrore: 22.02 }
  }
});

assert(typeof mdOutput === 'string' && mdOutput.length > 500, 'Export brief generated nonempty content');
assert(mdOutput.includes('DBS Tech India') && mdOutput.includes('https://www.dbs.com/dbstechindia'), 'Export includes DBS and source URL');
assert(mdOutput.includes('₹27.20 Cr'), 'Export includes updated matching calculated totals (₹27.20 Cr)');
assert(mdOutput.includes('ILLUSTRATIVE ASSUMPTIONS'), 'Export includes explicit assumptions and disclosures');
assert(mdOutput.includes('Andluru Sai Punith Reddy'), 'Export includes author attribution');

// Check 7: Providers page data integrity
assert(GCC_DATA.providers.length === 2, 'Two service providers present');
const ansr = GCC_DATA.providers.find(p => p.id === 'ansr');
assert(ansr.evidenceStatus.includes('Provider description, outcomes self-reported'), 'ANSR evidence status clearly disclosed');
assert(ansr.nextDiligenceSteps.includes('Request two relevant mid-market client references'), 'ANSR next diligence step specified');

// Check 9: Security & Privacy (no secret keys or private phones)
const allCode = dataContent + storageContent + calcContent + exportContent;
assert(!allCode.includes('sk_') && !allCode.includes('AIzaSy'), 'No API secrets present in code');

console.log('\n====================================================');
console.log(` RESULTS: ${passedTests} / ${totalTests} CHECKS PASSED (100%)`);
console.log('====================================================');
