import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';
import { DashboardPage } from './pom/DashboardPage';

test.describe('Timer Functionality', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login('admin@arctictime.com', 'Password123!');
    await dashboardPage.isVisible();
  });

  test('should start, stop, and save a time entry', async ({ page }) => {
    const timer = dashboardPage.timer;

    // Wait for timer state to load
    await expect(timer.startButton.or(timer.stopButton)).toBeVisible({
      timeout: 10000,
    });

    // Ensure timer is stopped before starting
    if (await timer.stopButton.isVisible()) {
      await timer.stopTask();
      await expect(timer.startButton).toBeVisible();
    }

    // Start Timer
    const taskName = `Test Task ${Date.now()}`;
    await timer.startTask(taskName);

    await expect(timer.stopButton).toBeVisible();

    // Small wait for duration increment
    await page.waitForTimeout(2000);

    // Stop Timer
    await timer.stopTask();

    // Wait for timer to actually stop and start button to return
    await expect(timer.startButton).toBeVisible();

    // Small delay to ensure data propagation
    await page.waitForTimeout(3000);

    // Verify entry in the list
    const entryCard = await timer.getEntryCard(taskName);
    await expect(entryCard).toBeVisible();
    await expect(entryCard.getByText(/00:00:\d{2}/)).toBeVisible();
  });
  test('should group entries by date', async ({ page }) => {
    const timer = dashboardPage.timer;

    // Ensure timer is stopped
    if (await timer.stopButton.isVisible()) {
      await timer.stopTask();
      await expect(timer.startButton).toBeVisible();
    }

    // Start and quickly stop a task to ensure we have an entry for "Today"
    const taskName = `Grouping Test ${Date.now()}`;
    await timer.startTask(taskName);
    await expect(timer.stopButton).toBeVisible();
    await page.waitForTimeout(1000);
    await timer.stopTask();
    await expect(timer.startButton).toBeVisible();

    // Verify the task name checks out first (data persistence)
    // Wait for the entry to appear in the list without manual reload if possible,
    // but the app uses server components and revalidatePath which requires a navigation/refresh for the client to see new props if not using polling.
    // However, useTimeTracker has a fetchData() in stopTimer which SHOULD update the state.
    await expect(
      page.getByTestId('time-entry-title').filter({ hasText: taskName })
    ).toBeVisible({ timeout: 15000 });

    // Verify "Today" header exists (grouping logic)
    await expect(page.locator('h3', { hasText: 'Today' })).toBeVisible();
  });

  test('should show autocomplete suggestions', async ({ page }) => {
    const timer = dashboardPage.timer;

    // Ensure timer is stopped
    if (await timer.stopButton.isVisible()) {
      await timer.stopTask();
      await expect(timer.startButton).toBeVisible(); // Wait for state to settle
    }

    // Create a task to seed suggestions
    const seedTaskName = `Autocomplete Seed ${Date.now()}`;
    await timer.startTask(seedTaskName);
    await expect(timer.stopButton).toBeVisible();
    await timer.stopTask();
    await expect(timer.startButton).toBeVisible();

    // Reload to refresh suggestions (TrackerContainer derives them from initialEntries)
    await page.reload();

    // Ensure timer is stopped (handle potential persistence race)
    try {
      await expect(timer.startButton).toBeVisible({ timeout: 5000 });
    } catch {
      if (await timer.stopButton.isVisible()) {
        await timer.stopTask();
        await expect(timer.startButton).toBeVisible();
      }
    }

    // Type partial name
    await timer.taskInput.fill('Autocomplete');
    await timer.taskInput.focus(); // Ensure focus to trigger showSuggestions

    // Check for suggestion
    const suggestion = page
      .getByTestId('task-suggestion')
      .filter({ hasText: seedTaskName })
      .first();
    await expect(suggestion).toBeVisible();

    // Click suggestion
    await suggestion.click();

    // Verify input value is filled
    await expect(timer.taskInput).toHaveValue(seedTaskName);
  });

  test('should create a manual time entry', async ({ page }) => {
    // Click Add Manual Entry button
    await page.getByRole('button', { name: /\+ Add Manual Entry/i }).click();

    // Verify dialog is open
    await expect(page.getByText(/Edit Entry/i)).toBeVisible({ timeout: 10000 });

    const manualTaskName = `Manual Task ${Date.now()}`;
    await page.locator('input#task').fill(manualTaskName);

    // Save
    await page.getByRole('button', { name: /Save/i }).click();

    // Verify entry in the list
    await expect(page.getByText(manualTaskName)).toBeVisible();
  });
});
