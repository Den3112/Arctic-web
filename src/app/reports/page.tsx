import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
import { ReportsView } from '@/components/features/ReportsView';

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Should be handled by middleware
    return null;
  }

  // Fetch all entries for the user
  const { data: entries } = await supabase
    .from('time_entries')
    .select('*, projects(*)')
    .eq('user_id', user.id)
    .not('end_time', 'is', null) // Only completed entries
    .order('start_time', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <ReportsView entries={entries || []} />
    </div>
  );
}
