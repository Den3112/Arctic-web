'use client';

import { startTimer, stopTimer } from '@/actions/time-entries';
import { TimeEntryWithProject } from '@/types';
import {
  createContext,
  useContext,
  useOptimistic,
  useTransition,
  ReactNode,
  useState,
} from 'react';
import { toast } from 'sonner';
import { useLanguage } from './LanguageContext';

interface TimerContextType {
  activeEntry: TimeEntryWithProject | null;
  start: (taskName: string, projectId: string | null) => Promise<void>;
  stop: () => Promise<void>;
  isLoading: boolean;
  isManualEntryOpen: boolean;
  setManualEntryOpen: (open: boolean) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({
  children,
  initialActiveEntry,
}: {
  children: ReactNode;
  initialActiveEntry: TimeEntryWithProject | null;
}) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [optimisticActiveEntry, setOptimisticActiveEntry] = useOptimistic(
    initialActiveEntry,
    (_, newEntry: TimeEntryWithProject | null) => newEntry
  );

  const [isManualEntryOpen, setManualEntryOpen] = useState(false);

  const start = async (taskName: string, projectId: string | null) => {
    const tempId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newEntry: TimeEntryWithProject = {
      id: tempId,
      task_name: taskName,
      project_id: projectId,
      start_time: now,
      end_time: null,
      created_at: now,
      updated_at: now,
      user_id: '', // Placeholder
      projects: null, // We might not have project details right away for optimistic UI
    };

    startTransition(async () => {
      setOptimisticActiveEntry(newEntry);
      try {
        await startTimer(taskName, projectId);
        // We rely on router.refresh() (called by revalidatePath in action) to update the real state
      } catch {
        toast.error(t.errors.startTimer);
        setOptimisticActiveEntry(null); // Revert
      }
    });
  };

  const stop = async () => {
    const current = optimisticActiveEntry;
    if (!current) return;

    startTransition(async () => {
      setOptimisticActiveEntry(null);
      try {
        await stopTimer(current.id);
      } catch {
        toast.error(t.errors.stopTimer);
        setOptimisticActiveEntry(current); // Revert
      }
    });
  };

  return (
    <TimerContext.Provider
      value={{
        activeEntry: optimisticActiveEntry,
        start,
        stop,
        isLoading: isPending,
        isManualEntryOpen,
        setManualEntryOpen,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
