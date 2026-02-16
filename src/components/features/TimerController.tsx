'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Square, Tag, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Project } from '@/types';
import { formatDuration } from '@/services/timeUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTimer } from '@/contexts/TimerContext';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerControllerProps {
  projects: Project[];
  suggestions: string[];
  activeTimer?: {
    id: string;
    startTime: string;
    taskName: string | null;
    projectId: string | null;
  } | null;
  onStart?: (taskName: string, projectId: string | null) => Promise<void>;
  onStop?: () => Promise<void>;
}

export function TimerController({
  projects,
  suggestions,
  activeTimer,
  onStart,
  onStop,
}: TimerControllerProps) {
  const { t } = useLanguage();
  const {
    activeEntry: contextActiveEntry,
    start: contextStart,
    stop: contextStop,
    isLoading: contextIsLoading,
  } = useTimer();

  // Prefer props if provided (from TrackerContainer/useTimeTracker), fallback to context
  const activeEntry =
    activeTimer !== undefined ? activeTimer : contextActiveEntry;
  const start = onStart || contextStart;
  const stop = onStop || contextStop;
  const isLoading = contextIsLoading;

  const [taskName, setTaskName] = useState(() => {
    if (activeEntry) {
      return (
        ('task_name' in activeEntry
          ? activeEntry.task_name
          : activeEntry.taskName) || ''
      );
    }
    return '';
  });
  const [projectId, setProjectId] = useState<string | 'none'>(() => {
    if (activeEntry) {
      return (
        ('project_id' in activeEntry
          ? activeEntry.project_id
          : activeEntry.projectId) || 'none'
      );
    }
    return 'none';
  });

  const [prevActiveEntryId, setPrevActiveEntryId] = useState<string | null>(
    activeEntry?.id || null
  );

  // Initialize elapsed based on activeEntry
  const [elapsed, setElapsed] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Update elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateElapsed = () => {
      if (activeEntry) {
        const startRaw =
          'start_time' in activeEntry
            ? activeEntry.start_time
            : activeEntry.startTime;
        if (startRaw) {
          const startTime = new Date(startRaw).getTime();
          setElapsed(Math.max(0, Date.now() - startTime));
        } else {
          setElapsed(0);
        }
      } else {
        setElapsed(0);
      }
    };

    updateElapsed(); // Initial update

    if (activeEntry) {
      interval = setInterval(updateElapsed, 1000);
    }

    return () => clearInterval(interval);
  }, [activeEntry]);

  // Adjust state if activeEntry changes (avoids setState in useEffect violation)
  const currentEntryId = activeEntry?.id || null;
  if (currentEntryId !== prevActiveEntryId) {
    setPrevActiveEntryId(currentEntryId);
    if (activeEntry) {
      const newName =
        'task_name' in activeEntry
          ? activeEntry.task_name
          : activeEntry.taskName;
      setTaskName(newName || '');
      const newPid =
        'project_id' in activeEntry
          ? activeEntry.project_id
          : activeEntry.projectId;
      setProjectId(newPid || 'none');
    } else {
      setTaskName('');
      setProjectId('none');
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStart = async () => {
    const trimmedName = taskName.trim();
    if (!trimmedName) {
      toast.error(t.timer.toastErrorName);
      return;
    }
    await start(trimmedName, projectId === 'none' ? null : projectId);
  };

  const handleStop = async () => {
    await stop();
  };

  const filteredSuggestions = suggestions
    .filter(
      (s) => s.toLowerCase().includes(taskName.toLowerCase()) && s !== taskName
    )
    .slice(0, 5);

  const isActive = !!activeEntry;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 w-full group">
      <div className="flex-1 w-full space-y-2 relative">
        <div className="flex items-center gap-3 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest pl-1 mb-1">
          <Tag className="w-3 h-3" />
          {t.timer.placeholder}
        </div>
        <div className="relative" ref={suggestionsRef}>
          <Input
            value={taskName}
            onChange={(e) => {
              setTaskName(e.target.value);
              if (!showSuggestions) setShowSuggestions(true);
            }}
            placeholder={t.timer.placeholder}
            disabled={isActive || isLoading}
            onFocus={() => setShowSuggestions(true)}
            data-testid="timer-task-input"
            className="text-lg h-14 bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-2xl shadow-inner font-bold placeholder:font-normal placeholder:opacity-30"
          />
          <AnimatePresence>
            {showSuggestions && !isActive && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl overflow-hidden z-20 shadow-2xl"
              >
                {filteredSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    data-testid="task-suggestion"
                    className="w-full text-left px-5 py-3.5 hover:bg-white/5 transition-colors text-sm font-medium border-b border-white/5 last:border-none"
                    onClick={() => {
                      setTaskName(s);
                      setShowSuggestions(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full md:w-64 space-y-2">
        <div className="flex items-center gap-3 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest pl-1 mb-1">
          <Folder className="w-3 h-3" />
          {t.editModal.project}
        </div>
        {isMounted ? (
          <Select
            value={projectId}
            onValueChange={setProjectId}
            disabled={isActive || isLoading}
          >
            <SelectTrigger
              data-testid="timer-project-select"
              className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold"
            >
              <SelectValue placeholder={t.common.noProject} />
            </SelectTrigger>
            <SelectContent className="glass-card">
              <SelectItem value="none" className="font-medium">
                {t.common.noProject}
              </SelectItem>
              {projects.map((p) => (
                <SelectItem
                  key={p.id}
                  value={p.id}
                  className="font-bold"
                  data-testid={`project-option-${p.name}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    {p.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="h-14 bg-white/5 border-white/10 rounded-2xl flex items-center px-4">
            <span className="text-muted-foreground font-medium">
              {t.common.noProject}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center min-w-[140px] px-4">
        <div className="text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest mb-1.5">
          {t.reports.totalTime}
        </div>
        <div
          className={`text-3xl font-mono font-black tabular-nums tracking-widest transition-all duration-300 ${isActive ? 'text-primary scale-110 drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]' : 'text-muted-foreground/30'}`}
        >
          {formatDuration(elapsed)}
        </div>
      </div>

      <Button
        size="lg"
        variant={isActive ? 'destructive' : 'default'}
        onClick={isActive ? handleStop : handleStart}
        disabled={isLoading}
        aria-label={isActive ? 'Stop timer' : 'Start timer'}
        data-testid={isActive ? 'timer-stop-button' : 'timer-start-button'}
        className={`h-16 w-full md:w-16 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden ${!isActive ? 'bg-primary hover:bg-primary/90' : 'bg-destructive/80 hover:bg-destructive'}`}
      >
        <div className="relative z-10">
          {isActive ? (
            <Square className="w-7 h-7 fill-current" />
          ) : (
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          )}
        </div>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white/20"
          />
        )}
      </Button>
    </div>
  );
}
