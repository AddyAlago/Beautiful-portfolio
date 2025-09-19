// tests/e2e/matchers/toBeNearTop.ts
import { expect } from '@playwright/test';

expect.extend({
  async toBeNearTop(locator: any, { offsetPx = 0, tol = 12 } = {}) {
    const top = await locator.evaluate((el: Element) => el.getBoundingClientRect().top);
    const pass = Math.abs(top - offsetPx) <= tol;
    return {
      pass,
      message: () => `expected element top=${top.toFixed(2)}px to be within ${tol}px of ${offsetPx}px`,
    };
  },
});

export { expect }; // re-export patched expect
