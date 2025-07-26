import { test, expect } from '@playwright/test';
import { isElementInViewportRange } from './helpers/viewportHelpers';
import { getSectionClosestToTop } from './helpers/getSectionClosestToTop';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Addy Alago's Portfolio/);
});

test('button to projects page works', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('button-view-work').click();

  const topSection = await getSectionClosestToTop(page);
  expect(topSection).toBe('section-projects');
   
});