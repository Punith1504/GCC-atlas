// GCC Atlas - Deterministic Location Cost Scenario Calculator
// Formula:
//   Salary Total (Cr) = (employees * annualSalaryLakh) / 100
//   Rent Total (Cr)   = (employees * sqFtPerEmployee * monthlyRent * 12) / 10,000,000
//   Total Annual Cost = Salary Total + Rent Total

(function (window) {
  'use strict';

  const DEFAULTS = {
    employees: 100,
    sqFtPerEmployee: 100,
    cities: {
      bengaluru: {
        salaryLakh: 24,
        monthlyRent: 100
      },
      hyderabad: {
        salaryLakh: 22,
        monthlyRent: 80
      },
      pune: {
        salaryLakh: 21,
        monthlyRent: 85
      }
    }
  };

  function sanitizeNumber(val, fallback = 0) {
    if (val === null || val === undefined || val === '') return null;
    const num = Number(val);
    if (isNaN(num) || !isFinite(num) || num < 0) return null;
    return num;
  }

  function calculateCityCost(employees, sqFtPerEmployee, salaryLakh, monthlyRent) {
    const e = sanitizeNumber(employees, 0);
    const sqFt = sanitizeNumber(sqFtPerEmployee, 0);
    const sal = sanitizeNumber(salaryLakh, 0);
    const rent = sanitizeNumber(monthlyRent, 0);

    if (e === null || sqFt === null || sal === null || rent === null) {
      return {
        isValid: false,
        salaryCrore: 0,
        rentCrore: 0,
        totalCrore: 0,
        error: 'Please enter valid positive numbers for all parameters.'
      };
    }

    // Salary: employees * (Lakh / 100) -> Crore
    const salaryCrore = (e * sal) / 100;

    // Rent: employees * sqFtPerEmployee * monthlyRent * 12 months / 10,000,000 (INR 1 Crore = 10^7 INR)
    const annualRentInr = e * sqFt * rent * 12;
    const rentCrore = annualRentInr / 10000000;

    const totalCrore = salaryCrore + rentCrore;

    return {
      isValid: true,
      employees: e,
      sqFtPerEmployee: sqFt,
      totalAreaSqFt: e * sqFt,
      salaryLakh: sal,
      monthlyRent: rent,
      salaryCrore,
      rentCrore,
      totalCrore
    };
  }

  function formatCrore(num) {
    if (num === null || num === undefined || isNaN(num)) return '₹0.00 Cr';
    return `₹${num.toFixed(2)} Cr`;
  }

  function formatLakh(num) {
    if (num === null || num === undefined || isNaN(num)) return '₹0.00 Lakh';
    return `₹${num.toFixed(1)} Lakh`;
  }

  function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('en-IN').format(num);
  }

  window.GCC_CALCULATOR = {
    DEFAULTS,
    sanitizeNumber,
    calculateCityCost,
    formatCrore,
    formatLakh,
    formatNumber
  };
})(window);
