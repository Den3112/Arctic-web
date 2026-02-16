import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
import { TrackerContainer } from '@/components/features/TrackerContainer';
import { getProjects } from '@/actions/projects';
import { TimeEntryWithProject } from '@/types';
import { LandingHero } from '@/components/layout/LandingHero';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingHero />;
  }

  // Fetch entries (Server Side Initial Data)
  const { data: entries } = await supabase
    .from('time_entries')
    .select('*, projects(*)')
    .eq('user_id', user.id)
    .order('start_time', { ascending: false });

  // Fetch projects
  const projects = await getProjects();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-display font-bold tracking-tight premium-gradient-text uppercase">
          Time Tracker
        </h1>

        <TrackerContainer
          initialProjects={projects || []}
          initialEntries={(entries as unknown as TimeEntryWithProject[]) || []}
        />
      </div>
    </div>
  );
}
