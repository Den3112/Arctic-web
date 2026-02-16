import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show landing page for unauthenticated users', async ({
    page,
  }) => {
    await page.goto('/');
    // Verify landing page content instead of redirect
    await expect(page.locator('h1')).toContainText(/Master Your Time/i);
  });

  test('should have the correct title', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/ArcticTime/);
  });
});
