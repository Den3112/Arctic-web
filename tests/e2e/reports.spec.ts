import { test, expect } from '@playwright/test';

test.describe('Reports Page - Time Distribution', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@arctictime.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/', { timeout: 15000 }); // Wait for redirect to dashboard
  });

  test('should display Time Distribution chart', async ({ page }) => {
    await page.waitForURL('/', { timeout: 10000 });

    const taskInput = page.locator(
      'input[placeholder="What are you doing right now?"]'
    );
    const startButton = page.getByTestId('timer-start-button');
    const stopButton = page.getByTestId('timer-stop-button');

    // Wait for page to be ready and hydrated
    await page.waitForLoadState('networkidle');
    await expect(taskInput).toBeVisible({ timeout: 15000 });

    // Wait for timer state to load
    await expect(startButton.or(stopButton)).toBeVisible({ timeout: 30000 });

    // Ensure stopped
    if (await stopButton.isVisible()) {
      await stopButton.click();
      await expect(startButton).toBeVisible();
    }

    // Start new task
    await taskInput.fill('Report Test Task');
    await startButton.click();
    await expect(stopButton).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(2000);
    await stopButton.click();
    await expect(startButton).toBeVisible();

    // Go to reports
    await page.goto('/reports');

    // Check Header
    await expect(page.getByTestId('time-distribution-bar-title')).toBeVisible();

    // Check Chart
    const chart = page.getByTestId('time-distribution-chart');
    await expect(chart).toBeVisible();
  });

  test('should export CSV data', async ({ page }) => {
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');

    // Wait for the page content to load
    await expect(
      page.getByRole('heading', { name: /Reports/i, level: 1 })
    ).toBeVisible({ timeout: 15000 });

    // Check if we have data by looking for the export button or the no data message
    const exportButton = page.getByRole('button', { name: /Export CSV/i });
    const noDataText = page.getByText(/No data for this period/i);

    // Wait for either to appear to avoid race condition
    await expect(exportButton.or(noDataText)).toBeVisible({ timeout: 15000 });

    if (await noDataText.isVisible()) {
      await page.goto('/');
      const taskInput = page.locator(
        'input[placeholder="What are you doing right now?"]'
      );
      await taskInput.fill('Export Test Task');
      await page.getByTestId('timer-start-button').click();
      await page.waitForTimeout(1000);
      await page.getByTestId('timer-stop-button').click();
      await page.goto('/reports');
      await page.waitForLoadState('networkidle');
    }

    // Wait for the Export button and ensure it's enabled
    await expect(exportButton).toBeVisible({ timeout: 15000 });
    await expect(exportButton).toBeEnabled({ timeout: 10000 });

    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;

    // Wait for the download process to complete
    await download.path();

    expect(download.suggestedFilename()).toContain('arctictime-export');
  });
});
