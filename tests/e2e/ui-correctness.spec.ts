import { test, expect } from '@playwright/test';

test.describe('UI Correctness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should use correct font family', async ({ page }) => {
    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    // The project uses Outfit font
    expect(bodyFont).toContain('Outfit');
  });

  test('should apply glassmorphism to navbar', async ({ page }) => {
    const navbar = page.locator('nav.glass-navbar');
    const backdropFilter = await navbar.evaluate((el) => {
      return window.getComputedStyle(el).backdropFilter;
    });
    // backdrop-blur-3xl should result in a blur value
    expect(backdropFilter).toContain('blur');
  });

  test('landing page hero should have gradient text', async ({ page }) => {
    const heroTitle = page.locator('h1');
    const backgroundClip = await heroTitle.evaluate((el) => {
      return window.getComputedStyle(el).backgroundClip;
    });
    expect(backgroundClip).toBe('text');
  });

  test('login page should be centered and visible', async ({ page }) => {
    await page.goto('/login');

    // Check if card is centered horizontally
    const card = page.locator('.glass-card');
    const box = await card.boundingBox();
    const viewport = page.viewportSize();

    if (box && viewport) {
      const centerX = box.x + box.width / 2;
      expect(Math.abs(centerX - viewport.width / 2)).toBeLessThan(50);
    }
  });

  test('feature cards should have glassmorphism', async ({ page }) => {
    const firstCard = page.locator('.glass-card').first();
    const backdropFilter = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).backdropFilter;
    });
    expect(backdropFilter).toContain('blur');
  });
});
