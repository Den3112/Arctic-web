import { Page, Locator } from '@playwright/test';

export class TimerComponent {
  readonly page: Page;
  readonly taskInput: Locator;
  readonly startButton: Locator;
  readonly stopButton: Locator;
  readonly entryCards: Locator;
  readonly projectDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskInput = page.getByTestId('timer-task-input');
    this.startButton = page.getByTestId('timer-start-button');
    this.stopButton = page.getByTestId('timer-stop-button');
    this.entryCards = page.getByTestId('time-entry-card');
    this.projectDropdown = page.getByTestId('timer-project-select');
  }

  async selectProject(name: string) {
    await this.projectDropdown.click();
    await this.page.getByTestId(`project-option-${name}`).click();
  }

  async startTask(name: string) {
    await this.taskInput.fill(name);
    await this.startButton.click();
  }

  async stopTask() {
    await this.stopButton.click();
  }

  async getEntryCard(name: string) {
    return this.entryCards.filter({ hasText: name }).first();
  }
}
