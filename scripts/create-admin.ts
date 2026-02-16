import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  const email = 'admin@arctictime.com';
  const password = 'Password123!';

  console.log(`Checking if user exists: ${email}`);

  // Check if user exists
  const { data: users, error: listError } =
    await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  const existingUser = users.users.find((u) => u.email === email);

  if (existingUser) {
    console.log(`User exists (${existingUser.id}), deleting...`);
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      existingUser.id
    );
    if (deleteError) {
      console.error('Error deleting user:', deleteError.message);
      return;
    }
    console.log('User deleted.');
  }

  console.log(`Creating user: ${email}`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: 'Admin User',
    },
  });

  if (error) {
    console.error('Error creating user:', error.message);
    return;
  }

  console.log('User created successfully:', data.user.id);
}

createAdminUser();
