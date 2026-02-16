'use client';
import { useMemo } from 'react';
import { TimerController } from './TimerController';
import { TimeEntryList } from './TimeEntryList';
import { Button } from '../ui/button';
import { useTimeTracker } from '@/hooks/useTimeTracker';

import { Skeleton, TimerSkeleton, EntrySkeleton } from '../ui/SkeletonLoaders';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTimer } from '@/contexts/TimerContext';
import { motion, AnimatePresence } from 'framer-motion';

import { Project, TimeEntryWithProject } from '@/types';

export interface TrackerContainerProps {
  initialProjects: Project[];
  initialEntries: TimeEntryWithProject[];
}

export function TrackerContainer({
  initialProjects,
  initialEntries,
}: TrackerContainerProps) {
  const { t } = useLanguage();
  const { setManualEntryOpen } = useTimer();

  const {
    projects,
    entries,
    activeTimer,
    isLoading,
    startTimer,
    stopTimer,
    deleteEntry,
    updateEntry,
    addManualEntry,
  } = useTimeTracker({
    initialProjects,
    initialEntries,
  });

  // Unique task names for suggestions, prioritized by recency
  const suggestions = useMemo(() => {
    return Array.from(
      new Map(
        entries
          .filter((e) => e.task_name)
          .map((e) => [e.task_name, e.task_name])
      ).values()
    ).slice(0, 10);
  }, [entries]);

  if (isLoading) {
    return (
      <div className="space-y-12">
        <TimerSkeleton />
        <div className="space-y-6">
          <Skeleton className="h-8 w-32 ml-2" />
          <div className="space-y-4">
            <EntrySkeleton />
            <EntrySkeleton />
            <EntrySkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-12"
    >
      <section className="relative z-10 glass-card p-6 md:p-8 rounded-3xl">
        <TimerController
          projects={projects}
          suggestions={suggestions}
          activeTimer={activeTimer}
          onStart={startTimer}
          onStop={stopTimer}
        />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold tracking-tight premium-gradient-text uppercase">
            {t.timer.today}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setManualEntryOpen(true)}
            className="glass-card hover:bg-white/5 rounded-full px-4 border-dashed border-white/20 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-all active:scale-95"
          >
            {t.timer.addManualEntry}
          </Button>
        </div>

        <AnimatePresence mode="popLayout">
          <TimeEntryList
            entries={entries}
            projects={projects}
            onDelete={deleteEntry}
            onUpdate={updateEntry}
            onAddManual={addManualEntry}
          />
        </AnimatePresence>
      </section>
    </motion.div>
  );
}
