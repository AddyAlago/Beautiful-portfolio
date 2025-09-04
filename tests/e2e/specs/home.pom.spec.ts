import { test, expect } from '../fixtures/po-fixtures';

test('has title', async ({ home }) => {
  await home.open();
  await home.expectTitle();
});

test('button to projects page works', async ({ home }) => {
  await home.open();
  await home.clickViewWork();
  const top = await home.getTopSectionTestId();
  expect(top).toBe('section-projects');
});
