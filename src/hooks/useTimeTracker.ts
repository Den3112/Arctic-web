'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { Project, TimeEntryWithProject } from '@/types';
import { toast } from 'sonner';
import {
  deleteEntry as deleteEntryAction,
  updateEntry as updateEntryAction,
  createEntry as createEntryAction,
} from '@/actions/time-entries';

import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from '@/actions/projects';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTimer } from '@/contexts/TimerContext';

export function useTimeTracker({
  initialProjects = [],
  initialEntries = [],
}: {
  initialProjects?: Project[];
  initialEntries?: TimeEntryWithProject[];
} = {}) {
  const { t } = useLanguage();
  const [supabase] = useState(() => createClient());
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [entries, setEntries] =
    useState<TimeEntryWithProject[]>(initialEntries);

  // Integrate with global TimerContext
  const { activeEntry: globalActiveEntry, start, stop } = useTimer();

  // Map global active entry to local format
  const activeTimer = useMemo(() => {
    if (!globalActiveEntry) return null;
    return {
      id: globalActiveEntry.id,
      startTime: globalActiveEntry.start_time,
      taskName: globalActiveEntry.task_name,
      projectId: globalActiveEntry.project_id,
    };
  }, [globalActiveEntry]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const isLoading = isLoadingData;

  const fetchData = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoadingData(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Parallel Data Fetching - World-Class Waterfall Elimination
        const [projectsRes, entriesRes] = await Promise.all([
          supabase.from('projects').select('*').order('name'),
          supabase
            .from('time_entries')
            .select('*, projects(*)')
            .order('start_time', { ascending: false }),
        ]);

        // Fallback for missing deleted_at column (Resilience)

        if (projectsRes.data) setProjects(projectsRes.data);
        if (entriesRes.data) {
          setEntries(entriesRes.data);
        }
      } catch {
        toast.error(t.errors.loadingData);
      } finally {
        if (!silent) setIsLoadingData(false);
      }
    },
    [supabase, t.errors.loadingData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startTimer = useCallback(
    async (taskName: string, projectId: string | null) => {
      try {
        await start(taskName, projectId);
        // toast handling is done in TimerContext
        fetchData(true); // Silent refresh in background
      } catch {
        // Error handling is in context
      }
    },
    [start, fetchData]
  );

  const stopTimer = useCallback(async () => {
    try {
      await stop();
      // toast handling is done in TimerContext
      fetchData(true); // Silent refresh
    } catch {
      // Error handling is in context
    }
  }, [stop, fetchData]);

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        await deleteEntryAction(id);
        toast.success(t.timer.toastDeleted);
        fetchData();
      } catch {
        toast.error(t.errors.deletingEntry);
      }
    },
    [fetchData, t]
  );

  const addProject = useCallback(
    async (name: string, color: string) => {
      try {
        await createProjectAction({ name, color });
        toast.success(t.projects.toastCreated);
        await fetchData();
      } catch {
        toast.error(t.projects.toastError);
      }
    },
    [fetchData, t]
  );

  const updateProject = useCallback(
    async (id: string, name: string, color: string) => {
      try {
        await updateProjectAction(id, { name, color });
        toast.success(t.projects.toastSaved);
        await fetchData();
      } catch {
        toast.error(t.projects.toastUpdateError);
      }
    },
    [fetchData, t]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      try {
        await deleteProjectAction(id);
        toast.success(t.projects.toastDeleted);
        await fetchData();
      } catch {
        toast.error(t.projects.toastDeleteError);
      }
    },
    [fetchData, t]
  );

  const updateEntry = useCallback(
    async (id: string, updates: Partial<TimeEntryWithProject>) => {
      try {
        await updateEntryAction(id, updates);
        toast.success(t.timer.toastSaved);
        fetchData();
      } catch {
        toast.error(t.errors.updatingEntry);
      }
    },
    [fetchData, t]
  );

  const uniqueTaskNames = useMemo(() => {
    return Array.from(
      new Set(entries.map((e) => e.task_name).filter(Boolean))
    ) as string[];
  }, [entries]);

  const addManualEntry = useCallback(
    async (
      taskName: string,
      projectId: string | null,
      startTime: string,
      endTime: string
    ) => {
      try {
        await createEntryAction({
          task_name: taskName,
          project_id: projectId,
          start_time: startTime,
          end_time: endTime,
        });
        toast.success(t.timer.toastSaved);
        fetchData();
      } catch {
        toast.error(t.errors.addingManualEntry);
      }
    },
    [fetchData, t]
  );

  return {
    projects,
    entries,
    uniqueTaskNames,
    activeTimer,
    isLoading,
    startTimer,
    stopTimer,
    deleteEntry,
    updateEntry,
    addManualEntry,
    addProject,
    updateProject,
    deleteProject,
    refresh: fetchData,
  };
}
