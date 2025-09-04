import { Page, Locator, expect } from '@playwright/test';
import { isInViewportRange, InViewportOpts } from '../utils/viewport';

export class HomePage {
  readonly page: Page;
  readonly html: Locator;
  readonly viewWorkBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.html = page.locator('html');
    this.viewWorkBtn = page.getByTestId('button-view-work');
  }

  async open() {
    await this.page.goto('/');
  }

  async clickViewWork() {
    await this.viewWorkBtn.click();
  }

  async toggleTheme() {
    await this.page.getByTestId('theme-toggle').click();
  }

  async getTopSectionTestId(): Promise<string | null> {
    return await this.page.evaluate(() => {
      const sections = Array.from(
        document.querySelectorAll('[data-testid^="section-"]')
      ) as HTMLElement[];
      if (!sections.length) return null;

      const visible = sections
        .map(el => ({ id: el.getAttribute('data-testid'), top: el.getBoundingClientRect().top }))
        .filter(x => x.id && x.top >= 0 && x.top <= window.innerHeight);

      if (!visible.length) return null;
      return visible.sort((a, b) => a.top - b.top)[0].id!;
    });
  }

  async expectTitle() {
    await expect(this.page).toHaveTitle(/Addy Alago's Portfolio/);
  }

  /**
   * Assert that a section (by data-testid) is within a viewport band.
   */
  async expectSectionInViewport(sectionTestId: string, opts: InViewportOpts = {}) {
    const section = this.page.getByTestId(sectionTestId);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(75); // help smooth-scroll settle
    const inBand = await isInViewportRange(section, opts);
    expect(inBand, `Expected ${sectionTestId} to be in viewport`).toBe(true);
  }
}
