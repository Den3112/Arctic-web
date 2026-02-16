import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const REQUIRED_NODE_VERSION = 18;

function checkNodeVersion(): boolean {
  const [major] = process.versions.node.split('.').map(Number);
  if (major < REQUIRED_NODE_VERSION) {
    console.error(
      `❌ Node.js ${REQUIRED_NODE_VERSION}+ is required. You have v${process.versions.node}.`
    );
    console.error('   Download: https://nodejs.org/');
    return false;
  }
  console.log(`✅ Node.js v${process.versions.node}`);
  return true;
}

function checkEnvFile(): boolean {
  const envPath = join(process.cwd(), '.env.local');
  const examplePath = join(process.cwd(), '.env.example');

  if (!existsSync(envPath)) {
    console.warn('⚠️  .env.local not found. Creating from .env.example...');
    execSync(`cp ${examplePath} ${envPath}`);
    console.log('✅ Created .env.local');
    console.log('');
    console.log('📋 Next steps:');
    console.log(
      '   1. Go to https://supabase.com/dashboard → Your Project → Settings → API'
    );
    console.log(
      '   2. Copy Project URL → paste as NEXT_PUBLIC_SUPABASE_URL in .env.local'
    );
    console.log(
      '   3. Copy anon public key → paste as NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
    console.log('');
    return false;
  }

  // Check if placeholder values are still present
  const envContent = readFileSync(envPath, 'utf-8');
  const hasPlaceholders =
    envContent.includes('your-project-ref') ||
    envContent.includes('your-anon-key-here');

  if (hasPlaceholders) {
    console.warn('⚠️  .env.local contains placeholder values!');
    console.log(
      '   Please fill in your real Supabase credentials in .env.local'
    );
    console.log(
      '   Get them from: https://supabase.com/dashboard → Settings → API'
    );
    return false;
  }

  console.log('✅ .env.local configured');
  return true;
}

async function setup() {
  console.log('');
  console.log('🧊 ArcticTime — Project Setup');
  console.log('═'.repeat(40));
  console.log('');

  // 1. Check Node.js version
  if (!checkNodeVersion()) {
    process.exit(1);
  }

  // 2. Check environment file
  const envReady = checkEnvFile();

  if (!envReady) {
    console.log('');
    console.log(
      '⏭️  Fill in .env.local, then run "npm run setup" again to verify.'
    );
    console.log(
      '   Or just run "npm run dev" — the app will tell you if env is missing.'
    );
    return;
  }

  // 3. Run Lint
  console.log('');
  console.log('🔍 Running linting...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('✅ Linting passed.');
  } catch {
    console.error('❌ Linting failed. Run "npm run lint:fix" to auto-fix.');
  }

  // 4. Run Tests
  console.log('');
  console.log('🧪 Running unit tests...');
  try {
    execSync('npm run test', { stdio: 'inherit' });
    console.log('✅ Unit tests passed.');
  } catch {
    console.error('❌ Unit tests failed.');
  }

  console.log('');
  console.log('═'.repeat(40));
  console.log('✨ Setup complete! Run "npm run dev" to start the application.');
  console.log('   Open http://localhost:3000 in your browser.');
  console.log('');
}

setup().catch((err) => {
  console.error('FATAL Setup error:', err);
  process.exit(1);
});
