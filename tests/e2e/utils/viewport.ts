import { Locator } from '@playwright/test';

export type InViewportOpts = {
  /** Acceptable top position range in percent of viewport height (default: [0, 60]) */
  topPct?: [number, number];
};

/**
 * Returns true if the element's top edge sits within the given viewport band.
 */
export async function isInViewportRange(
  locator: Locator,
  opts: InViewportOpts = {}
): Promise<boolean> {
  const [min, max] = opts.topPct ?? [0, 60];

  // Ensure the node exists before evaluating
  await locator.waitFor({ state: 'attached' });

  return await locator.evaluate(
    (el: Element, args: { min: number; max: number }) => {
      // Narrow type: only run on HTMLElement
      if (!(el instanceof HTMLElement)) return false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const topPct = (rect.top / vh) * 100;
      return topPct >= args.min && topPct <= args.max;
    },
    { min, max }
  );
}
