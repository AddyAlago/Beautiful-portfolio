// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: 'tests/e2e/specs',
  fullyParallel: true,
  timeout: 30_000,

  // Better defaults per environment
  retries: isCI ? 2 : 0,
  forbidOnly: isCI,

  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]] // nice PR annotations in CI
    : [['list'], ['html', { open: 'never' }]],

  use: {
    // Allow overriding to hit a deployed site when desired
    baseURL:
      process.env.BASE_URL ||
      (isCI ? 'http://127.0.0.1:4173' : 'http://127.0.0.1:5173'),
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
 
  },

  // Start a real server for tests
  webServer: isCI
    ? {
        command: 'npm run build && npm run preview -- --port=4173 --host', // Vite preview
        url: 'http://127.0.0.1:4173',
        timeout: 120_000,
        reuseExistingServer: false,
      }
    : {
        // Strict port avoids Vite “bumping” the port and breaking baseURL
        command: 'npm run dev -- --port=5173 --strictPort',
        url: 'http://127.0.0.1:5173',
        timeout: 120_000,
        reuseExistingServer: true,
      },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    // for future
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
