import { createClient } from '@/lib/supabase-server';
import { TimeEntryWithProject } from '@/types';
import { revalidatePath } from 'next/cache';
import { handleServiceError } from '@/lib/error-handler';

export async function getActiveEntry() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from('time_entries')
      .select('*, projects(*)')
      .eq('user_id', user.id)
      .is('end_time', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as TimeEntryWithProject | null;
  } catch (error) {
    return handleServiceError(error, 'Failed to fetch active entry');
  }
}

export async function getTimeEntries() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('time_entries')
      .select('*, projects(*)')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data as TimeEntryWithProject[];
  } catch (error) {
    return handleServiceError(error, 'Failed to fetch time entries');
  }
}

export async function startTimer(taskName: string, projectId: string | null) {
  try {
    if (!taskName?.trim()) {
      throw new Error('Task name is required');
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Stop any active timer first
    const active = await getActiveEntry();
    if (active && 'id' in active) {
      await stopTimer(active.id);
    }

    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        task_name: taskName.trim(),
        project_id: projectId,
        start_time: new Date().toISOString(),
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/');
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to start timer');
  }
}

export async function stopTimer(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('time_entries')
      .update({ end_time: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    revalidatePath('/');
  } catch (error) {
    return handleServiceError(error, 'Failed to stop timer');
  }
}

export async function updateTimeEntry(
  id: string,
  updates: {
    task_name?: string;
    project_id?: string | null;
    start_time?: string;
    end_time?: string | null;
  }
) {
  try {
    if (updates.task_name !== undefined && !updates.task_name.trim()) {
      throw new Error('Task name cannot be empty');
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('time_entries')
      .update({
        ...updates,
        task_name: updates.task_name?.trim(),
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/reports');
  } catch (error) {
    return handleServiceError(error, 'Failed to update time entry');
  }
}

export async function deleteTimeEntry(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/reports');
  } catch (error) {
    return handleServiceError(error, 'Failed to delete time entry');
  }
}

export async function createTimeEntry(entry: {
  task_name: string;
  project_id: string | null;
  start_time: string;
  end_time: string;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        ...entry,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/reports');
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to create time entry');
  }
}
