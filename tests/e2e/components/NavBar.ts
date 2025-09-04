import { Page } from '@playwright/test';


export class NavBar {
constructor(private readonly page: Page) {}


async clickByTestId(testId: string) {
await this.page.getByTestId(testId).click();
}
}