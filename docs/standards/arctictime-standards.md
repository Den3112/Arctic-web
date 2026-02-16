# ArcticTime Development Standards

This document encapsulates the world-class engineering standards for the ArcticTime project. All code must adhere to these guidelines to ensure maintainability, performance, and reliability.

## 1. Core Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Shadcn/UI (Glassmorphism aesthetics)
- **Backend/Auth**: Supabase
- **Testing**: Playwright (E2E), Vitest (Unit)

### Directory Structure

- `src/components/layout`: Global layout components (Navbar, Footer).
- `src/components/features`: Business logic-heavy components (TimerController).
- `src/components/ui`: Reusable design system primitives (Button, Card).
- `src/services`: Singleton-like service layers interacting with Supabase. **NO direct DB calls in components.**
- `tests/e2e/pom`: Page Object Models for Playwright.

## 2. React & Next.js Best Practices

### Server vs. Client Components

- **Default to Server Components** for data fetching and layout.
- Use `"use client"` _only_ for interactive components (forms, timers, listeners).
- **Data Fetching**: Fetch data in Server Components using `src/services` and pass as props to Client Components.

### Supabase Integration

- **Server-Side**: Use `createClient` from `@/lib/supabase-server` (handles cookies).
- **Client-Side**: Use `createClient` from `@/lib/supabase-client`.
- **Middleware**: Ensure `middleware.ts` correctly refreshes auth tokens.

### State Management

- Use **URL Search Params** for shareable state (filters, sorting).
- Use **React Context** only for global, low-frequency updates (Auth, Theme).
- Use **Local State** (`useState`, `useReducer`) for component-specific logic (Timer running state).

## 3. Playwright E2E Testing Standards

### Page Object Model (POM)

- **MANDATORY**: All E2E tests must use Page Object Models located in `tests/e2e/pom`.
- **No Raw Locators**: Tests should not contain `page.locator('div > span')`. Abstract these into the POM.
- **Example**:
  ```typescript
  // tests/e2e/pom/TimerPage.ts
  export class TimerPage {
      readonly startButton = this.page.getByRole('button', { name: 'Start' });
      async startTask(name: string) { ... }
  }
  ```

### Robustness & Stability

- **Race Conditions**: Always ensure the UI is in a stable state before interacting (e.g., stop active timers before starting new ones).
- **Wait Strategies**: Prefer `await expect(locator).toBeVisible()` over `waitForTimeout()`.
- **Isolation**: Each test should be independent. Use `test.beforeEach` to reset state if necessary.

## 4. Code Quality & Styling

### TypeScript

- **No `any`**: Strictly typed interfaces for all props and data.
- **Shared Types**: Define entities in `src/types/index.ts` (e.g., `TimeEntry`, `Project`).

### Tailwind CSS

- **Utility-First**: Use Tailwind classes for layout and spacing.
- **Consistency**: Use semantic colors (`bg-primary`, `text-muted`) from `globals.css` rather than arbitrary hex values.
- **Glassmorphism**: Use `backdrop-blur-md`, `bg-white/10`, `border-white/20` for the signature look.

## 5. Security Standards (OWASP Top 10)

- **Dependency Audit**: regularly run `npm audit` to check for CVEs.
- **Secrets**: NEVER commit `.env` files. Use `.env.example` for templates.
- **RLS Policy**: Every Supabase table must have Row Level Security enabled.
- **Input Validation**: Validate all Server Action inputs using Zod.
- **XSS Prevention**: Avoid `dangerouslySetInnerHTML`. Use standard JSX data binding.
- **CSRF**: Next.js App Router handles this via Server Actions, but ensure no GET requests perform mutations.

## 6. Frontend Design & Aesthetics (World Class)

- **Typography**: Use **Outfit** for headings and **Inter** for body text. precise kerning and leading.
- **Visuals**:
  - **Glassmorphism**: `backdrop-blur-md bg-white/5 border-white/10`.
  - **Motion**: Use `framer-motion` for complex sequences, or Tailwind `animate-in` for simple entry effects.
  - **Whitespace**: Use generous padding (`p-6`, `p-8`) to let content breathe.
- **Components**:
  - Avoid generic "AI looks". Customize Shadcn components in `components/ui`.
  - Use gradients and subtle borders to add depth.
