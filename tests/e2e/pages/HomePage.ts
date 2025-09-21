// tests/e2e/pages/HomePage.ts
import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly header: Locator;
  readonly contactForm: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header / nav (if you tag it later with data-testid="site-header")
    this.header = page.getByTestId('site-header');

    // Contact form + submit button
    this.contactForm = page.getByTestId('contact-form');
    this.submit = page.getByRole('button', { name: /send|submit/i });
  }

  // Desktop nav item
  desktopNavItem(id: string): Locator {
    return this.page.getByTestId('desktop-nav').getByTestId(`nav-${id}`);
  }

  // Mobile nav item
  mobileNavItem(id: string): Locator {
    return this.page.getByTestId('mobile-nav').getByTestId(`nav-${id}`);
  }

  // Section by testid
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

  async clickNav(id: string) {
    // First, check if the desktop link is visible
    if (await this.desktopNavItem(id).isVisible()) {
      await this.desktopNavItem(id).scrollIntoViewIfNeeded();
      await this.desktopNavItem(id).click();
      return;
    }

    // Otherwise, open hamburger and use mobile nav
    const menuButton = this.page.getByTestId('nav-toggle');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Wait for mobile nav panel to finish animating in
      await this.page.getByTestId('mobile-nav').waitFor({ state: 'visible' });
    }

    const mobileLink = this.mobileNavItem(id);
    await mobileLink.scrollIntoViewIfNeeded();
    await expect(mobileLink).toBeVisible();
    await mobileLink.click();
  }
}
