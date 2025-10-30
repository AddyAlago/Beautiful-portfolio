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



# 🌐 Beautiful Portfolio — Custom QA & DevOps Enhanced Edition

This is my **personal portfolio site**, built to showcase my work as a **QA Engineering Leader and Automation Architect**.

Originally forked from the excellent [Beautiful React Tailwind Portfolio by Pedro Machado](https://github.com/machadop1407/beautiful-react-tailwind-portfolio), this project has been **heavily customized and expanded** to include:

* Modern **CI/CD**, **automated testing**, and **reporting** pipelines
* Deep integration with **Allure Dashboards**, **Playwright**, and **GitHub Actions**
* AI-driven Pull Request Comment Enhancements powered by OpenAI for contextual feedback
* An end-to-end demonstration of **modern QA engineering best practices**

---

## 🚀 Major Enhancements

### 🧬 Architecture & Design

* Refactored component structure for scalability and maintainability
* Added dynamic sections (Projects, Experience, Skills, Contact) sourced from JSON data
* Improved Lighthouse performance, accessibility, and SEO scores
* Implemented dark/light theme switching with persistent user preferences

### 🧪 Quality Engineering & Automation

* Integrated **Playwright E2E suites** for both **Desktop and Mobile** views
* Added **A11Y (Accessibility) testing** via **Axe Core** (this is here for completeness sake, I have not done the work to fix these errors on the site and this is largely out of the scope for this portfolio)
* Added **Visual Regression tests** for UI consistency across deployments
* Configured **Allure Reporting** with automatic artifact publishing to GitHub Pages
* Introduced **matrix builds** (desktop, mobile, visual, a11y) with reusable workflows

### ⚙️ CI/CD & Reporting

* Built **GitHub Actions pipelines** for:

  * Running all test suites in parallel
  * Aggregating and publishing **Allure reports**
  * Deploying preview builds for every pull request
  * Publishing live dashboards with dynamic status badges
* Allure aggregation now supports multiple repositories (including API test showcase)

### 🧮 Infrastructure & Tooling

* Optimized Docker and Node.js environments for faster cold-starts
* Configured **ESLint + Prettier** for consistent code quality
* Added **custom GitHub Pages routing** for SPA support
* Introduced **dynamic environment-based variables** for preview, staging, and production

---

## 📊 Testing & Quality Metrics

* **Unit / Integration:** Playwright Component Testing
* **E2E:** Playwright (Desktop + Mobile)
* **Accessibility:** Axe Core
* **Visual Testing:** Playwright Snapshots
* **API Validation:** External Allure aggregator linking API showcase results
* **Reporting:** Allure dashboards published automatically on merge

Each suite reports into a **unified Allure dashboard**, live at:
🔗 [addicuss.com/allure-dashboard](https://addicuss.com/allure-dashboard) *(replace with your actual URL)*

---

## 🧑‍💻 Tech Stack

* **Frontend:** React + Vite + Tailwind CSS
* **Testing:** Playwright + Axe + Allure + GitHub Actions
* **CI/CD:** GitHub Actions + Allure CLI + Firebase Hosting
* **Visualization:** Allure Reports + Dynamic Badges
* **Deployment:** Firebase + GitHub Pages

---

## 🏠 Project Lineage

> This project began as a fork of
> [**machadop1407/beautiful-react-tailwind-portfolio**](https://github.com/machadop1407/beautiful-react-tailwind-portfolio)
> and evolved into a full **Quality Engineering demonstration platform**, showcasing
> test automation frameworks, dashboards, and metrics-driven quality reporting.

All original design credit to **Pedro Machado** — this build focuses on expanding the project’s **QA, automation, and CI/CD** capabilities.

---

## 💡 Future Roadmap

* Add API contract and performance test results from `custom-api-testing-showcase` repo
* Add AI-powered “bug triage insights” section using OpenAI API
* Integrate custom Allure dashboards with JSON status endpoints
* Add downloadable résumé generator with live CI badges

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
