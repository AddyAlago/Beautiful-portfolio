import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { NavBar } from '../components/NavBar';
import { ContactPage } from '../pages/ContactPage';


export type POFix = {
home: HomePage;
nav: NavBar;
contact: ContactPage;
};


export const test = base.extend<POFix>({
home: async ({ page }, use) => { await use(new HomePage(page)); },
nav: async ({ page }, use) => { await use(new NavBar(page)); },
contact: async ({ page }, use) => { await use(new ContactPage(page)); },
});


export const expect = test.expect;