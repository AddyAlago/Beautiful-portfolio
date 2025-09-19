// tests/e2e/specs/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

test('no serious a11y violations on key pages', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  // collect blocking issues
  const blocking = results.violations.filter(v =>
    ['serious', 'critical'].includes((v.impact ?? '').toLowerCase())
  );

  // if there are violations, persist a JSON report for CI
  if (blocking.length) {
    const outDir = path.join('test-results', 'a11y');
    mkdirSync(outDir, { recursive: true });
    writeFileSync(
      path.join(outDir, 'axe-report.json'),
      JSON.stringify(
        { url: page.url(), summary: { blockingCount: blocking.length }, violations: blocking },
        null,
        2
      ),
      'utf-8'
    );

    // nice console output for local runs
    console.log('A11y violations (serious/critical):',
      blocking.map(v => ({ id: v.id, impact: v.impact, help: v.help }))
    );
  }

  expect(blocking, 'No serious/critical accessibility violations expected').toEqual([]);
});
