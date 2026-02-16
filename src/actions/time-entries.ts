'use server';

import { TimeEntryWithProject } from '@/types';
import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import * as timeService from '@/services/timeService';

export async function getActiveEntry(): Promise<TimeEntryWithProject | null> {
  return timeService.getActiveEntry();
}

export async function startTimer(taskName: string, projectId: string | null) {
  const schema = z.object({
    taskName: z.string().min(1),
    projectId: z.string().nullable(),
  });
  const validated = schema.parse({ taskName, projectId });
  const result = await timeService.startTimer(
    validated.taskName,
    validated.projectId
  );
  revalidatePath('/');
  revalidatePath('/reports');
  return result;
}

export async function stopTimer(id: string) {
  const result = await timeService.stopTimer(id);
  revalidatePath('/');
  revalidatePath('/reports');
  return result;
}

export async function deleteEntry(id: string) {
  const result = await timeService.deleteTimeEntry(id);
  revalidatePath('/');
  revalidatePath('/reports');
  return result;
}

export async function updateEntry(
  id: string,
  updates: Partial<TimeEntryWithProject>
) {
  const result = await timeService.updateTimeEntry(id, updates);
  revalidatePath('/');
  revalidatePath('/reports');
  return result;
}

export async function createEntry(entry: {
  task_name: string;
  project_id: string | null;
  start_time: string;
  end_time: string;
}) {
  const schema = z.object({
    task_name: z.string().min(1),
    project_id: z.string().nullable(),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
  });
  const validated = schema.parse(entry);
  const result = await timeService.createTimeEntry(validated);
  revalidatePath('/');
  revalidatePath('/reports');
  return result;
}
