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
  const json = (obj: any) => ({ status: 200, contentType: 'application/json', body: JSON.stringify(obj) });
  await page.route(WIDGET_DESKTOP, r => r.fulfill(json(widgetPayload(s.desktop))));
  await page.route(WIDGET_MOBILE,  r => r.fulfill(json(widgetPayload(s.mobile))));
  await page.route(WIDGET_A11Y,    r => r.fulfill(json(widgetPayload(s.a11y))));
  await page.route(WIDGET_VISUAL,  r => r.fulfill(json(widgetPayload(s.visual))));
}

// --- Visual-stabilizing CSS (fonts + no motion) ---
const VISUAL_CSS = `
html,body { background:#fff !important; }
*,*::before,*::after { transition:none !important; animation:none !important; }
* { font-family: "DejaVu Sans","Liberation Sans", Arial, sans-serif !important; }
body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
`;

test.describe('status cards visual states (deterministic)', () => {
  test.beforeEach(async ({ page }) => {
    // Freeze time & rAF/perf so paint is deterministic
    await page.addInitScript((iso: string) => {
      const fixed = new Date(iso).valueOf();
      const RealDate = Date as unknown as typeof Date;
      // @ts-ignore
      globalThis.Date = class extends RealDate {
        constructor(...args: any[]) { super(args.length ? (args as any)[0] : fixed); }
        static now() { return fixed; }
      } as any;
      const fixedNow = fixed / 1000;
      // @ts-ignore
      performance.now = () => fixedNow;
      // @ts-ignore
      requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(fixedNow), 16) as any;
    }, FIXED_ISO);

    // Block externals that can render differently on CI
    await page.route('**/fonts.googleapis.com/**', r => r.fulfill({ status: 204, body: '' }));
    await page.route('**/fonts.gstatic.com/**',  r => r.fulfill({ status: 204, body: '' }));
    await page.route('**/img.shields.io/**',     r => r.fulfill({ status: 204, body: '' }));

    // Stabilize CSS (system fonts, no motion)
    await page.addStyleTag({ content: VISUAL_CSS });
  });

  for (const s of SCENARIOS) {
    test(`badges layout: ${s.name} (light)`, async ({ page }) => {
      await stub(page, s);
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/');

      // Wait for deterministic steady state
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => (document as any).fonts?.ready);

      const grid = page.getByTestId('status-cards');

      // Skeleton gone + all 4 cards rendered
      await expect(page.getByTestId('badges-skeleton')).toHaveCount(0);
      await expect(grid.locator('[data-testid^="status-card-"]')).toHaveCount(4);

      // Text assertions (sanity)
      await expect(page.getByTestId('status-card-desktop')).toContainText(new RegExp(s.desktop, 'i'));
      await expect(page.getByTestId('status-card-mobile')).toContainText(new RegExp(s.mobile, 'i'));
      await expect(page.getByTestId('status-card-a11y')).toContainText(new RegExp(s.a11y, 'i'));
      await expect(page.getByTestId('status-card-visual')).toContainText(new RegExp(s.visual, 'i'));

      // Mask tiny volatile bits (icons/images), if any
      const mask = [
        page.locator('[data-testid="status-badge"] img'),
      ];

      // Snapshot just the grid; use ratio (CI drift was ~0.02–0.03)
      await expect(grid).toHaveScreenshot('status-cards.png', {
        animations: 'disabled',
        mask,
        maxDiffPixelRatio: 0.035, // start here; tighten to 0.02 after it stabilizes
      });
    });
  }
});
