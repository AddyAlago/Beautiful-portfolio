// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const DEV_HOST = '127.0.0.1';
const DEV_PORT = 5173;
const PREVIEW_HOST = '127.0.0.1';
const PREVIEW_PORT = 4173;

export default defineConfig({
  testDir: 'tests/e2e/specs',
  fullyParallel: true,
  timeout: 30_000,
  retries: isCI ? 2 : 0,
  forbidOnly: isCI,
  reporter: isCI
    ? [
        ['github'],
        ['html', { open: 'never' }],
        ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: true }],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
        ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: true }],
      ],
  use: {
    baseURL:
      process.env.BASE_URL ||
      (isCI
        ? `http://${PREVIEW_HOST}:${PREVIEW_PORT}`
        : `http://${DEV_HOST}:${DEV_PORT}`),
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : (isCI
        ? {
            // Preview uses a fixed host & port
            command: `npm run build && npm run preview -- --port=${PREVIEW_PORT} --host ${PREVIEW_HOST}`,
            url: `http://${PREVIEW_HOST}:${PREVIEW_PORT}`,
            timeout: 180_000,
            reuseExistingServer: false,
          }
        : {
            // Dev must match the URL host/port exactly
            command: `npm run dev -- --port=${DEV_PORT} --host ${DEV_HOST} --strictPort`,
            url: `http://${DEV_HOST}:${DEV_PORT}`,
            timeout: 180_000,
            reuseExistingServer: true,
          }),
  projects: [
  {
    name: 'Desktop Chrome',
    use: { ...devices['Desktop Chrome'] },
    grepInvert: /@a11y/,     // exclude a11y tests from Desktop
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 13'] },
    grepInvert: /@a11y/,     // exclude a11y tests from Mobile
  },
  {
    name: 'A11Y',
    use: { ...devices['Desktop Chrome'] },
    grep: /@a11y/,           // run only a11y tests here
  },
],
});
