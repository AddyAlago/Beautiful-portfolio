import { test, expect } from '../fixtures/po-fixtures';


test.describe('Contact Form', () => {
test.beforeEach(async ({ contact }) => {
await contact.openViaNav();
});


test('Submit form with valid inputs', async ({ contact }) => {
await contact.fillForm({
name: 'John Doe',
email: 'john@example.com',
message: 'This is a test message.'
});
await contact.submitForm();
await contact.expectToast("Thank you for your message. I'll get back to you soon.");
});


test('Clears form after successful submission', async ({ contact }) => {
await contact.fillForm({
name: 'John Doe',
email: 'john@example.com',
message: 'This is a test message.'
});
await contact.submitForm();
// If your app does this asynchronously, keep the tiny wait or, better, wait on a UI signal.
await contact.expectCleared();
});


test('Special characters in name and email accepted', async ({ contact }) => {
await contact.fillForm({
name: "Zoë O'Connor",
email: "zoe.o'connor@example.co.uk",
message: 'This is a perfectly fine message.'
});
await contact.submitForm();
await contact.expectToast("Thank you for your message. I'll get back to you soon.");
});
});