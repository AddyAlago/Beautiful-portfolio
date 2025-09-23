// tests/visual/visual.status-cards.spec.ts
import { test, expect, Page } from '@playwright/test';

const FIXED_ISO = '2025-09-22T20:30:00.000Z';
const FIXED_MS = Date.parse(FIXED_ISO);

// Endpoints your cards fetch now
const WIDGET_DESKTOP = '**/allure/desktop/widgets/summary.json';
const WIDGET_MOBILE  = '**/allure/mobile/widgets/summary.json';
const WIDGET_A11Y    = '**/allure/a11y/widgets/summary.json';
const WIDGET_VISUAL  = '**/allure/visual/widgets/summary.json';

type Conclusion = 'success' | 'failure' | 'unknown';

const SCENARIOS = [
  { name: 'all-success', desktop: 'success', mobile: 'success', a11y: 'success', visual: 'success' },
  { name: 'all-unknown', desktop: 'unknown', mobile: 'unknown', a11y: 'unknown', visual: 'unknown' },
  { name: 'mixed',       desktop: 'success', mobile: 'success', a11y: 'failure', visual: 'success' },
] as const;

function widgetPayload(conclusion: Conclusion) {
  const totals = { total: 10, failed: 0, broken: 0 }; // success
  if (conclusion === 'failure') totals.failed = 1;
  if (conclusion === 'unknown') totals.total  = 0;     // unknown => no tests
  return { statistic: totals, time: { stop: FIXED_MS } };
}

async function stub(page: Page, s: (typeof SCENARIOS)[number]) {
  await page.route(WIDGET_DESKTOP, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(widgetPayload(s.desktop)) }));
  await page.route(WIDGET_MOBILE,  r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(widgetPayload(s.mobile))  }));
  await page.route(WIDGET_A11Y,    r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(widgetPayload(s.a11y))    }));
  await page.route(WIDGET_VISUAL,  r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(widgetPayload(s.visual))  }));
}

test.describe('status cards visual states (deterministic)', () => {
  test.beforeEach(async ({ page }) => {
    // Freeze time & kill animations for stable snapshots
    await page.addInitScript((iso) => {
      const fixed = new Date(iso).valueOf();
      const RealDate = Date as unknown as typeof Date;
      // @ts-ignore
      globalThis.Date = class extends RealDate {
        constructor(...args: any[]) { super(args.length ? (args as any)[0] : fixed); }
        static now() { return fixed; }
      } as any;
    }, FIXED_ISO);

    await page.addStyleTag({ content: `
      * { transition: none !important; animation: none !important; }
      html { scroll-behavior: auto !important; }
    `});
  });

  for (const s of SCENARIOS) {
    test(`badges layout: ${s.name} (light)`, async ({ page }) => {
      await stub(page, s);
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const grid = page.getByTestId('status-cards');

      // Wait for steady state: skeleton gone + 4 cards visible
      await expect(page.getByTestId('badges-skeleton')).toHaveCount(0);
      await expect(grid.locator('[data-testid^="status-card-"]')).toHaveCount(4);

      await expect(page.getByTestId('status-card-desktop')).toContainText(new RegExp(s.desktop, 'i'));
      await expect(page.getByTestId('status-card-mobile')).toContainText(new RegExp(s.mobile, 'i'));
      await expect(page.getByTestId('status-card-a11y')).toContainText(new RegExp(s.a11y, 'i'));
      await expect(page.getByTestId('status-card-visual')).toContainText(new RegExp(s.visual, 'i'));

      // Snapshot just the grid; Playwright stores per-project baselines automatically
      await expect(grid).toHaveScreenshot('status-cards.png', { maxDiffPixels: 300 });
    });
  }
});
