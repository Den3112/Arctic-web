# ArcticTime - Professional Time Tracker

[![Stack](https://img.shields.io/badge/Stack-Next.js_16_|_Supabase-black?style=for-the-badge)](https://nextjs.org/)

**Test Task Submission** | [Prompts & AI Log](PROMPTS.md) | [Live Demo](https://arctic-web-solutions.vercel.app/)

Advanced time tracking application built with Clean Architecture, Next.js 16, and Supabase.

## 🚀 Features

- **Real-time Tracker**: Start/stop timer with active session visibility.
- **Auto-suggestions**: Task name completion based on your history.
- **Project Management**: Group tasks by projects with custom colors.
- **Advanced Editing**: Manual time correction (HH:mm) and task details editing.
- **Reporting**: Weekly/monthly reports with CSV export.
- **Multi-language Support**: English and Ukrainian localization out of the box.
- **Clean Architecture**: Separation of concerns (UI, Features, Services, Data layers).

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **Styling**: TailwindCSS 4
- **State Management**: Server Actions & React Hooks
- **Testing**: Vitest (Unit) & Playwright (E2E)
- **Icons**: Lucide React

## 📦 Project Structure

```text
src/
├── app/             # Routing & Server Actions
├── components/      # UI components (layout, sections, ui, features)
├── services/        # Business logic & Data access layer
├── hooks/           # Custom reusable React logic
├── locales/         # Translation dictionaries (en, uk)
└── lib/             # Third-party configurations (Supabase client)
supabase/
└── migrations/      # SQL migration files (run in order)
scripts/
└── setup.ts         # Automated setup script
tests/
├── e2e/             # Playwright E2E tests
└── unit/            # Vitest unit tests
```

---

## 🏗 Local Setup (Step by Step)

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Supabase account** — free at [supabase.com](https://supabase.com/)

### Step 1: Clone the repository

```bash
git clone https://github.com/Den3112/Arctic-web.git
cd Arctic-web
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Choose a name (e.g. `arctictime`), set a database password, select a region
4. Wait ~2 minutes for the project to initialize

### Step 4: Apply database schema

Run all 3 migration files **in order** via the Supabase SQL Editor:

1. Go to your project → **SQL Editor** → click **"New query"**
2. Copy & paste the contents of each file, then click **"Run"**:

| Order | File                                               | What it does                                                                |
| ----- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| 1     | `supabase/migrations/20260213_initial_schema.sql`  | Tables (`profiles`, `projects`, `time_entries`), RLS policies, auth trigger |
| 2     | `supabase/migrations/20260214_optimize_schema.sql` | Indexes for performance, time constraint                                    |
| 3     | `supabase/migrations/20260215_world_class_db.sql`  | Soft deletes, `updated_at` triggers, `user_settings` table, analytics view  |

> **Tip:** You can also run all 3 files in one query by pasting them sequentially.

### Step 5: Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```bash
# Get these from: Supabase Dashboard → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co    # Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...              # anon / public key
```

**Where to find the keys:**

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project → **Settings** → **API**
3. Copy **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy **anon public** key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 6: Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

🎉 **Done!** Create an account and start tracking time.

---

## 🧪 Testing

```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Playwright) — requires dev server running
npm run test:e2e

# Full validation (lint + type-check + format + tests)
npm run validate
```

## 🔨 Production Build

```bash
# Build the production bundle
npm run build

# Start the production server
npm run start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## 📝 Available Scripts

| Script             | Description                               |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Start development server                  |
| `npm run build`    | Run validation + production build         |
| `npm run start`    | Start production server                   |
| `npm run lint`     | Run ESLint                                |
| `npm run format`   | Format code with Prettier                 |
| `npm run test`     | Run unit tests (Vitest)                   |
| `npm run test:e2e` | Run E2E tests (Playwright)                |
| `npm run validate` | Full check: lint + types + format + tests |
| `npm run setup`    | Automated onboarding script               |
| `npm run clean`    | Remove build artifacts                    |

## 🚀 Deployment (Vercel)

### Deploy to Vercel

1. **Push to GitHub**:
   Ensure you have pushed this repository to your GitHub account.

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click "Add New..." -> "Project".
   - Import your `Arctic-web` repository.

3. **Configure Environment**:
   Add the following Environment Variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (e.g., `https://your-project.vercel.app`)

4. **Deploy**:
   Click "Deploy". Vercel will automatically detect the Next.js framework and build your application.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDen3112%2FArctic-web)

---

## 💎 Repository Standards

- **Pre-commit Hooks**: Powered by [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged).
- **Automated Formatting**: Ensured by [Prettier](https://prettier.io/) before every commit.
- **Continuous Integration**: GitHub Actions verify every PR with parallel jobs for Lint, Type-check, and Build.

---

## 📜 License

This project is created for educational/testing purposes.
