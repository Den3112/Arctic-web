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
  // Optimisation: We could fetch only necessary fields or limit by default to current month if volume is huge
  const { data: entries } = await supabase
    .from('time_entries')
    .select('*, projects(*)')
    .eq('user_id', user.id)
    .not('end_time', 'is', null) // Only completed entries
    .order('start_time', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight premium-gradient-text uppercase">
          Reports
        </h1>
        <p className="text-muted-foreground mt-2">
          Analyze your productivity and export data.
        </p>
      </div>

      <ReportsView entries={entries || []} />
    </div>
  );
}
