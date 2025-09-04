import { Page, Locator, expect } from '@playwright/test';


export class ContactPage {
readonly page: Page;
readonly name: Locator;
readonly email: Locator;
readonly message: Locator;
readonly submit: Locator;


constructor(page: Page) {
this.page = page;
this.name = page.locator('input[name="name"]');
this.email = page.locator('input[name="email"]');
this.message = page.locator('textarea[name="message"]');
this.submit = page.locator('button[type="submit"]');
}


async openViaNav() {
await this.page.goto('/');
await this.page.click('nav >> text=Contact');
}


async fillForm({ name, email, message }: { name: string; email: string; message: string }) {
await this.name.fill(name);
await this.email.fill(email);
await this.message.fill(message);
}


async submitForm() {
await this.submit.click();
}


async expectToast(text: RegExp | string) {
const toast = this.page.getByTestId('toast-description');
await expect(toast).toHaveText(text);
}


async expectCleared() {
await expect(this.name).toHaveValue('');
await expect(this.email).toHaveValue('');
await expect(this.message).toHaveValue('');
}
}