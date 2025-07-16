import { Page } from '@playwright/test';
export async function getSectionClosestToTop(page: Page) {
  return await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('[data-testid^="section-"]'));
    if (sections.length === 0) return null;

    const visibleSections = sections
      .map(el => ({
        id: el.getAttribute('data-testid') || '',
        top: el.getBoundingClientRect().top
      }))
      .filter(el => el.top >= 0 && el.top <= window.innerHeight);

    if (visibleSections.length === 0) return null;

    return visibleSections.sort((a, b) => a.top - b.top)[0].id;
  });
}