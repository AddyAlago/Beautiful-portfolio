import { test, expect } from '@playwright/test';

test('no broken links on home (http/https only) + valid anchors', async ({ page, request }) => {
  await page.goto('/');

  const rawHrefs = await page.$$eval('a[href]', as =>
    as.map(a => (a as HTMLAnchorElement).getAttribute('href') || '')
  );

  const base = new URL(await page.url());
  const unique = Array.from(new Set(rawHrefs)).filter(Boolean);

  // 1) Check that any in-page hash targets exist
  for (const href of unique) {
    if (href.startsWith('#')) {
      const id = href.slice(1);
      // Minimal escaping: wrap id in quotes to avoid most selector issues
      const target = page.locator(`[id="${id}"]`);
      await expect(target, `Missing in-page anchor target: ${href}`).toHaveCount(1);
    }

  }

  // 2) Network-check only http/https (default: same-origin)
  const httpLinks = unique
    .filter(h =>
      !h.startsWith('#') &&
      !/^mailto:|^tel:|^javascript:|^blob:|^data:|^about:/.test(h)
    )
    .map(h => new URL(h, base)) // resolve relative
    .filter(u => u.protocol === 'http:' || u.protocol === 'https:')
    .filter(u => u.origin === base.origin); // keep same-origin to avoid external blockers

  for (const u of httpLinks) {
    const res = await request.get(u.toString(), { timeout: 20_000 });
    expect(res.status(), `Broken link: ${u.toString()}`).toBeLessThan(400);
  }
});
