# Feature: Global QA Verification — 100% TZ Compliance

## Context

The Arctic Time Tracker is nearing completion. A final, rigorous QA cycle is required to ensure every single requirement from the Technical Specification (TZ) is met with world-class quality. This verification will be performed automatically using the `browser_subagent` and manual code audits.

## Objectives

- **100% TZ Coverage**: Verify all 25 identified requirements.
- **Zero Critical Bugs**: Ensure core flows (Timer, Entries, Reports) are flawless.
- **World-Class Quality**: Verify UI/UX Polish, Responsive Design, and Performance.

## Requirements Checklist (TZ Mapped)

### A. Core Timer

- [ ] **Start/Stop**: Work correctly? Updates UI immediately?
- [ ] **Active Timer**: Visible on all pages? Persists on reload?
- [ ] **Autocomplete**: Suggestions appear when typing task name?
- [ ] **Project Selection**: Can select/change project?

### B. Time Entries

- [ ] **List**: Shows today's entries? Grouped by day?
- [ ] **Edit**: Can change Name, Project?
- [ ] **Manual Time**: Can edit Start/End times?
- [ ] **Delete**: Can remove entry?

### C. Projects

- [ ] **CRUD**: Create (Name+Color), Edit, List.
- [ ] **Colors**: Display correctly in list and dropdowns?

### D. Reports

- [ ] **Filters**: Day, Week, Month work?
- [ ] **Charts**: Visualization renders correctly?
- [ ] **Export**: CSV download works?

### E. Technical & Architecture

- [ ] **Clean Code**: No "silliness", proper file structure.
- [ ] **State**: Context/Optimistic updates used correctly.
- [ ] **DB**: Supabase RLS policies enabled.
- [ ] **Security**: Zod validation on actions.

## Detailed Execution Scripts (for Browser Subagent & Audit)

### Task 1: Environment & Code Integrity

- **Command**: `npm run validate`
- **Output**: Screenshot of terminal success.
- **Manual Check**: verify `vercel.json` exists.

### Task 2: Authentication Flow

- **Browser Task**: "Navigate to /login. Log in as 'admin@arctictime.com' / 'Password123!'. Verify redirect to timer page. reload the page. verify session persists."
- **Expected**: Dashboard visible, no login redirect.

### Task 3: Core Timer & Autocomplete

- **Browser Task**: "Type 'Test Auto' in task input. Check if suggestions dropdown appears (mock or real). Select Project 'Audit Pro'. Click Start. Verify 'Active Timer' component appears with running seconds. Navigate to 'Reports'. Verify 'Active Timer' is STILL visible at the bottom/top. Click Stop."
- **Edge Case**: Rapid start/stop.

### Task 4: Time Entries Management

- **Browser Task**: "Find the entry just stopped. Click Edit. Change name to 'QA Verified Task'. Change Project to 'Audit Pro'. Save. Open Manual Time Edit (click duration). Change Start Time to 1 hour earlier. Save. Verify Total Time updated. Click Delete button. Verify entry disappears."
- **Grouping Check**: Verify headers like 'Today', 'Yesterday' exist.

### Task 5: Project Management

- **Browser Task**: "Navigate to Projects. Click 'New Project'. Enter Name 'QA Release'. Select Color 'Purple' (or hex #800080). Save. Verify 'QA Release' appears in list with purple badge. Click Edit on it. Change name to 'QA Release Final'. Save. Verify update."

### Task 6: Reports & Export

- **Browser Task**: "Navigate to Reports. Click 'Week' tab. Verify Bar Chart is visible. Click 'Month' tab. Verify Pie Chart is visible. Click 'Export CSV'. Verify download initiated (file name usually 'time-entries.csv')."

### Task 7: Responsive Design (Mobile First)

- **Browser Task**: "Set viewport to 375x812 (iPhone X). Verify Navbar collapses to Hamburger menu. Verify Timer input stacks vertically or stays accessible. Verify Time Entry list is readable (no overflow). Verify Reports charts don't break layout."
- **Tablet**: "Set viewport 768x1024. Verify layout is adaptive."

### Task 8: Architecture & Security Audit (Manual Code Review)

1. **Middleware**: Check `src/middleware.ts` for `updateSession`.
2. **Input Validation**: Check `src/actions/time-entries.ts` for `zod` schema usage.
3. **RLS Policies**: Check `supabase/migrations/*` or `schema` for `alter table ... enable row level security`.
4. **CSP**: Check `next.config.ts` or `middleware.ts` for headers.

### Task 9: General Polish (Visuals)

- **Browser Task**: "Check for 'glassmorphism' effects on cards. Check hover states on buttons. Check loading skeletons/spinners during data fetch."

## Deliverables

- `verification_report.md`: Detailed logs + Screenshots.
- `task.md`: Updated status.
