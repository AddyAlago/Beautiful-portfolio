import { Page } from '@playwright/test';


export async function isElementInViewportRange(
  page: Page,
  selector: string,
  minTop: number,
  maxTop: number,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    ({ sel, minT, maxT }) => {
      const el = document.querySelector(sel);
      if (!el) {
        console.warn(`[isElementInViewportRange] Element not found: ${sel}`);
        return false;
      }

      const rect = el.getBoundingClientRect();

      const isVisible =
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight;

      const isInRange = rect.top >= minT && rect.top <= maxT;

      console.log(`[isElementInViewportRange] ${sel}: top=${rect.top.toFixed(2)}, visible=${isVisible}, inRange=${isInRange}`);

      return isVisible && isInRange;
    },
    { sel: selector, minT: minTop, maxT: maxTop },
    { timeout }
  );
}