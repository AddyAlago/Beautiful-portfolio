// tests/visual/visual.status-cards.spec.ts
import { test, expect, Page } from '@playwright/test';

const FIXED_ISO = '2025-09-22T20:30:00.000Z';

type Conclusion = 'success' | 'failure' | 'unknown';
const SCENARIOS = [
  { name: 'all-success', desktop: 'success', mobile: 'success', a11y: 'success' },
  { name: 'all-unknown', desktop: 'unknown', mobile: 'unknown', a11y: 'unknown' },
  { name: 'mixed',       desktop: 'success', mobile: 'success', a11y: 'failure' },
] as const;

function payload(key: 'desktop'|'mobile'|'a11y', conclusion: Conclusion) {
  return {
    workflow: key, project: key === 'a11y' ? 'A11Y' : `E2E ${key[0].toUpperCase()}${key.slice(1)}`,
    conclusion, updatedAt: FIXED_ISO, sha: 'deadbeef', runId: '42', runNumber: 4242,
  };
}
async function stub(page: Page, s: (typeof SCENARIOS)[number]) {
  await page.route('**/desktop/status.json', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload('desktop', s.desktop)) }));
  await page.route('**/mobile/status.json',  r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload('mobile',  s.mobile))  }));
  await page.route('**/a11y/status.json',    r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload('a11y',    s.a11y))    }));
}

test.describe('status cards visual states (deterministic)', () => {
  test.beforeEach(async ({ page }) => {
    // freeze time & kill animations (you already had this)
    await page.addInitScript((iso) => {
      const fixed = new Date(iso).valueOf();
      const RealDate = Date;
      // @ts-ignore
      globalThis.Date = class {
        _d: InstanceType<typeof RealDate>;
        constructor(...args: any[]) { this._d = args.length ? new RealDate(...args as [any]) : new RealDate(fixed); }
        toString(){return this._d.toString()} toISOString(){return this._d.toISOString()} toLocaleString(){return this._d.toLocaleString()}
        getTime(){return this._d.getTime()} valueOf(){return this._d.valueOf()}
        static now(){return fixed} static UTC=RealDate.UTC; static parse=RealDate.parse;
      };
    }, FIXED_ISO);
    await page.addStyleTag({ content: `*{transition:none!important;animation:none!important}` });
  });

  for (const s of SCENARIOS) {
    test(`badges layout: ${s.name} (light)`, async ({ page }) => {
      await stub(page, s);
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Wait for steady state: skeleton gone + 3 cards visible with expected text
      const grid = page.getByTestId('status-cards');
      await expect(page.getByTestId('badges-skeleton')).toHaveCount(0);
      await expect(grid.locator('[data-testid^="status-card-"]')).toHaveCount(3);
      await expect(page.getByTestId('status-card-desktop')).toContainText(new RegExp(s.desktop, 'i'));
      await expect(page.getByTestId('status-card-mobile')).toContainText(new RegExp(s.mobile, 'i'));
      await expect(page.getByTestId('status-card-a11y')).toContainText(new RegExp(s.a11y, 'i'));

      await expect(grid).toHaveScreenshot({ maxDiffPixels: 300 });
    });
  }
});
