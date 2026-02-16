import { test, expect } from '@playwright/test';
import { ProjectsPage } from './pom/ProjectsPage';
import { LoginPage } from './pom/LoginPage';

test.describe('Project Deletion UI', () => {
  let projectsPage: ProjectsPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => console.log(`BROWSER_CONSOLE: ${msg.text()}`));
    page.on('request', (request) =>
      console.log(`BROWSER_REQUEST: ${request.url()}`)
    );

    loginPage = new LoginPage(page);
    projectsPage = new ProjectsPage(page);
    await loginPage.goto();
    await loginPage.login('admin@arctictime.com', 'Password123!');
  });

  test('should show confirmation dialog and delete project', async ({
    page,
  }) => {
    // 1. Navigate to Projects Page
    await projectsPage.goto();

    // 2. Create Project
    const projectName = `Deletion Test Project ${Date.now()}`;
    await projectsPage.createProject(projectName);

    // Wait for dialog to be gone and project to appear
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText(projectName)).toBeVisible({ timeout: 30000 });

    // 2. Click Delete Button
    // Find the card containing our project by looking for the name in CardTitle
    const projectCard = page.locator('div.relative.overflow-hidden', {
      hasText: projectName,
    });
    const deleteButton = projectCard.getByTestId('delete-project-button');
    await expect(deleteButton).toBeVisible({ timeout: 10000 });
    await deleteButton.click();

    // 3. Verify Dialog Appears
    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Are you absolutely sure?');
    await expect(dialog).toContainText(projectName);

    // 4. Confirm Deletion
    const confirmButton = dialog.getByRole('button', { name: 'Delete' });
    await confirmButton.click();

    // 5. Verify Loading State (optional, might be too fast)
    // await expect(confirmButton).toBeDisabled();
    // await expect(confirmButton).toContainText('Deleting...');

    // 6. Verify Deletion
    await expect(dialog).not.toBeVisible();
    await expect(page.getByText(projectName)).not.toBeVisible();
  });
});
