import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173', // Set the base URL for your tests
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev', // or 'vite' if you're using it directly
    port: 5173,              // default Vite port; change if needed
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,

  },
});