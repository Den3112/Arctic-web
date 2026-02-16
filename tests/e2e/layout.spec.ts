import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';

test.describe('Layout & Responsiveness', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin@arctictime.com', 'Password123!');
  });

  test('should show desktop navigation on large screens', async ({ page }) => {
    // Default viewport is usually desktop-like in Playwright config, but let's be explicit
    await page.setViewportSize({ width: 1280, height: 720 });

    await expect(page.getByTestId('desktop-nav')).toBeVisible();
    await expect(page.getByTestId('mobile-menu-trigger')).not.toBeVisible();
  });

  test('should show mobile menu on small screens', async ({ page }) => {
    // iPhone 12 Pro viewport
    await page.setViewportSize({ width: 390, height: 844 });

    await expect(page.getByTestId('desktop-nav')).not.toBeVisible();
    await expect(page.getByTestId('mobile-menu-trigger')).toBeVisible();

    // Open mobile menu
    await page.getByTestId('mobile-menu-trigger').click();
    await expect(page.getByTestId('mobile-menu-overlay')).toBeVisible();

    // Verify links exist
    await expect(page.getByTestId('mobile-nav-timer')).toBeVisible();
    await expect(page.getByTestId('mobile-nav-projects')).toBeVisible();

    // Close menu by clicking a link (simulating navigation)
    await page.getByTestId('mobile-nav-timer').click();
    await expect(page.getByTestId('mobile-menu-overlay')).not.toBeVisible();
  });
});
