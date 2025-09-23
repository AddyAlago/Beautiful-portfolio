// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';


const isCI = !!process.env.CI;
const DEV_HOST = '127.0.0.1';
const DEV_PORT = 5173;
const PREVIEW_HOST = '127.0.0.1';
const PREVIEW_PORT = 4173;
const visualUse = {
  // Deterministic knobs for screenshots
  locale: 'en-US',
  timezoneId: 'UTC',
  colorScheme: 'light' as const,   
  animations: 'disabled' as const, 
};

export default defineConfig({
  testDir: 'tests',
    testMatch: [
    '**/e2e/**/*.spec.ts',
    '**/visual/**/*.spec.ts',
    '**/a11y/**/*.spec.ts',
  ],
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
    // === Visual projects (mobile + desktop) ===
  {
    name: 'visual-mobile',
    testMatch: ['tests/visual/**/*.spec.ts'],
    use: {
      ...devices['iPhone 12'],
      deviceScaleFactor: 3,
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      ...visualUse,
    },
  },
  {
    name: 'visual-desktop',
    testMatch: ['tests/visual/**/*.spec.ts'],
    use: {
      ...devices['Desktop Chrome'],
      viewport: { width: 1280, height: 800 },
      ...visualUse,
    },
  },

  {
    name: 'Desktop Chrome',
    use: { ...devices['Desktop Chrome'] },
    testMatch: ['**/*.spec.ts', '!**/*.a11y.spec.ts'],
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 13'] },
    testMatch: ['**/*.spec.ts', '!**/*.a11y.spec.ts'],
  },
  {
    name: 'A11Y',
    use: { ...devices['Desktop Chrome'] },
    testMatch: ['**/*a11y.spec.ts'],
  },
]

});
