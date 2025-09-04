import { test, expect } from '../fixtures/po-fixtures';


const navItems = [
{ label: 'Home', testId: 'nav-home' },
{ label: 'About', testId: 'nav-about' },
{ label: 'Skills', testId: 'nav-skills' },
{ label: 'Projects', testId: 'nav-projects' },
{ label: 'Contact', testId: 'nav-contact' },
];


// Scroll behavior to each section
for (const { label, testId } of navItems) {
test(`scrolls to ${label} section`, async ({ home, nav }) => {
await home.open();
await nav.clickByTestId(testId);


const top = await home.getTopSectionTestId();
expect(top).toBe(`section-${label.toLowerCase()}`);
});
}


// Dark mode toggle expectations
test('dark mode toggles on', async ({ home }) => {
await home.open();
await home.toggleTheme();
await expect(home.html).toHaveClass(/dark/);
});


test('dark mode toggles off again', async ({ home }) => {
await home.open();
await home.toggleTheme();
await home.toggleTheme();
await expect(home.html).not.toHaveClass('dark');
});