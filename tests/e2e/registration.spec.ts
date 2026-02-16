import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    // Switch to Registration view
    await page.click('button:has-text("Don\'t have an account?")');
  });

  test('should show registration form with confirm password field', async ({
    page,
  }) => {
    await expect(page.locator('h1')).toContainText(/Create Account/i);
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toBeVisible();
    await expect(page.locator('label[for="confirmPassword"]')).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'Password123!');
    await page.fill('#confirmPassword', 'Password456!');

    await page.click('button[type="submit"]:has-text("Sign Up")');

    // Check for toast error message
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should successfully register a new user (mocked)', async ({ page }) => {
    // Mock Supabase Auth signUp response
    await page.route('**/auth/v1/signup**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'test-user-id', email: 'test@example.com' },
          session: null,
        }),
      });
    });

    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'Password123!');
    await page.fill('#confirmPassword', 'Password123!');

    await page.click('button[type="submit"]:has-text("Sign Up")');

    // Check for success message
    await expect(page.locator('text=Registration successful!')).toBeVisible();
    // Should switch back to login view
    await expect(page.locator('h1')).toContainText(/Welcome/i);
  });

  test('should toggle between Login and Registration', async ({ page }) => {
    // Already in registration view from beforeEach
    await expect(page.locator('h1')).toContainText(/Create Account/i);

    // Back to Login
    await page.click('button:has-text("Already have an account?")');
    await expect(page.locator('h1')).toContainText(/Welcome/i);
    await expect(page.locator('#confirmPassword')).not.toBeVisible();

    // Back to Registration
    await page.click('button:has-text("Don\'t have an account?")');
    await expect(page.locator('h1')).toContainText(/Create Account/i);
    await expect(page.locator('#confirmPassword')).toBeVisible();
  });
});
