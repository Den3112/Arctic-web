# PROMPTS.md — AI Development Log

> Лог розробки проєкту **ArcticTime** виключно через AI-інструменти.  
> Cursor IDE + ai-factory skills · Лютий 2026

---

## Підхід до роботи з AI

Весь проєкт побудований через систему **ai-factory** — набір slash-команд для Cursor IDE, які структурують процес розробки:

| Команда                 | Що робить                                                |
| ----------------------- | -------------------------------------------------------- |
| `/ai-factory.init`      | Ініціалізація проєкту, завантаження skills               |
| `/ai-factory.feature`   | Створення нових фіч (Auth, Timer, Reports)               |
| `/ai-factory.implement` | Генерація коду (Server Actions, тести, деплой)           |
| `/ai-factory.improve`   | Покращення UI/UX, рефакторинг, оптимізація               |
| `/ai-factory.fix`       | Виправлення багів (з автоматичним логуванням у patches/) |
| `/ai-factory.docs`      | Генерація документації                                   |

---

## День 1 — 13 лютого 2026

### 10:00 · Ініціалізація проєкту

```
/ai-factory.init
```

**Промпт:** _«Create a Time Tracker app with Next.js App Router and Supabase. Set up the project structure following Clean Architecture: components, services, hooks, API client layers. Create Supabase schema with projects and time_entries tables, enable RLS.»_

**Результат:**

- Згенерована структура: `src/app`, `src/components`, `src/services`, `src/hooks`, `src/lib`
- Міграція `20260213_initial_schema.sql` з таблицями `projects`, `time_entries`
- RLS-політики для захисту даних користувачів

### 11:15 · Сервісний шар та Server Actions

```
/ai-factory.implement
```

**Промпт:** _«Refactor business logic into service layer. Create timeService.ts and projectService.ts. Implement startTimerAction and stopTimerAction as Server Actions. Switch useTimeTracker hook to use server actions for persistence.»_

**Результат:**

- `src/services/timeService.ts`, `src/services/projectService.ts`
- `startTimerAction`, `stopTimerAction` у `src/app/actions.ts`
- Хук `useTimeTracker` переведений на Server Actions

### 12:30 · UI/UX та Аутентифікація

```
/ai-factory.feature
```

**Промпт:** _«Implement Login/Registration pages with Supabase Auth. Add ActiveTimerBanner for global timer visibility. Create premium dark theme with Bento-style cards. Implement CSV export for reports.»_

**Результат:**

- Сторінки Login/Registration з Supabase Auth
- Sticky-баннер `ActiveTimerBanner` — таймер видно на всіх сторінках
- Premium Dark Theme для Dashboard та Projects
- CSV-експорт у Reports

### 13:20 · Відповідність ТЗ

```
/ai-factory.feature
```

**Промпт:** _«Add task name autocomplete using datalist. Create modal for manual time entry editing (project, start/end time). Fix NaN:NaN:NaN timer display bug during page navigation.»_

**Результат:**

- Автодоповнення назви задачі
- Модальне вікно редагування записів
- Виправлений баг таймера при навігації

### 14:05 · Локалізація

```
/ai-factory.implement
```

**Промпт:** _«Create i18n infrastructure with LanguageContext. Support English (default) and Ukrainian. Add language switcher to navbar.»_

**Результат:**

- `LanguageContext` + словники `src/locales/en.ts`, `uk.ts`
- Перемикач мови в навбарі

### 14:45 · Premium UI

```
/ai-factory.improve
```

**Промпт:** _«Transform the UI with glassmorphism effects, mesh gradient backgrounds with animated blobs, and Framer Motion page transitions. Make it look world-class.»_

**Результат:**

- Glassmorphism на картках (CSS-клас `glass-card`)
- Animated mesh gradient фони
- Framer Motion анімації переходів

---

## День 2 — 15 лютого 2026

### 10:00 · Інтеграція Skills

```
/ai-factory.init --skills
```

**Промпт:** _«Load specialized skills for React patterns, Playwright POM testing, security checklist, and design systems. Create project-specific standards.»_

**Результат:**

- 14 skills у `.gemini/skills/` (React, Playwright, Security, Design та ін.)
- Єдиний стандарт `arctictime-standards.md`
- Гайд для E2E-тестів по Page Object Model

### 10:30 · Оновлення залежностей

```
/ai-factory.improve
```

**Промпт:** _«Update all dependencies to latest stable. Replace hardcoded localhost with NEXT_PUBLIC_SITE_URL. Run regression tests.»_

**Результат:**

- Next.js, Supabase, React — оновлені до останніх версій
- Замінено хардкод localhost
- Регресійне E2E-тестування пройшло

### 14:45–15:25 · Серія патчів (4 виправлення)

```
/ai-factory.fix (×4)
```

| Промпт                                                                                   | Проблема                                         | Рішення                                                |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| _«Fix mobile menu overflow, disable heavy CSS blur on mobile, fix reports chart height»_ | Меню обрізалось, лаг на мобільних, чарти зламані | `overflow-y-auto`, `@media` для blur, адаптивна висота |
| _«Restore Pie Chart: add Legend component, show labels on segments >5%»_                 | Pie Chart без підписів                           | Стандартний `Legend`, лейбли на сегментах              |
| _«Fix Pie Chart tooltip cursor showing white square artifact»_                           | Білий квадрат при наведенні                      | `cursor={false}` на `<Tooltip>`                        |
| _«Fix Pie Chart label text overflow, switch to percentage labels»_                       | Текст обрізається                                | Відсотки замість імен, `outerRadius: 80`               |

### 15:20 · E2E тести для Reports

```
/ai-factory.implement
```

**Промпт:** _«Create Playwright test for Time Distribution: verify header, Pie Chart visibility, Legend presence, absence of tooltip cursor artifact.»_

**Результат:** `tests/e2e/reports.spec.ts` — 2/2 тестів пройшли (14.9s)

### 21:35 · Edge case: мобільне меню

```
/ai-factory.fix
```

**Промпт:** _«Mobile menu stays open when clicking nav link to current page. Next.js doesn't trigger pathname change for same-page navigation.»_

**Рішення:** Dual state management — `onClick` для негайного закриття + `pathname` моніторинг як fallback.

### 22:10 · UI аудит та стабілізація E2E

```
/ai-factory.improve
```

**Промпт:** _«Full UI audit: fix double ActiveTimerBanner, improve autocomplete reliability, fix E2E regressions in layout and projects specs.»_

**Результат:**

- Усунено «Double Banner» (консолідація)
- Покращено автодоповнення у `TimerController`
- **15/15 E2E-тестів проходять стабільно**
- Підтверджено відповідність усім вимогам ТЗ

---

## День 3 — 16 лютого 2026

### 05:35 · Критичний баг: видалення проєктів

```
/ai-factory.fix
```

**Промпт:** _«Project deletion fails with FK constraint violation. window.confirm gives no feedback. Need soft delete strategy with visual feedback.»_

**Рішення:**

- Soft Delete (поле `deleted_at`) замість CASCADE
- Кастомний `AlertDialog` замість `window.confirm`
- Loading state на кнопці видалення

### 12:48 · Production Release v1.0.0

```
/ai-factory.implement
```

**Промпт:** _«Prepare for production: git init, configure vercel.json, update .env.example, add Deploy-to-Vercel badge to README.»_

**Коміти:**

- `feat: complete project release v1.0.0 (Arctic Time Tracker)`
- `docs: add live deployment link`
- `fix: prepare for production release v1.0.0 (lint fixes, cleanup, config)`

### 14:30 · Рефакторинг Reports Layout

```
/ai-factory.improve
```

**Промпт:** _«Restructure Reports page: split broken grid-cols-3 into separate rows — 3-column summary cards, 2-column charts, full-width table. Add avg time per task stat card. Standardize chart heights.»_

**Результат:**

- 4 окремих секції замість одного зламаного grid
- Нова картка «Середній час на задачу»
- Висота чартів стандартизована (420px)
- i18n заголовок сторінки (EN/UK)

### 15:30 · Абсолютна фінальна верифікація

```
/ai-factory.feature + /ai-factory.implement
```

**Промпт:** _«Perform absolute final verification of Arctic Time Tracker. Check all 25+ TZ requirements via browser testing, code review, and automated validation. Cover: Timer, Entries, Projects, Reports, Localization, Responsiveness, Security, Architecture.»_

**Результат:**

- 42 точки верифікації перевірено: 100% відповідність ТЗ
- Browser-тестування: Timer start/stop, persistence, CRUD entries/projects, CSV export, charts
- Локалізація: EN↔UK переключення підтверджено
- Респонсивний дизайн: 375px → 1920px
- Безпека: RLS-політики, CSP, Security Headers, Zod-валідація

### 16:00 · ESLint cleanup

```
/ai-factory.fix
```

**Промпт:** _«Fix ESLint scanning .vercel/ build artifacts causing 4924 false positives. Fix unused error variable in ProjectForm.tsx.»_

**Рішення:**

- Додано `.vercel/**` до ignores у `eslint.config.mjs`
- Видалено невикористану змінну `error` у `ProjectForm.tsx`
- `npm run lint` → 0 errors, 0 warnings

### 16:05 · Production Release v1.0.1

```
/ai-factory.implement
```

**Промпт:** _«Push all changes to production. Update documentation and deploy to Vercel.»_

**Коміти:**

- `fix: eslint cleanup and final audit fixes for production v1.0.1`

---

## Архітектурні рішення

| Рішення              | Обґрунтування (промпт/контекст)                                  |
| -------------------- | ---------------------------------------------------------------- |
| Clean Architecture   | Розділення: UI → Features → Services → Server Actions → Supabase |
| Soft Delete          | Збереження даних користувача замість CASCADE                     |
| Context-based i18n   | Легкий підхід без next-intl для мінімізації бандлу               |
| Glassmorphism Design | Єдиний візуальний стиль через CSS-клас `glass-card`              |
| Dynamic Imports      | Lazy loading Recharts для оптимізації First Load                 |

## Тестування

- **Unit Tests**: Vitest — бізнес-логіка, утиліти
- **E2E Tests**: Playwright — 15+ сценаріїв (Timer, Projects, Reports, Auth, Responsive)
- **Browser Audit**: 3 viewport'и (375px, 768px, 1920px)
- **Build**: `npm run validate` — lint + type-check + tests = 0 помилок

## Підсумок

| Метрика           | Значення          |
| ----------------- | ----------------- |
| Період розробки   | 13–16 лютого 2026 |
| AI-сесій          | 30+               |
| Патчів виправлень | 9                 |
| E2E тестів        | 15+               |
| Покриття ТЗ       | 100%              |
