import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {


  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('nav >> text=Contact');
  });

  test('Submit form with valid inputs', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message.');

    await page.click('button[type="submit"]');
    // Replace below with actual success behavior, e.g. success message or form reset
    await expect(page.getByTestId('toast-title')).toHaveText('Message sent!');
    await expect(page.getByTestId('toast-description')).toHaveText("Thank you for your message. I'll get back to you soon.");
  });

 test('Script injection is blocked in message', async ({ page }) => {
    await page.fill('input[name="name"]', 'Attacker');
    await page.fill('input[name="email"]', 'evil@example.com');
    await page.fill('textarea[name="message"]', '<script>alert("xss")</script>');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid characters')).toBeVisible(); // Adjust if your site handles this differently
  });

  test('Long message input is handled or limited', async ({ page }) => {
    await page.fill('input[name="name"]', 'Verbose User');
    await page.fill('input[name="email"]', 'verbose@example.com');
    await page.fill('textarea[name="message"]', 'a'.repeat(10000)); // Adjust limit if needed
    await page.click('button[type="submit"]');
    await expect(page.getByTestId('toast-description')).toHaveText("Thank you for your message. I'll get back to you soon.");
  });

  test('Form resets after successful submission', async ({ page }) => {
    await page.fill('input[name="name"]', 'Jane Doe');
    await page.fill('input[name="email"]', 'jane@example.com');
    await page.fill('textarea[name="message"]', 'Clear this out!');

    await page.click('button[type="submit"]');
    await expect(page.getByTestId('toast-description')).toHaveText("Thank you for your message. I'll get back to you soon.");

    // Wait briefly for form reset
    await page.waitForTimeout(500);

    await expect(page.locator('input[name="name"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
    await expect(page.locator('textarea[name="message"]')).toHaveValue('');
  });

  test('Special characters in name and email accepted', async ({ page }) => {
    await page.fill('input[name="name"]', "Zoë O'Connor");
    await page.fill('input[name="email"]', 'zoe.o\'connor@example.co.uk');
    await page.fill('textarea[name="message"]', 'This is a perfectly fine message.');
    await page.click('button[type="submit"]');
    await expect(page.getByTestId('toast-description')).toHaveText("Thank you for your message. I'll get back to you soon.");
  });
});