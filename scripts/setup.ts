import { existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

async function setup() {
  console.log('🚀 Starting ArcticTime Setup...');

  // 1. Check for .env
  const envPath = join(process.cwd(), '.env.local');
  if (!existsSync(envPath)) {
    console.warn('⚠️  .env.local not found. Creating from .env.example...');
    execSync('cp .env.example .env.local');
    console.log(
      '✅ Created .env.local. Please fill in your Supabase credentials.'
    );
  } else {
    console.log('✅ .env.local already exists.');
  }

  // 2. Install dependencies (usually done by user, but nice to check)
  // console.log('📦 Verifying dependencies...')
  // execSync('npm install', { stdio: 'inherit' })

  // 3. Run Lint
  console.log('🔍 Running linting...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('✅ Linting passed.');
  } catch {
    console.error('❌ Linting failed. Please fix issues before proceeding.');
  }

  // 4. Run Tests
  console.log('🧪 Running unit tests...');
  try {
    execSync('npm run test', { stdio: 'inherit' });
    console.log('✅ Unit tests passed.');
  } catch {
    console.error('❌ Unit tests failed.');
  }

  console.log(
    '\n✨ Setup complete! Run "npm run dev" to start the application.'
  );
}

setup().catch((err) => {
  console.error('FATAL Setup error:', err);
  process.exit(1);
});
