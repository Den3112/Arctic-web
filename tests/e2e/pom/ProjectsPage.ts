import { Page, Locator, expect } from '@playwright/test';

export class ProjectsPage {
  readonly page: Page;
  readonly newProjectButton: Locator;
  readonly projectNameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newProjectButton = page.getByRole('button', { name: /New Project/i });
    this.projectNameInput = page.getByTestId('project-name-input');
    this.saveButton = page.getByTestId('save-project-button');
  }

  async goto() {
    await this.page.goto('/projects');
    await this.page.waitForLoadState('domcontentloaded');
    // Ensure we are definitely on the projects page and content is rendered
    await expect(this.page).toHaveURL(/\/projects/);
    await expect(
      this.page.getByRole('heading', { name: /Projects/i, level: 2 })
    ).toBeVisible({ timeout: 15000 });
  }

  async createProject(name: string) {
    // Wait for the button to be definitely there and stable
    try {
      await expect(this.newProjectButton).toBeVisible({ timeout: 15000 });
    } catch (e) {
      // Diagnostic screenshot
      const timestamp = Date.now();
      const path = `/home/creator/.gemini/antigravity/brain/5b4f2ee3-b7f1-4ff7-a23d-5aa010f11b12/debug_projects_fail_${timestamp}.png`;
      await this.page.screenshot({ path });
      console.log(
        `Failed to find project button. Diagnostic screenshot saved to ${path}`
      );
      throw e;
    }

    // Regular click first, fallback to evaluate if needed
    await this.newProjectButton.click().catch(async () => {
      await this.newProjectButton.evaluate((btn) =>
        (btn as HTMLElement).click()
      );
    });

    // Wait for the dialog to open
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 10000 });

    const nameInput = this.page.getByTestId('project-name-input');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(name);

    const submitBtn = this.page.getByRole('button', {
      name: /Add Project|Save/i,
    });
    await submitBtn.click();

    // Wait for dialog to close
    await expect(dialog).not.toBeVisible({ timeout: 10000 });
  }
}
