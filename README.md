# Beautiful Portfolio

[![E2E Desktop](https://img.shields.io/github/actions/workflow/status/AddyAlago/Beautiful-portfolio/e2e-desktop.yml?branch=main&label=E2E%20Desktop)](https://addyalago.github.io/Beautiful-portfolio)
[![E2E Mobile](https://img.shields.io/github/actions/workflow/status/AddyAlago/Beautiful-portfolio/e2e-mobile.yml?branch=main&label=E2E%20Mobile)](https://addyalago.github.io/Beautiful-portfolio)
[![A11Y Tests](https://github.com/AddyAlago/Beautiful-portfolio/actions/workflows/a11y.yml/badge.svg?branch=main)](https://addyalago.github.io/Beautiful-portfolio)


A modern React + Tailwind portfolio site with **production-grade automated testing**.

---

## 🚀 Quality Automation

This project isn’t just a portfolio — it’s a demonstration of my QA engineering philosophy:

- ✅ **Playwright E2E tests** covering navigation, section visibility, and contact form.
- ✅ **Accessibility checks (axe-core)** against WCAG 2A/AA, with JSON reports uploaded to CI.
- ✅ **Performance guardrails** to prevent regressions in page load.
- ✅ **CI/CD integration** with GitHub Actions:
  - Runs tests on every push and pull request.
  - Uploads Playwright reports (HTML, traces, screenshots).
  - Publishes `axe-report.json` when accessibility violations are detected.

---

## 📊 Test Status Badge

The badge above shows the **live status** of my end-to-end test suite:

- 🟢 Green = all tests passing  
- 🔴 Red = failing tests (check Actions tab for details)

---

## 🧪 Running Tests Locally

```bash
# install dependencies
npm ci
# install browsers
npx playwright install --with-deps
# run all tests
npm test
# open the UI mode for debugging
npx playwright test --ui
