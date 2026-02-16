import { Page, Locator, expect } from '@playwright/test';
import { TimerComponent } from './TimerComponent';

export class DashboardPage {
  readonly page: Page;
  readonly timer: TimerComponent;
  readonly projectsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timer = new TimerComponent(page);
    this.projectsLink = page.locator('a[href="/projects"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async isVisible() {
    await expect(this.page).toHaveURL('/');
    await expect(this.timer.taskInput).toBeVisible({ timeout: 15000 });
  }
}
