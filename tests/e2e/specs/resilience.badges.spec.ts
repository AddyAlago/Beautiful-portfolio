// tests/e2e/specs/resilience.badges.spec.ts
import { test, expect } from '@playwright/test';

const WIDGET_DESKTOP = '**/allure/desktop/widgets/summary.json';
const WIDGET_MOBILE  = '**/allure/mobile/widgets/summary.json';
const WIDGET_A11Y    = '**/allure/a11y/widgets/summary.json';
const WIDGET_VISUAL  = '**/allure/visual/widgets/summary.json';

const json = (obj: unknown) => ({
  status: 200,
  contentType: 'application/json',
  headers: { 'cache-control': 'no-store' },
  body: JSON.stringify(obj),
});

test.beforeEach(async ({ page }) => {
  // Freeze time across tests (helps if UI renders relative timestamps)
  const FIXED_MS = Date.parse('2025-09-22T20:30:00.000Z');
  await page.addInitScript(ms => {
    const fixed = ms;
    // @ts-ignore
    Date.now = () => fixed;
  }, FIXED_MS);

  // Block external badge/image hosts that can cause decode/layout jitter
  for (const pat of ['**/img.shields.io/**', '**/raw.githubusercontent.com/**']) {
    await page.route(pat, r => r.fulfill({ status: 204, body: '' }));
  }
});

test('badges gracefully handle fetch failure', async ({ page }) => {
  // Abort all widget endpoints → component shows "unknown" and "—"
  await page.route(WIDGET_DESKTOP, r => r.abort());
  await page.route(WIDGET_MOBILE,  r => r.abort());
  await page.route(WIDGET_A11Y,    r => r.abort());
  await page.route(WIDGET_VISUAL,  r => r.abort());

  await page.goto('/');

  await expect(page.getByTestId('status-card-desktop')).toContainText(/unknown|—/i);
  await expect(page.getByTestId('status-card-mobile')).toContainText(/unknown|—/i);
  await expect(page.getByTestId('status-card-a11y')).toContainText(/unknown|—/i);
  await expect(page.getByTestId('status-card-visual')).toContainText(/unknown|—/i);
});

test('badges show skeleton during slow fetch, then render all four cards', async ({ page }) => {
  const FIXED_MS  = Date.parse('2025-09-22T20:30:00.000Z');
  const widget = (total: number, failed = 0, broken = 0) => ({
    statistic: { total, failed, broken },
    time: { stop: FIXED_MS },
  });

  // Delayed responses so the skeleton appears first
  await page.route(WIDGET_DESKTOP, async r => {
    await page.waitForTimeout(800);
    await r.fulfill(json(widget(10, 0, 0))); // success
  });
  await page.route(WIDGET_MOBILE, async r => {
    await page.waitForTimeout(900);
    await r.fulfill(json(widget(8, 0, 0))); // success
  });
  await page.route(WIDGET_VISUAL, async r => {
    await page.waitForTimeout(950);
    await r.fulfill(json(widget(12, 0, 0))); // success
  });
  await page.route(WIDGET_A11Y, async r => {
    await page.waitForTimeout(1000);
    await r.fulfill(json(widget(7, 1, 0))); // failure
  });

  await page.goto('/');

  // Skeleton visible before any data lands
  await expect(page.getByTestId('badges-skeleton')).toBeVisible();

  // After routes fulfill, all four cards render…
  await expect(page.getByTestId('status-card-desktop')).toBeVisible();
  await expect(page.getByTestId('status-card-mobile')).toBeVisible();
  await expect(page.getByTestId('status-card-visual')).toBeVisible();
  await expect(page.getByTestId('status-card-a11y')).toBeVisible();

  // …and skeleton disappears (hidden or removed; choose the one matching your impl)
  await expect(page.getByTestId('badges-skeleton')).toBeHidden();
  // Or, if you remove it from the DOM:
  // await expect(page.getByTestId('badges-skeleton')).toHaveCount(0);

  // Assert outcomes (avoid localized timestamp assertions)
  await expect(page.getByTestId('status-card-desktop')).toContainText(/success/i);
  await expect(page.getByTestId('status-card-mobile')).toContainText(/success/i);
  await expect(page.getByTestId('status-card-visual')).toContainText(/success/i);
  await expect(page.getByTestId('status-card-a11y')).toContainText(/failure/i);
});
