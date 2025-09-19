import { Locator, Page, expect } from '@playwright/test';

export type ScrollOpts = {
  header?: Locator;             // sticky header
  block?: ScrollLogicalPosition; // 'start'|'center'|'end'|'nearest'
  settleMs?: number;            // tiny pause after scroll
};

export async function scrollIntoViewInstant(
  page: Page,
  target: Locator,
  opts: ScrollOpts = {}
) {
  const { header, block = 'start', settleMs = 50 } = opts;

  // Measure header height (0 if not present/fixed)
  const headerPx = header
    ? await header.evaluate((el) => {
        const style = window.getComputedStyle(el as Element);
        const isFixed = style.position === 'fixed' || style.position === 'sticky';
        const rect = (el as Element).getBoundingClientRect();
        // Treat sticky as fixed when stuck
        return isFixed ? rect.height : 0;
      })
    : 0;

  await target.waitFor({ state: 'attached' });

  // Instant native scroll
  await target.evaluate((el, b) => {
    if (el instanceof HTMLElement) el.scrollIntoView({ behavior: 'instant', block: b as ScrollLogicalPosition });
    else el.scrollIntoView();
  }, block);

  // Compensate header occlusion by nudging window up
  if (headerPx > 0) {
    await page.evaluate((px) => window.scrollBy({ top: -px, behavior: 'auto' }), headerPx);
  }

  // Let layout settle a tick
  if (settleMs > 0) await page.waitForTimeout(settleMs);
}

/** Assert the element's top is within [offsetPx - tol, offsetPx + tol] from viewport top. */
export async function expectTopNearViewport(
  locator: Locator,
  offsetPx: number,
  tol = 12
) {
  const top = await locator.evaluate((el) => (el as Element).getBoundingClientRect().top);
  expect(Math.abs(top - offsetPx)).toBeLessThanOrEqual(tol);
}