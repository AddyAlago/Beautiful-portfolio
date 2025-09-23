// visual.home.spec.ts
import { test, expect } from '@playwright/test';

const widths = [390, 768, 1280] as const;
const themes = ['light', 'dark'] as const;

for (const theme of themes) {
  for (const width of widths) {
    test(`home visual ${theme} ${width}px`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      const hero = page.getByTestId('section-home');

      // Let Playwright name snapshots per project automatically
      await expect(hero).toHaveScreenshot({
        animations: 'disabled',
        caret: 'hide',
        maxDiffPixels: 300,
        mask: [page.getByTestId('status-cards')], // hide volatile tiles
        });
    });
  }
}
