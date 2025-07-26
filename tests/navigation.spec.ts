import { test, expect } from '@playwright/test';
import { getSectionClosestToTop } from './helpers/getSectionClosestToTop';

const navItems = [
  { label: 'Home', testId: 'nav-home' },
  { label: 'About', testId: 'nav-about' },
  { label: 'Skills', testId: 'nav-skills' },
  { label: 'Projects', testId: 'nav-projects' },
  { label: 'Contact', testId: 'nav-contact' },
];

test.describe('Navbar scroll behavior', () => {
  for (const { label, testId } of navItems) {
    test(`scrolls to ${label} section`, async ({ page }) => {
      await page.goto('/');

      const navSelector = `nav >> text=${label}`;
      const expectedSectionTestId = testId.replace(/^nav-/, 'section-');

      if (label === 'Home') {
        // Scroll away from top to ensure it's a real scroll
        await page.click('nav >> text=Contact');
      }

      await page.click(navSelector);
      const topSection = await getSectionClosestToTop(page);
      expect(topSection).toBe(expectedSectionTestId);
    });
  }
});

test.describe('Navbar URL reflects active section', () => {
  for (const { label, testId } of navItems) {
    test(`updates URL for ${label}`, async ({ page }) => {
      await page.goto('/');
      await page.click(`nav >> text=${label}`);

      const expectedHash = testId.replace(/^nav-/, '');
      await expect(page).toHaveURL(new RegExp(`#${expectedHash}$`));
    });
  }
});

test('Resume link navigates to correct Google Drive URL', async ({ page, context }) => {
  await page.goto('/');

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByTestId('nav-resume').click(),
  ]);

  await newPage.waitForLoadState();
  expect(newPage.url()).toMatch(/^https:\/\/drive\.google\.com\/.+/);
});


test('should add dark class to <html> when dark mode is enabled', async ({ page }) => {
  await page.goto('/');  

  // Check if the 'dark' class is present on the <html> element
  const htmlElement = page.locator('html');
  page.getByTestId('theme-toggle').click(),
  await expect(htmlElement).toHaveClass('dark');
});

test('should not have dark class on <html> when dark mode is not enabled', async ({ page }) => {
  await page.goto('/');  

  
  const htmlClass = await page.evaluate(() => document.documentElement.className);
  const htmlElement = page.locator('html');

  await expect(htmlElement).not.toHaveClass('dark');
});

test('should not have dark class on <html> when dark mode is toggled on and off', async ({ page }) => {
  await page.goto('/');  

  
  const htmlClass = await page.evaluate(() => document.documentElement.className);
  const htmlElement = page.locator('html');
  page.getByTestId('theme-toggle').click(),
  page.getByTestId('theme-toggle').click(),
  await expect(htmlElement).not.toHaveClass('dark');
});
