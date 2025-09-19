import { test, expect } from '@playwright/test';

test('home first contentful paint under 2.5s on cold load (CI env)', async ({ page }) => {
  await page.goto('/');
  const perf = await page.evaluate(() => JSON.stringify(performance.getEntriesByType('navigation')[0]));
  const nav = JSON.parse(perf);
  // crude proxy for FCP when no lighthouse: domContentLoadedEventEnd
  expect(nav.domContentLoadedEventEnd).toBeLessThan(2500);
});
