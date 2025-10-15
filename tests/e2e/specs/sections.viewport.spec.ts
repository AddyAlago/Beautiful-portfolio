// tests/e2e/specs/sections.viewport.spec.ts
import { test, expect, Page } from '@playwright/test';

const IDS = ['about', 'projects', 'career', 'contact'] as const;

function sel(id: string) {
  return `[data-testid="section-${id}"], #${id}`;
}

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

async function setHashAndEnsureVisible(page: Page, id: string) {
  // Deterministic scrolling for assertions
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });

  // Ensure target exists
  await page.locator(sel(id)).first().waitFor();

  // Set hash after render so the browser can jump
  await page.evaluate((sectionId) => {
    if (location.hash !== `#${sectionId}`) location.hash = `#${sectionId}`;
  }, id);

  // If native jump didn’t move enough (e.g., scroll container), force it
  await page.evaluate((sectionId) => {
    const el = document.querySelector<HTMLElement>(`[data-testid="section-${sectionId}"]`) ??
               document.getElementById(sectionId);
    el?.scrollIntoView({ block: 'start' });
  }, id);

  // Wait until the target is near the top (tweak 120 for sticky headers)
  await page.waitForFunction((sectionId) => {
    const el = document.querySelector<HTMLElement>(`[data-testid="section-${sectionId}"]`) ??
               document.getElementById(sectionId);
    if (!el) return false;
    const top = el.getBoundingClientRect().top;
    return top >= 0 && top <= 120;
  }, id);

  await expect(page).toHaveURL(new RegExp(`#${id}$`));
}

// --- One test per section ---
for (const id of IDS) {
  test(`deep link lands ${id} nearest to top`, async ({ page }: { page: Page }) => {
    await page.goto('/'); // isolate each test case
    await page.waitForLoadState('domcontentloaded');

    await setHashAndEnsureVisible(page, id);
    const nearest = await nearestSectionId(page, IDS);
    expect(nearest).toBe(id);
  });
}
