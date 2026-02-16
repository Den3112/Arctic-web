import { createClient } from '@/lib/supabase-server';
import { Project } from '@/types';
import { revalidatePath } from 'next/cache';
import { handleServiceError } from '@/lib/error-handler';

export async function getProjects() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Project[];
  } catch (error) {
    return handleServiceError(error, 'Failed to fetch projects');
  }
}

export async function getProjectsWithStats() {
  try {
    const supabase = await createClient();

    // Fetch projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectsError) throw projectsError;

    // Fetch time entries for stats aggregation
    const { data: entries, error: entriesError } = await supabase
      .from('time_entries')
      .select('project_id, start_time, end_time')
      .not('end_time', 'is', null);

    if (entriesError) throw entriesError;

    // Aggregate stats
    const statsMap = new Map<string, { duration: number; count: number }>();

    (entries || []).forEach((entry) => {
      if (!entry.project_id) return;

      const existing = statsMap.get(entry.project_id) || {
        duration: 0,
        count: 0,
      };

      let duration = 0;
      if (entry.end_time && entry.start_time) {
        duration =
          new Date(entry.end_time).getTime() -
          new Date(entry.start_time).getTime();
      }

      statsMap.set(entry.project_id, {
        duration: existing.duration + duration,
        count: existing.count + 1,
      });
    });

    return (projects as Project[]).map((p) => ({
      ...p,
      total_duration: statsMap.get(p.id)?.duration || 0,
      tasks_count: statsMap.get(p.id)?.count || 0,
    }));
  } catch (error) {
    return handleServiceError(error, 'Failed to fetch projects with stats');
  }
}

export async function createProject(name: string, color: string) {
  try {
    if (!name?.trim()) {
      throw new Error('Project name is required');
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: name.trim(),
        color,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/projects');
    revalidatePath('/');
    return data as Project;
  } catch (error) {
    return handleServiceError(error, 'Failed to create project');
  }
}

export async function updateProject(id: string, name: string, color: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('projects')
      .update({ name, color })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/projects');
    revalidatePath('/');
  } catch (error) {
    return handleServiceError(error, 'Failed to update project');
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = await createClient();

    // Manual Cascade: Delete time entries first
    const { error: entriesError } = await supabase
      .from('time_entries')
      .delete()
      .eq('project_id', id);

    if (entriesError) throw entriesError;

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) throw error;
    revalidatePath('/projects');
    revalidatePath('/');
  } catch (error) {
    return handleServiceError(error, 'Failed to delete project');
  }
}
