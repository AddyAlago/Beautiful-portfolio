// tests/visual/visual.home.spec.ts
import { test, expect } from '@playwright/test';

const DESKTOP_WIDTHS = [768, 1280] as const;
const MOBILE_WIDTHS = [390] as const;
const themes = ['light', 'dark'] as const;

for (const theme of themes) {
  test.describe(`home visual (${theme})`, () => {
    test(`mobile`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      // DO NOT setViewportSize on Mobile Safari project – use device default.
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const hero = page.getByTestId('section-home');
      await expect(hero).toBeVisible();

      // mask only if present
      const badges = page.getByTestId('status-cards');
      const mask = (await badges.count()) ? [badges] : [];

      await expect(hero).toHaveScreenshot({ mask, maxDiffPixels: 300 });
    });

    for (const width of DESKTOP_WIDTHS) {
      test(`desktop ${width}px`, async ({ page }) => {
        // This test is meaningful on desktop-like projects (e.g., Desktop Chrome)
        test.skip(test.info().project.name.includes('Mobile'), 'Skip wide widths on mobile project');

        await page.emulateMedia({ colorScheme: theme });
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const hero = page.getByTestId('section-home');
        const badges = hero.getByTestId('status-cards');
        const mask = (await badges.count()) ? [badges] : [];

        await expect(hero).toHaveScreenshot({ mask, maxDiffPixels: 300 });
      });
    }
  });
}
