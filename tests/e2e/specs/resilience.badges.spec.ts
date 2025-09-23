// tests/e2e/specs/resilience.badges.spec.ts
import { test, expect } from '@playwright/test';

test('badges gracefully handle fetch failure', async ({ page }) => {
  // Abort all three status endpoints → component falls back to "unknown" + "—"
  await page.route('**/desktop/status.json', r => r.abort());
  await page.route('**/mobile/status.json',  r => r.abort());
  await page.route('**/a11y/status.json',    r => r.abort());

  await page.goto('/');

  await expect(page.getByTestId('status-card-desktop')).toContainText(/unknown|—/i);
  await expect(page.getByTestId('status-card-mobile')).toContainText(/unknown|—/i);
  await expect(page.getByTestId('status-card-a11y')).toContainText(/unknown|—/i);
});

test('badges show skeleton during slow fetch, then render cards', async ({ page }) => {
  const FIXED_ISO = '2025-09-22T20:30:00.000Z';

  // Helper to fulfill with stable payloads after a delay
  const fulfill = (key: 'desktop'|'mobile'|'a11y', conclusion: 'success'|'failure') => ({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      workflow: key,
      project: key === 'a11y' ? 'A11Y' : `E2E ${key}`,
      conclusion,
      updatedAt: FIXED_ISO,
      sha: 'deadbeef',
      runId: '1',
      runNumber: 1,
    }),
  });

  // Delay each status.json call so skeleton should appear first
  await page.route('**/desktop/status.json', async r => {
    await page.waitForTimeout(1000);
    await r.fulfill(fulfill('desktop', 'success'));
  });
  await page.route('**/mobile/status.json', async r => {
    await page.waitForTimeout(1000);
    await r.fulfill(fulfill('mobile', 'success'));
  });
  await page.route('**/a11y/status.json', async r => {
    await page.waitForTimeout(1000);
    await r.fulfill(fulfill('a11y', 'failure'));
  });

  await page.goto('/');

  // Skeleton visible before any data lands
  await expect(page.getByTestId('badges-skeleton')).toBeVisible();

  // After routes fulfill, real cards render…
  await expect(page.getByTestId('status-card-desktop')).toBeVisible();
  await expect(page.getByTestId('status-card-mobile')).toBeVisible();
  await expect(page.getByTestId('status-card-a11y')).toBeVisible();

  // …and skeleton disappears
  await expect(page.getByTestId('badges-skeleton')).toHaveCount(0);
});
