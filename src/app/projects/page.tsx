import { getProjects } from '@/actions/projects';

export const dynamic = 'force-dynamic';
import { ProjectList } from '@/components/features/projects/ProjectList';
import { createClient } from '@/lib/supabase-server';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const projects = await getProjects();

  return (
    <div className="container py-8">
      <ProjectList projects={projects} />
    </div>
  );
}
