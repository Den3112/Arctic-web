'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTimer } from '@/contexts/TimerContext';
import { formatDuration } from '@/services/timeUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, StopCircle } from 'lucide-react';

export function ActiveTimerBanner() {
  const { t } = useLanguage();
  const { activeEntry, stop } = useTimer();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!activeEntry) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEntry]);

  const startTime = activeEntry
    ? new Date(activeEntry.start_time).getTime()
    : 0;
  const elapsed = activeEntry
    ? Math.max(0, Math.floor((now - startTime) / 1000))
    : 0;

  if (!activeEntry) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-primary/10 border-b border-primary/20 overflow-hidden"
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Timer className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold truncate">
                {activeEntry.task_name || t.timer.taskInProgress}
              </span>
              <span className="text-sm font-mono font-bold text-primary">
                {formatDuration(elapsed)}
              </span>
            </div>
          </div>

          <button
            onClick={() => stop()}
            aria-label={t.timer.stopTimer}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 group"
          >
            <StopCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="hidden sm:inline">{t.timer.stopTimer}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
