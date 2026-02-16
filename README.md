# ArcticTime - Professional Time Tracker

[![Stack](https://img.shields.io/badge/Stack-Next.js_16_|_Supabase-black?style=for-the-badge)](https://nextjs.org/)

**Test Task Submission** | [Prompts Log](PROMPTS.md)

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

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **Styling**: Vanilla CSS & TailwindCSS (Selection: OKLCH support)
- **Formatting**: [Prettier](https://prettier.io/)
- **State Management**: Server Actions & React Hooks
- **Testing**: Vitest (Unit) & Playwright (E2E)
- **Icons**: Lucide React

## 💎 Repository Standards

This project follows world-class development standards to ensure code quality and consistency:

- **Pre-commit Hooks**: Powered by [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged).
- **Automated Formatting**: Ensured by [Prettier](https://prettier.io/) before every commit.
- **Continuous Integration**: GitHub Actions verify every PR with parallel jobs for Lint, Type-check, and Build.
- **Dependency Management**: [Dependabot](https://github.com/dependabot) ensures all libraries are up-to-date.
- **Maintenance**: Automated stale issue management for a healthy backlog.

## 📦 Project Structure

```text
src/
├── app/             # Routing & Server Actions
├── components/      # UI components (layout, sections, ui, features)
├── services/        # Business logic & Data access layer
├── hooks/           # Custom reusable React logic
├── locales/         # Translation dictionaries
└── lib/             # Third-party configurations
tests/
├── e2e/             # Playwright E2E tests
└── unit/            # Vitest unit tests
```

## 🏗 Setup & Onboarding

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Den3112/Arctic-web.git
   cd Arctic-web
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run Onboarding Script**:
   This script verifies your environment, sets up `.env.local`, and runs initial checks.

   ```bash
   npm run setup
   ```

4. **Fill in Credentials**:
   Edit `.env.local` and add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

5. **Run development server**:
   ```bash
   npm run dev
   ```

## 🧪 Testing

We value quality. Run our test suites to ensure stability:

- **Unit Tests**: `npm run test`
- **E2E Tests**: `npm run test:e2e`

## 🚀 Deployment

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

## 📜 License

This project is created for educational/testing purposes.
