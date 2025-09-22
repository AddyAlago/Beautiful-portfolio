// tests/e2e/specs/a11y.spec.ts
import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const IDS = ['about', 'projects', 'skills', 'contact'] as const;

function sel(id: string) {
  return `[data-testid="section-${id}"], #${id}`;
}

async function runA11y(page: Page, contextSelector?: string) {
  await page.waitForLoadState('domcontentloaded');

  // Make geometry deterministic for axe (no smooth scroll/animations)
  await page.addStyleTag({
    content: `
      html { scroll-behavior: auto !important; }
      *, *::before, *::after { animation: none !important; transition: none !important; }
    `,
  });

  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

  if (contextSelector) builder = builder.include(contextSelector);

  const results = await builder.analyze();

  // Attach raw results for debugging in the Playwright report
  await test.info().attach('axe-results', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json'
  });

  // Only fail on serious/critical to keep signal high in CI
  const severe = results.violations.filter(v =>
    ['serious', 'critical'].includes((v.impact || '').toLowerCase())
  );

  expect(
    severe,
    `A11Y violations (${severe.length}):\n` +
      severe.map(v => `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`).join('\n')
  ).toEqual([]);
}

test.describe('@a11y accessibility suite', () => {
  test('home has no serious/critical violations @a11y', async ({ page }) => {
    await page.goto('/');
    await runA11y(page); // whole page
  });

  for (const id of IDS) {
    test(`${id} section has no serious/critical violations @a11y`, async ({ page }) => {
      await page.goto('/');
      await page.locator(sel(id)).first().waitFor({ state: 'visible' });
      await runA11y(page, sel(id)); // scoped scan
    });
  }
});
