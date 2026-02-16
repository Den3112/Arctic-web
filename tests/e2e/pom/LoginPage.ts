import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // We scope to the card to avoid potential interference from other elements
    // We also use .first() as a safety net if strict mode detects duplicates (e.g. during hydration or animations)
    this.emailInput = page.locator('.glass-card input[type="email"]').first();
    this.passwordInput = page
      .locator('.glass-card input[type="password"]')
      .first();
    this.submitButton = page
      .locator('.glass-card button[type="submit"]')
      .first();
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, pass: string) {
    // Check if already logged in by looking for a dashboard-specific element
    await this.page.goto('/');
    const userButton = this.page.locator('button:has(svg.lucide-user)');
    if (await userButton.isVisible({ timeout: 5000 })) {
      console.log('Already logged in, skipping login form');
      return;
    }

    await this.goto();
    await expect(this.emailInput).toBeVisible({ timeout: 15000 });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();

    // Wait for redirected to home and session to be stable
    await this.page.waitForURL('/', { timeout: 20000 });
    await expect(userButton).toBeVisible({ timeout: 20000 });
  }
}
