import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    'Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('🌱 Seeding world-class sample data...');

  // 1. Get a user (or use a placeholder if needed, but we need someone to own the data)
  const {
    data: { users },
    error: usersError,
  } = await supabase.auth.admin.listUsers();

  if (usersError || !users.length) {
    console.error(
      'No users found to seed data for. Please register a user first.'
    );
    return;
  }

  const userId = users[0].id;
  console.log(`Using user ID: ${userId}`);

  // 2. Clear existing (logical) data if needed or just add new
  // In this case, we'll just add fresh projects

  const projects = [
    { name: 'ArcticTime UI/UX', color: '#3b82f6', user_id: userId },
    { name: 'Core Engine Dev', color: '#10b981', user_id: userId },
    { name: 'Market Research', color: '#f59e0b', user_id: userId },
    { name: 'Legal & Compliance', color: '#ef4444', user_id: userId },
  ];

  console.log('Creating projects...');
  const { data: createdProjects, error: projectError } = await supabase
    .from('projects')
    .insert(projects)
    .select();

  if (projectError) {
    console.error('Error creating projects:', projectError);
    return;
  }

  const projectIds = createdProjects.map((p) => p.id);

  // 3. Create time entries for the last 3 days
  const entries = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    const startTime = new Date(now);
    startTime.setHours(startTime.getHours() - i * 4 - Math.random() * 2);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30 + Math.random() * 120);

    entries.push({
      task_name: `World-Class Task #${i + 1}`,
      project_id: projectIds[i % projectIds.length],
      user_id: userId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    });
  }

  console.log('Creating time entries...');
  const { error: entriesError } = await supabase
    .from('time_entries')
    .insert(entries);

  if (entriesError) {
    console.error('Error creating entries:', entriesError);
    return;
  }

  // 4. Create default settings
  console.log('Creating user settings...');
  await supabase.from('user_settings').upsert({
    user_id: userId,
    theme: 'dark',
    timezone: 'UTC',
    week_start: 1,
  });

  console.log('✅ Seeding completed successfully!');
}

seed().catch(console.error);
