// tests/e2e/pages/HomePage.ts
import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly header: Locator;
  readonly contactForm: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header / nav
    this.header = page.getByTestId('site-header');

    // Contact form + submit button
    this.contactForm = page.getByTestId('contact-form');
    this.submit = page.getByRole('button', { name: /send|submit/i });
  }

  // Nav item by testid (preferred)
  navItem(id: string): Locator {
    return this.page.getByTestId(`nav-${id}`);
  }

  // Section by testid (preferred)
  section(id: string): Locator {
    return this.page.getByTestId(`section-${id}`);
  }

  // Generic input getter by name attr
  input(name: string): Locator {
    return this.page.locator(`[name="${name}"]`);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async clickNav(id: string): Promise<void> {
    const nav = this.navItem(id);
    if (await nav.count()) {
      await nav.click();
    } else {
      // fallback to anchor href if no testid present
      await this.page.locator(`a[href="#${id}"]`).first().click();
    }
  }

  async expectInViewport(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    const box = await locator.boundingBox();
    const vh = await this.page.evaluate(() => window.innerHeight);
    expect(box).toBeTruthy();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeLessThan(vh);
  }
}
