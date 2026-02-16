import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';
import { DashboardPage } from './pom/DashboardPage';
import { ProjectsPage } from './pom/ProjectsPage';

test.describe('Project Management', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let projectsPage: ProjectsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    projectsPage = new ProjectsPage(page);

    await loginPage.goto();
    await loginPage.login('admin@arctictime.com', 'Password123!');
  });

  test('should create a new project and select it', async ({ page }) => {
    await projectsPage.goto();

    // Fill Project Details
    const projectName = `Test Project ${Date.now()}`;
    await projectsPage.createProject(projectName);

    // Verify Project Created
    await expect(page.getByText(projectName)).toBeVisible({ timeout: 10000 });

    // Go back to Timer and reload to ensure project is fetched
    await dashboardPage.goto();
    await page.reload();

    const timer = dashboardPage.timer;
    // Ensure timer is stopped so we can select project
    if (await timer.stopButton.isVisible()) {
      await timer.stopTask();
      await expect(timer.startButton).toBeVisible();
    }

    // Select the new project
    await timer.selectProject(projectName);

    // Verify selected
    await expect(page.getByText(projectName)).toBeVisible();
  });

  test('should edit an existing project', async ({ page }) => {
    await projectsPage.goto();

    // Create a project to edit
    const originalName = `Project To Edit ${Date.now()}`;
    await projectsPage.createProject(originalName);
    await expect(page.getByText(originalName)).toBeVisible();

    // Find the project card and click edit
    // Filter by text to find the specific card, then find the edit button within it
    const projectCard = page.locator('.space-y-4 .relative', {
      hasText: originalName,
    });
    await projectCard.getByTestId('edit-project-button').click();

    // Edit the name
    const newName = `Edited Project ${Date.now()}`;
    // Reuse createProject from POM but modifying it for edit context if possible,
    // or just interact with the dialog directly since POM might assume "New Project" button click.
    // The dialog should be open now.
    await page.fill('input[name="name"]', newName); // Assuming standard input
    await page.click('button[type="submit"]');

    // Verify change
    await expect(page.getByText(newName)).toBeVisible();
    await expect(page.getByText(originalName)).not.toBeVisible();
  });
});
