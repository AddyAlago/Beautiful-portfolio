// tests/e2e/specs/resilience.badges.spec.ts
import { test, expect } from '@playwright/test';

const WIDGET_DESKTOP = '**/allure/desktop/widgets/summary.json';
const WIDGET_MOBILE  = '**/allure/mobile/widgets/summary.json';
const WIDGET_A11Y    = '**/allure/a11y/widgets/summary.json';
// If your component also shows Visual, add this:
// const WIDGET_VISUAL  = '**/allure/visual/widgets/summary.json';

test('badges gracefully handle fetch failure', async ({ page }) => {
  // Abort widget endpoints → component shows "unknown" and "—"
  await page.route(WIDGET_DESKTOP, r => r.abort());
  await page.route(WIDGET_MOBILE,  r => r.abort());
  await page.route(WIDGET_A11Y,    r => r.abort());
  // If you render a Visual card, abort that too:
  // await page.route(WIDGET_VISUAL,  r => r.abort());

  await page.goto('/');

  await expect(page.getByTestId('status-card-desktop')).toContainText(/unknown|—/i);
  await expect(page.getByTestId('status-card-mobile')).toContainText(/unknown|—/i);
  await expect(page.getByTestId('status-card-a11y')).toContainText(/unknown|—/i);
  // If visual exists:
  // await expect(page.getByTestId('status-card-visual')).toContainText(/unknown|—/i);
});

test('badges show skeleton during slow fetch, then render cards', async ({ page }) => {
  const FIXED_ISO = '2025-09-22T20:30:00.000Z';
  const FIXED_MS  = Date.parse(FIXED_ISO);

  // Helper: Allure widget summary payload
  const widget = (total: number, failed = 0, broken = 0) => ({
    statistic: { total, failed, broken },
    time: { stop: FIXED_MS },
  });

  // Delay each widget request so the skeleton appears first
  await page.route(WIDGET_DESKTOP, async r => {
    await page.waitForTimeout(800);
    await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(widget(10, 0, 0)) }); // success
  });
  await page.route(WIDGET_MOBILE, async r => {
    await page.waitForTimeout(900);
    await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(widget(8, 0, 0)) }); // success
  });
  await page.route(WIDGET_A11Y, async r => {
    await page.waitForTimeout(1000);
    await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(widget(7, 1, 0)) }); // failure
  });
  // If visual exists, you can add a handler here too.

  await page.goto('/');

  // Skeleton visible before any data lands
  await expect(page.getByTestId('badges-skeleton')).toBeVisible();

  // After routes fulfill, real cards render…
  await expect(page.getByTestId('status-card-desktop')).toBeVisible();
  await expect(page.getByTestId('status-card-mobile')).toBeVisible();
  await expect(page.getByTestId('status-card-a11y')).toBeVisible();
  // If visual exists:
  // await expect(page.getByTestId('status-card-visual')).toBeVisible();

  // …and skeleton disappears
  await expect(page.getByTestId('badges-skeleton')).toHaveCount(0);

  // Optional: assert the conclusions (avoid asserting the localized timestamp)
  await expect(page.getByTestId('status-card-desktop')).toContainText(/success/i);
  await expect(page.getByTestId('status-card-mobile')).toContainText(/success/i);
  await expect(page.getByTestId('status-card-a11y')).toContainText(/failure/i);
});
