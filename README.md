# Beautiful Portfolio
<!-- Desktop -->
![desktop passed](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fdesktop%2Fwidgets%2Fsummary.json&query=%24.statistic.passed&label=desktop%20passed&logo=playwright)
![desktop failed](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fdesktop%2Fwidgets%2Fsummary.json&query=%24.statistic.failed&label=desktop%20failed&logo=playwright)
![desktop broken](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fdesktop%2Fwidgets%2Fsummary.json&query=%24.statistic.broken&label=desktop%20broken&logo=playwright)

<!-- Mobile -->
![mobile passed](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fmobile%2Fwidgets%2Fsummary.json&query=%24.statistic.passed&label=mobile%20passed&logo=playwright)
![mobile failed](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fmobile%2Fwidgets%2Fsummary.json&query=%24.statistic.failed&label=mobile%20failed&logo=playwright)
![mobile broken](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fmobile%2Fwidgets%2Fsummary.json&query=%24.statistic.broken&label=mobile%20broken&logo=playwright)

<!-- A11Y -->
![a11y passed](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fa11y%2Fwidgets%2Fsummary.json&query=%24.statistic.passed&label=a11y%20passed&logo=playwright)
![a11y failed](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fa11y%2Fwidgets%2Fsummary.json&query=%24.statistic.failed&label=a11y%20failed&logo=playwright)
![a11y broken](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fa11y%2Fwidgets%2Fsummary.json&query=%24.statistic.broken&label=a11y%20broken&logo=playwright)

<!-- Visual -->
![visual passed](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fvisual%2Fwidgets%2Fsummary.json&query=%24.statistic.passed&label=visual%20passed&logo=playwright)
![visual failed](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fvisual%2Fwidgets%2Fsummary.json&query=%24.statistic.failed&label=visual%20failed&logo=playwright)
![visual broken](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddyalago.github.io%2FBeautiful-portfolio%2Fallure%2Fvisual%2Fwidgets%2Fsummary.json&query=%24.statistic.broken&label=visual%20broken&logo=playwright)



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
