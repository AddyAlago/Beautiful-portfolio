import { test, expect, Page } from '@playwright/test';

const FIXED_ISO = '2025-09-22T20:30:00.000Z';

type Conclusion = 'success' | 'failure' | 'unknown';
type Scenario = {
  name: string;
  desktop: Conclusion;
  mobile: Conclusion;
  a11y: Conclusion;
};

const SCENARIOS: Scenario[] = [
  { name: 'all-success', desktop: 'success', mobile: 'success', a11y: 'success' },
  { name: 'all-unknown', desktop: 'unknown', mobile: 'unknown', a11y: 'unknown' },
  { name: 'mixed',       desktop: 'success', mobile: 'success', a11y: 'failure' },
];

function payloadFor(key: 'desktop'|'mobile'|'a11y', conclusion: Conclusion) {
  return {
    workflow: key,
    project: key === 'a11y' ? 'A11Y' : `E2E ${key[0].toUpperCase()}${key.slice(1)}`,
    conclusion,
    updatedAt: FIXED_ISO,
    sha: 'deadbeef',
    runId: '42',
    runNumber: 4242,
  };
}

async function stubStatuses(page: Page, s: Scenario) {
  await page.route('**/desktop/status.json', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payloadFor('desktop', s.desktop)) })
  );
  await page.route('**/mobile/status.json', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payloadFor('mobile', s.mobile)) })
  );
  await page.route('**/a11y/status.json', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payloadFor('a11y', s.a11y)) })
  );
}

test.describe('status cards visual states (deterministic)', () => {
  test.beforeEach(async ({ page }) => {
    // Freeze time + normalize locale formatting
    await page.addInitScript((fixedISO) => {
  const fixed = new Date(fixedISO).valueOf();

  // Save real Date
  const RealDate = Date;

  // Override global Date
  // @ts-ignore
  globalThis.Date = class {
    private readonly _date: InstanceType<typeof RealDate>;
    constructor(...args: any[]) {
      if (args.length) {
        this._date = new RealDate(...(args as [any]));
      } else {
        this._date = new RealDate(fixed);
      }
    }
    // delegate instance methods
    toString() { return this._date.toString(); }
    toISOString() { return this._date.toISOString(); }
    toLocaleString() { return this._date.toLocaleString(); }
    getTime() { return this._date.getTime(); }
    valueOf() { return this._date.valueOf(); }
    // add more methods if needed

    // static methods
    static now() { return fixed; }
    static UTC = RealDate.UTC;
    static parse = RealDate.parse;
  };
}, FIXED_ISO);

    // Kill animations/hover opacity differences + normalize text AA
    await page.addStyleTag({ content: `
      * { transition: none !important; animation: none !important; }
      .group:hover, .group:focus, a:hover { opacity: 1 !important; }
      html, body { -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision; }
    `});
  });

  for (const scenario of SCENARIOS) {
    test(`badges layout: ${scenario.name} (light, 1280px)`, async ({ page }) => {
      await stubStatuses(page, scenario);

      await page.emulateMedia({ colorScheme: 'light' });
      await page.setViewportSize({ width: 1280, height: 900 });

      await page.goto('/');

      // Ensure cards rendered with desired conclusions
      await expect(page.getByTestId('status-card-desktop')).toContainText(new RegExp(scenario.desktop, 'i'));
      await expect(page.getByTestId('status-card-mobile')).toContainText(new RegExp(scenario.mobile, 'i'));
      await expect(page.getByTestId('status-card-a11y')).toContainText(new RegExp(scenario.a11y, 'i'));

      // Snapshot just the grid (requires data-testid="status-cards" on the outer container)
      const grid = page.getByTestId('status-cards');

      await expect(grid).toHaveScreenshot({
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',    // helps reduce DPR AA diffs in Chromium
        // no filename → per-project baselines, avoids cross-browser mismatch
      });
    });
  }
});
