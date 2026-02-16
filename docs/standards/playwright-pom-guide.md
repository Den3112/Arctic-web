# Playwright POM Guide for ArcticTime

## Overview

All E2E tests in ArcticTime must use the Page Object Model (POM) pattern. This ensures tests are readable, maintainable, and less brittle to UI changes.

## Directory Structure

- `tests/e2e/pom/BasePage.ts`: Common methods (goto, waitForURL)
- `tests/e2e/pom/LoginPage.ts`: Authentication flows
- `tests/e2e/pom/DashboardPage.ts`: Main application interface
- `tests/e2e/pom/ProjectModal.ts`: Project creation/editing

## Example Implementation

### BasePage.ts

```typescript
import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }
}
```

### LoginPage.ts

```typescript
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput = this.page.locator('input[type="email"]');
  readonly passwordInput = this.page.locator('input[type="password"]');
  readonly submitButton = this.page.locator('button[type="submit"]');

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
    await this.page.waitForURL('/');
  }
}
```

## Rules

1. **Locators in Constructor**: Define locators as readonly properties.
2. **Business Logic Methods**: Expose high-level actions (`login()`, `createProject()`), not low-level clicks.
3. **No Assertions in POM**: Keep assertions in the test file (`.spec.ts`), unless checking for page load readiness.
