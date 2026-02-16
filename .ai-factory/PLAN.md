**Goal**: Resolve all critical bugs, functional gaps, and test failures identified during the verification phase to ensure 100% TZ compliance and a world-class user experience.

## [CRITICAL] Multiple Active Entries Crash

The application crashes with a client-side exception if `getActiveEntry` returns multiple rows (PGRST116). This must be fixed in `src/actions/time-entries.ts` by using `.limit(1)` or similar, and ideally adding a DB constraint.

## Commit Plan

- **Commit 1**: "fix: resolve lint errors and React hook violations"
- **Commit 2**: "fix: address UI/UX inconsistencies and layout issues"
- **Commit 3**: "feat: polish additional pages (About, Terms, etc.)"
- **Commit 4**: "test: stabilize E2E suite and ensure 100% pass rate"

## Tasks

### Phase 1: Tech Debt & Linting [COMPLETED]

- [x] Task 1: Eliminate `Unexpected any` Types
- [x] Task 2: Resolve React Hook violations (`set-state-in-effect`)

### Phase 2: E2E Test Stabilization [IN PROGRESS]

- [/] Task 3: Fix "Task Input Not Visible" flakiness
  - Description: Investigate hydration delays and `TimerController` mounting logic. Remove `setTimeout` from `isMounted` if possible.
  - LOGGING: Log mount timing and visibility states in tests.
- [ ] Task 4: Fix Project Deletion UI race conditions
  - Description: Ensure project list updates correctly after creation in E2E tests.
- [ ] Task 5: Final Verification Loop
  - Description: Run full test suite 3 times to ensure zero transience.

### Phase 3: UI/UX & Functional Audit

- [x] Task 6: Comprehensive UI Audit via Browser (Partially Done)
  - Description: Navigate all pages (Dashboard, Projects, Reports, About, etc.), check responsiveness, contrast, and accessibility.
  - Findings: Dashboard crashes, Reports has duplicate headings and empty charts.
- [x] Task 4.1: Fix `getActiveEntry` Multi-Row Crash
  - Description: Update `src/actions/time-entries.ts` to handle or limit multiple active entries.
  - Files: `src/actions/time-entries.ts`
- [x] Task 5: Fix Identified UI Bugs
  - Description: Address issues found in Task 4.
  - Files: `src/components/features/ReportsView.tsx` (Remove duplicate heading)

### Phase 3: Page Polishing

- [ ] Task 6: Review and Enhance Additional Pages
  - Description: Ensure `About`, `Terms`, `Privacy`, and `Contact` pages are not just placeholders but fully styled and informative.
  - Files: `src/app/about/page.tsx`, etc.

### Phase 4: Final Stability

- [ ] Task 7: Stabilize E2E Tests
  - Description: Fix timeouts and flakiness in `layout.spec.ts` and `timer.spec.ts`.
  - Files: `tests/e2e/*.spec.ts`
- [ ] Task 8: Final Validation Run
  - Description: Run `npm run validate` and ensure zero errors.
