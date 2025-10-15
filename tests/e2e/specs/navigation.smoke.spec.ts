// tests/e2e/specs/navigation.smoke.spec.ts
import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

const IDS = ['about', 'projects', 'career', 'contact'] as const;

async function nearestSectionId(page: Page, ids: readonly string[]) {
  return page.evaluate((idsIn) => {
    const getEl = (id: string) =>
      document.querySelector<HTMLElement>(`[data-testid="section-${id}"]`) ??
      document.getElementById(id);
    const items = idsIn.map((id) => {
      const el = getEl(id);
      if (!el) return { id, dist: Number.POSITIVE_INFINITY };
      const r = el.getBoundingClientRect();
      return { id, dist: Math.abs(r.top) };
    });
    items.sort((a, b) => a.dist - b.dist);
    return items[0]?.id ?? null;
  }, ids);
}

for (const id of IDS) {
  test(`nav click -> ${id}`, async ({ page }: { page: Page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Disable smooth scroll so we get stable geometry
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });

    await home.clickNav(id);

    // Strong assertion: the clicked section is nearest to top
    const nearest = await nearestSectionId(page, IDS);
    expect(nearest).toBe(id);
  });
}
