# Beautiful Portfolio
![Desktop tests](https://img.shields.io/endpoint?url=https://addyalago.github.io/Beautiful-portfolio/allure/desktop/widgets/summary.json&logo=allure&label=desktop%20tests)
![Mobile tests](https://img.shields.io/endpoint?url=https://addyalago.github.io/Beautiful-portfolio/allure/mobile/widgets/summary.json&logo=allure&label=mobile%20tests)
![A11Y tests](https://img.shields.io/endpoint?url=https://addyalago.github.io/Beautiful-portfolio/allure/a11y/widgets/summary.json&logo=allure&label=a11y)
![Visual tests](https://img.shields.io/endpoint?url=https://addyalago.github.io/Beautiful-portfolio/allure/visual/widgets/summary.json&logo=allure&label=visual)
![All suites](https://img.shields.io/endpoint?url=https://addyalago.github.io/Beautiful-portfolio/allure/combined/data/widgets/summary.json&logo=allure&label=all%20suites)



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
