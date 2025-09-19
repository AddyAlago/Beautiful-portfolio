// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: 'tests/e2e/specs',
  fullyParallel: true,
  timeout: 30_000,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: isCI ? 'http://127.0.0.1:4173' : 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: isCI
    ? {
        command: 'npm run build && npm run preview -- --port=4173 --host',
        url: 'http://127.0.0.1:4173',
        timeout: 120_000,
        reuseExistingServer: false,
      }
    : {
        command: 'npm run dev -- --port=5173',
        url: 'http://127.0.0.1:5173',
        timeout: 120_000,
        reuseExistingServer: true,
      },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
