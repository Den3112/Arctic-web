'use client';

import { motion } from 'framer-motion';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-muted/20 rounded-xl ${className}`}
    >
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent"
      />
    </div>
  );
}

export function TimerSkeleton() {
  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-full md:w-32" />
        <Skeleton className="h-12 w-full md:w-28" />
      </div>
    </div>
  );
}

export function EntrySkeleton() {
  return (
    <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

export function ProjectSkeleton() {
  return (
    <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}
