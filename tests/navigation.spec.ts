import { test, expect } from '@playwright/test';

const navItems = [
  { label: 'Home', testId: 'nav-home' },
  { label: 'About', testId: 'nav-about' },
  { label: 'Skills', testId: 'nav-skills' },
  { label: 'Projects', testId: 'nav-projects' },
  { label: 'Contact', testId: 'nav-contact' },
];
const STICKY_NAV_HEIGHT = 80;


// Helper function to check if an element is in the desired viewport range
// This replaces the "wait for scroll" logic with "wait for position"
async function isElementInViewportRange(page, selector, minTop, maxTop, timeout = 5000) {
    await page.waitForFunction(
      ({ sel, minT, maxT }) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        // Console log here is useful for debugging if this still fails
         console.log(`[isElementInViewportRange] Selector: ${sel}, Current top: ${rect.top.toFixed(2)}`);
        return rect.top >= minT && rect.top <= maxT;
      },
      { sel: selector, minT: minTop, maxT: maxTop },
      { timeout }
    );
}


test.describe('Navbar scroll behavior', () => {
  for (const { label, testId } of navItems) {
    test(`jumps to ${label} section`, async ({ page }) => { // Changed description
      await page.goto('/');

      const selector = `[data-testid="${testId}"]`;
      const targetSection = page.locator(selector);

      // --- Handling the 'Home' test case ---
      if (label === 'Home') {


        // Click 'About' and wait for About section to be in view then click home and verify we are at the top
        await page.click('nav >> text=Contact');
        await isElementInViewportRange(page, '[data-testid="nav-contact"]', -80, 120);

        // Verify we are indeed away from the very top
        const currentScrollY = await page.evaluate(() => window.scrollY);
        expect(currentScrollY).toBeGreaterThan(50); // Ensure scrolled down at least 50px

        // 2. Now click 'Home' nav item
        await page.click(`nav >> text=${label}`);

    

        // Final verification for Home
        const isAtTop = await page.evaluate(() => window.scrollY === 0);
        expect(isAtTop).toBe(true); // Assert we are at the top

      } else {
        // --- Handling all other sections ---
        // Ensure starting at the very top for consistency before clicking
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForFunction(() => window.scrollY === 0); // Confirm scroll is at 0

        // Click the nav item
        await page.click(`nav >> text=${label}`);

        // Wait for the target section to be in the desired viewport range
        // Adjust these values based on your sticky header/layout if applicable
        await isElementInViewportRange(page, selector, -80, 120);

        // Final verification: section is indeed in viewport range
        const sectionTop = await targetSection.evaluate(el => el.getBoundingClientRect().top);
        expect(sectionTop).toBeGreaterThanOrEqual(-80);
        expect(sectionTop).toBeLessThanOrEqual(120);
      }
    });
  }
});

test.describe('Navbar URL shows section', () => {
  for (const { label, testId } of navItems) {
    test(`jumps to ${label} section`, async ({ page }) => {
      await page.goto('/');
      await page.click(`nav >> text=${label}`);

      // Expect URL to contain the correct hash
      const expectedFragment = testId.replace(/^nav-/, '');
      await expect(page).toHaveURL(new RegExp(`#${expectedFragment}$`));
    });
  }
});


test('Resume link navigates to correct Google Drive URL', async ({ page, context }) => {
  await page.goto('/');

  // Intercept the new page (popup or tab)
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByTestId('nav-resume').click(), 
  ]);

  // Wait for navigation to finish
  await newPage.waitForLoadState();

  // Check the URL is a Google Drive link
  const url = newPage.url();
  expect(url).toMatch(/^https:\/\/drive\.google\.com\/.+/);


});
