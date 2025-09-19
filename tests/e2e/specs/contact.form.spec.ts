// tests/e2e/specs/contact.form.spec.ts
import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

async function mockPost200(page: Page) {
  await page.route('**/*', async (route) => {
    const req = route.request();
    if (req.method() === 'POST') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    } else {
      await route.continue();
    }
  });
}

test('valid submission shows success toast', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await home.clickNav('contact');

  await mockPost200(page);

  await home.input('name').fill('Addy Alago');
  await home.input('email').fill('addy@example.com');
  await home.input('message').fill('Hey there—great site!');
  await home.submit.click();

  // ✅ Assert the toast title that you just tagged
  const toastTitle = page.getByTestId('toast-title');
  await expect(toastTitle).toBeVisible({ timeout: 7000 });
  await expect(toastTitle).toHaveText(/message sent/i);
});
