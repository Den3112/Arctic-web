'use client';

import {
  Trash2,
  Edit2,
  Clock,
  Calendar,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Project, TimeEntryWithProject } from '@/types';
import { TranslationKey } from '@/locales';
import {
  formatDuration,
  formatTime,
  parseDurationString,
} from '@/services/timeUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTimer } from '@/contexts/TimerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, memo } from 'react';

const InlineEditableTimeEntry = memo(
  ({
    entry,
    t,
    onDelete,
    onUpdate,
    onEditModal,
  }: {
    entry: TimeEntryWithProject;
    t: TranslationKey;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<TimeEntryWithProject>) => void;
    onEditModal: (entry: TimeEntryWithProject) => void;
  }) => {
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [taskName, setTaskName] = useState(entry.task_name || '');
    const [prevEntryName, setPrevEntryName] = useState(entry.task_name);

    const currentTaskName = entry.task_name || '';
    if (currentTaskName !== prevEntryName) {
      setPrevEntryName(currentTaskName);
      setTaskName(currentTaskName);
    }

    const [durationStr, setDurationStr] = useState('');
    const [isEditingDuration, setIsEditingDuration] = useState(false);

    const handleTaskBlur = () => {
      setIsEditingTask(false);
      if (taskName !== entry.task_name) {
        onUpdate(entry.id, { task_name: taskName });
      }
    };

    const handleDurationClick = () => {
      if (!entry.end_time) return; // Cannot edit duration of running timer inline easily yet
      const durationMs =
        new Date(entry.end_time).getTime() -
        new Date(entry.start_time).getTime();
      const h = Math.floor(durationMs / (1000 * 60 * 60));
      const m = Math.floor((durationMs / (1000 * 60)) % 60);
      setDurationStr(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      );
      setIsEditingDuration(true);
    };

    const handleDurationBlur = () => {
      setIsEditingDuration(false);
      const newDurationMs = parseDurationString(durationStr);
      if (newDurationMs !== null && entry.end_time) {
        const currentDuration =
          new Date(entry.end_time).getTime() -
          new Date(entry.start_time).getTime();
        if (Math.abs(newDurationMs - currentDuration) > 1000) {
          // Update end time to match new duration
          const newEndTime = new Date(
            new Date(entry.start_time).getTime() + newDurationMs
          ).toISOString();
          onUpdate(entry.id, { end_time: newEndTime });
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
      if (e.key === 'Enter') {
        callback();
      }
    };

    return (
      <motion.div
        layout
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 },
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Card
          className="group glass-card hover:bg-white/5 transition-all duration-300 overflow-hidden border-none shadow-xl"
          data-testid="time-entry-card"
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              {isEditingTask ? (
                <Input
                  autoFocus
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  onBlur={handleTaskBlur}
                  onKeyDown={(e) => handleKeyDown(e, handleTaskBlur)}
                  className="h-7 text-lg font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0"
                />
              ) : (
                <p
                  className="font-bold text-lg tracking-tight truncate group-hover:text-primary transition-colors cursor-pointer"
                  onClick={() => setIsEditingTask(true)}
                  title="Click to edit"
                  data-testid="time-entry-title"
                >
                  {entry.task_name || t.timer.untitled}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                {/* Project Badge */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-muted-foreground">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: entry.projects?.color || '#94a3b8',
                    }}
                  />
                  <span className="uppercase tracking-wider font-bold">
                    {entry.projects?.name || t.common.noProject}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground/60 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar className="w-3 h-3" />
                  {formatTime(entry.start_time)} —{' '}
                  {entry.end_time
                    ? formatTime(entry.end_time)
                    : t.timer.inProgress}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-xl font-mono font-black tabular-nums tracking-wider min-w-[100px] text-right">
                {entry.end_time ? (
                  isEditingDuration ? (
                    <Input
                      autoFocus
                      value={durationStr}
                      onChange={(e) => setDurationStr(e.target.value)}
                      onBlur={handleDurationBlur}
                      onKeyDown={(e) => handleKeyDown(e, handleDurationBlur)}
                      className="h-8 text-xl font-mono font-black text-right bg-transparent border-none p-0 focus-visible:ring-0 w-[100px]"
                      placeholder="hh:mm"
                    />
                  ) : (
                    <span
                      onClick={handleDurationClick}
                      className="cursor-pointer hover:text-primary transition-colors"
                      title="Click to edit duration (hh:mm)"
                    >
                      {formatDuration(
                        new Date(entry.end_time).getTime() -
                          new Date(entry.start_time).getTime()
                      )}
                    </span>
                  )
                ) : (
                  <span className="text-primary animate-pulse uppercase text-xs tracking-widest">
                    {t.timer.running}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
                  onClick={() => onEditModal(entry)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-destructive/20 hover:text-destructive transition-all active:scale-90"
                  onClick={() => onDelete(entry.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

InlineEditableTimeEntry.displayName = 'InlineEditableTimeEntry';

interface TimeEntryListProps {
  entries: TimeEntryWithProject[];
  projects: Project[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    updates: Partial<TimeEntryWithProject>
  ) => Promise<void>;
  onAddManual?: (
    taskName: string,
    projectId: string | null,
    startTime: string,
    endTime: string
  ) => Promise<void>;
}

// Helper to convert date to local YYYY-MM-DDTHH:mm for datetime-local input
const toLocalISOString = (dateStr: string | null) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16);
  return localISOTime;
};

export function TimeEntryList({
  entries,
  projects,
  onDelete,
  onUpdate,
  onAddManual,
}: TimeEntryListProps) {
  const { t } = useLanguage();
  const { isManualEntryOpen, setManualEntryOpen } = useTimer();
  const [editingEntry, setEditingEntry] = useState<TimeEntryWithProject | null>(
    null
  );

  const [editTaskName, setEditTaskName] = useState('');
  const [editProjectId, setEditProjectId] = useState<string | 'none'>('none');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');

  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const [groupBy, setGroupBy] = useState<'date' | 'project'>('date');

  // Initialize state when manual entry opens
  useEffect(() => {
    if (isManualEntryOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditingEntry({} as TimeEntryWithProject);
      setEditTaskName('');
      setEditProjectId('none');

      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      setEditStartTime(toLocalISOString(oneHourAgo.toISOString()));
      setEditEndTime(toLocalISOString(now.toISOString()));
    }
  }, [isManualEntryOpen]);

  const handleEditClick = (entry: TimeEntryWithProject) => {
    setManualEntryOpen(false);
    setEditingEntry(entry);
    setEditTaskName(entry.task_name || '');
    setEditProjectId(entry.project_id || 'none');
    setEditStartTime(toLocalISOString(entry.start_time));
    setEditEndTime(toLocalISOString(entry.end_time));
  };

  const handleSave = async () => {
    if (isManualEntryOpen) {
      if (onAddManual) {
        await onAddManual(
          editTaskName,
          editProjectId === 'none' ? null : editProjectId,
          new Date(editStartTime).toISOString(),
          new Date(editEndTime).toISOString()
        );
      }
    } else if (editingEntry) {
      const updates: Partial<TimeEntryWithProject> = {
        task_name: editTaskName,
        project_id: editProjectId === 'none' ? null : editProjectId,
        start_time: new Date(editStartTime).toISOString(),
        end_time: editEndTime ? new Date(editEndTime).toISOString() : null,
      };

      await onUpdate(editingEntry.id, updates);
    }

    setEditingEntry(null);
    setManualEntryOpen(false);
  };

  // Grouping
  const groupedEntries = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        let key = '';
        let display = '';

        if (groupBy === 'date') {
          const date = new Date(entry.start_time);
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          key = date.toLocaleDateString();
          display = date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          if (date.toDateString() === today.toDateString()) {
            display = t.common?.today || 'Today';
            key = 'Today';
          } else if (date.toDateString() === yesterday.toDateString()) {
            display = t.common?.yesterday || 'Yesterday';
            key = 'Yesterday';
          }
        } else {
          // Group by Project
          const project = projects.find((p) => p.id === entry.project_id);
          key = project ? project.id : 'no-project';
          display = project ? project.name : t.common.noProject;
        }

        if (!acc[key]) {
          acc[key] = {
            displayDate: display,
            entries: [],
            totalDuration: 0,
            hasActiveTimer: false,
          };
        }

        if (entry.end_time) {
          const duration =
            new Date(entry.end_time).getTime() -
            new Date(entry.start_time).getTime();
          acc[key].totalDuration += duration;
        } else {
          acc[key].hasActiveTimer = true;
        }

        acc[key].entries.push(entry);

        return acc;
      },
      {} as Record<
        string,
        {
          displayDate: string;
          entries: TimeEntryWithProject[];
          totalDuration: number;
          hasActiveTimer: boolean;
        }
      >
    );
  }, [entries, t.common, groupBy, projects]);

  const toggleGroup = (dateKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));
  };

  const toggleAll = (collapse: boolean) => {
    const newState: Record<string, boolean> = {};
    Object.keys(groupedEntries).forEach((key) => {
      newState[key] = collapse;
    });
    setCollapsedGroups(newState);
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 opacity-50">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-10" />
        <p className="text-lg font-medium tracking-tight uppercase opacity-50">
          {t.common.noData}
        </p>
      </div>
    );
  }

  const allCollapsed =
    Object.keys(groupedEntries).length > 0 &&
    Object.keys(groupedEntries).every((key) => collapsedGroups[key]);

  return (
    <div className="space-y-10">
      <div className="flex justify-end px-2 gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors h-7 gap-1"
          onClick={() => setGroupBy(groupBy === 'date' ? 'project' : 'date')}
        >
          {groupBy === 'date' ? (
            <>
              <Layers className="w-3 h-3" />
              {t.timer.groupByProject}
            </>
          ) : (
            <>
              <Calendar className="w-3 h-3" />
              {t.timer.groupByDate}
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors h-7"
          onClick={() => toggleAll(!allCollapsed)}
        >
          {allCollapsed ? 'Expand All' : 'Collapse All'}
        </Button>
      </div>

      {Object.entries(groupedEntries).map(([dateKey, group]) => (
        <motion.div layout key={dateKey} className="space-y-4">
          <div
            className="flex items-center justify-between border-b border-white/5 pb-2 px-2 cursor-pointer group/header"
            onClick={() => toggleGroup(dateKey)}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: collapsedGroups[dateKey] ? -90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
              </motion.div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground group-hover/header:text-foreground transition-colors">
                  {group.displayDate}
                </h3>
                {group.hasActiveTimer && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-[9px] font-black text-primary tracking-widest animate-pulse border border-primary/20">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    RUNNING
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm font-mono font-bold premium-gradient-text tracking-wider">
              {formatDuration(group.totalDuration)}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {!collapsedGroups[dateKey] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <motion.div
                  className="grid gap-4 pt-1 pb-2"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {group.entries.map((entry) => (
                    <InlineEditableTimeEntry
                      key={entry.id}
                      entry={entry}
                      t={t}
                      onDelete={onDelete}
                      onEditModal={handleEditClick}
                      onUpdate={onUpdate}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      <Dialog
        open={!!editingEntry || isManualEntryOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingEntry(null);
            setManualEntryOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] glass-card border-none rounded-3xl overflow-hidden shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold premium-gradient-text uppercase tracking-tight">
              {t.editModal.title}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="task"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                {t.editModal.taskName}
              </Label>
              <Input
                id="task"
                className="glass-card"
                value={editTaskName}
                onChange={(e) => setEditTaskName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t.editModal.project}
              </Label>
              <Select value={editProjectId} onValueChange={setEditProjectId}>
                <SelectTrigger className="glass-card">
                  <SelectValue placeholder={t.common.noProject} />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="none">{t.common.noProject}</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="start"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                >
                  {t.editModal.startTime}
                </Label>
                <Input
                  id="start"
                  type="datetime-local"
                  className="glass-card"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="end"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                >
                  {t.editModal.endTime}
                </Label>
                <Input
                  id="end"
                  type="datetime-local"
                  className="glass-card"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground/60 italic uppercase tracking-widest">
              {t.editModal.hint}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setEditingEntry(null)}
              className="rounded-xl hover:bg-white/5"
            >
              {t.common.cancel}
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {t.common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
