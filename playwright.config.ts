// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// You can override these via env if you want different ports/commands:
//   PLAYWRIGHT_BASE_URL, PLAYWRIGHT_WEB_SERVER_CMD
const DEFAULT_DEV_URL = 'http://localhost:5173';

export default defineConfig({
  testDir: 'tests',

  // ✅ Base URL used by page.goto('/') across ALL projects
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || DEFAULT_DEV_URL,
    

    locale: 'en-US',           
    timezoneId: 'UTC',         
    colorScheme: 'light',      


    // NEW: Keep artifacts only when useful (less noise locally, richer on CI)
    screenshot: isCI ? 'only-on-failure' : 'off',     
    video:      isCI ? 'retain-on-failure' : 'off',   
    trace:      isCI ? 'retain-on-failure' : 'off',   

    // NEW: More stable rasterization in containers
    launchOptions: { args: ['--disable-dev-shm-usage', '--font-render-hinting=none'] }, // NEW
    // (optional) trace/screenshot/video defaults go here
  },



  // ✅ Start the app for tests. By default, use Vite dev on 5173.
  webServer: {
    command:
      process.env.PLAYWRIGHT_WEB_SERVER_CMD ||
      'npm run dev -- --port 5173',
    url: process.env.PLAYWRIGHT_BASE_URL || DEFAULT_DEV_URL,
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
    
  },

reporter: isCI
  ? [
      ['github'],
      ['html', { open: 'never', outputFolder: process.env.PLAYWRIGHT_HTML_DIR || 'playwright-report' }],
      ['allure-playwright', { resultsDir: process.env.ALLURE_RESULTS_DIR || 'allure-results', detail: true, suiteTitle: true }],
    ]
  : [
      ['list'],
      ['html', { open: 'never', outputFolder: process.env.PLAYWRIGHT_HTML_DIR || 'playwright-report' }],
      ['allure-playwright', { resultsDir: process.env.ALLURE_RESULTS_DIR || 'allure-results', detail: true, suiteTitle: true }],
    ],

    

  // ---- Projects strictly partitioned by path/suffix ----
  projects: [
    // Desktop E2E ONLY
    {
      name: 'Desktop E2E',
      testMatch: ['**/e2e/**/*.spec.ts'],
      testIgnore: ['**/a11y/**', '**/visual/**', '**/*.a11y.spec.ts', '**/*.visual.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },

    // Mobile E2E ONLY
    {
      name: 'Mobile E2E',
      testMatch: ['**/e2e/**/*.spec.ts'],
      testIgnore: ['**/a11y/**', '**/visual/**', '**/*.a11y.spec.ts', '**/*.visual.spec.ts'],
      use: { ...devices['Pixel 7'] },
    },

    // A11Y ONLY
    {
      name: 'A11Y',
      testMatch: ['**/a11y/**/*.spec.ts', '**/*.a11y.spec.ts'],
      testIgnore: ['**/visual/**'],
      use: { ...devices['Desktop Chrome'] },
    },

    // Visual ONLY
    {
      name: 'Visual Desktop',
      testMatch: ['**/visual/**/*.spec.ts', '**/*.visual.spec.ts'],
      testIgnore: ['**/a11y/**'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Visual Mobile',
      testMatch: ['**/visual/**/*.spec.ts', '**/*.visual.spec.ts'],
      testIgnore: ['**/a11y/**'],
      use: { ...devices['Pixel 7'] },
    },
  ],
});
