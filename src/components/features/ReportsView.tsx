'use client';

import { useState, useMemo } from 'react';
import { Download, Calendar, Clock, CheckCircle2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDuration, formatTime } from '@/services/timeUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { TimeEntryWithProject } from '@/types';

const ReportsPieChart = dynamic(
  () => import('./ReportsCharts').then((mod) => mod.ReportsPieChart),
  {
    ssr: false,
    loading: () => (
      <Card className="glass-card border-none overflow-hidden h-[400px] animate-pulse">
        <CardHeader>
          <div className="h-4 w-32 bg-white/10 rounded" />
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-4 border-primary/20" />
        </CardContent>
      </Card>
    ),
  }
);

const ReportsBarChart = dynamic(
  () => import('./ReportsCharts').then((mod) => mod.ReportsBarChart),
  {
    ssr: false,
    loading: () => (
      <Card className="glass-card border-none overflow-hidden h-[400px] animate-pulse">
        <CardHeader>
          <div className="h-4 w-32 bg-white/10 rounded" />
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="w-full h-40 bg-white/5 rounded" />
        </CardContent>
      </Card>
    ),
  }
);

interface ReportsViewProps {
  entries: TimeEntryWithProject[];
}

export function ReportsView({ entries }: ReportsViewProps) {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Must have an end time to be in reports
      if (!entry.end_time) return false;

      const entryDate = new Date(entry.start_time);
      const now = new Date();

      // Normalize today to start of day for accurate comparison
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const entryDayStart = new Date(
        entryDate.getFullYear(),
        entryDate.getMonth(),
        entryDate.getDate()
      );

      if (period === 'day') {
        return entryDayStart.getTime() === todayStart.getTime();
      }
      if (period === 'week') {
        // Get start of week (Monday)
        const day = todayStart.getDay();
        const diff = todayStart.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(todayStart);
        monday.setDate(diff);
        return entryDayStart >= monday;
      }
      if (period === 'month') {
        return (
          entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  }, [entries, period]);

  const totalTime = useMemo(
    () =>
      filteredEntries.reduce((sum, entry) => {
        return (
          sum +
          (new Date(entry.end_time!).getTime() -
            new Date(entry.start_time).getTime())
        );
      }, 0),
    [filteredEntries]
  );

  const chartData = useMemo(() => {
    const projectMap = new Map<string, { value: number; color: string }>();

    filteredEntries.forEach((entry) => {
      const projectName = entry.projects?.name || t.common.noProject;
      const duration =
        new Date(entry.end_time!).getTime() -
        new Date(entry.start_time).getTime();
      const color = entry.projects?.color || '#94a3b8';

      const current = projectMap.get(projectName) || { value: 0, color };
      projectMap.set(projectName, {
        value: current.value + duration,
        color,
      });
    });

    return Array.from(projectMap.entries())
      .map(([name, { value, color }]) => ({
        name,
        value,
        color,
        formatted: formatDuration(value),
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredEntries, t.common.noProject]);

  const exportToCSV = () => {
    const headers = [
      t.reports.table.date,
      t.reports.table.task,
      t.reports.table.project,
      t.reports.table.start,
      t.reports.table.end,
      t.reports.table.duration,
    ];

    const rows = filteredEntries.map((e) => [
      new Date(e.start_time).toLocaleDateString(),
      e.task_name,
      e.projects?.name || t.common.noProject,
      formatTime(e.start_time),
      formatTime(e.end_time!),
      formatDuration(
        new Date(e.end_time!).getTime() - new Date(e.start_time).getTime()
      ),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows] // Add BOM for Excel compatibility
        .map((row) =>
          row
            .map((cell) => `"${(cell || '').toString().replace(/"/g, '""')}"`)
            .join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `arctictime-export-report-${period}-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  };

  const avgTimePerTask = useMemo(() => {
    if (filteredEntries.length === 0) return 0;
    return totalTime / filteredEntries.length;
  }, [totalTime, filteredEntries.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight premium-gradient-text uppercase">
          {t.reports.header}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          {t.reports.subHeader}
        </p>
      </div>

      {/* Row 1: Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3">
        <Select
          value={period}
          onValueChange={(val: 'day' | 'week' | 'month') => setPeriod(val)}
        >
          <SelectTrigger className="w-[180px] glass-card">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder={t.reports.periodSelector} />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="day">{t.reports.today}</SelectItem>
            <SelectItem value="week">{t.reports.thisWeek}</SelectItem>
            <SelectItem value="month">{t.reports.thisMonth}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={exportToCSV}
          disabled={filteredEntries.length === 0}
          className="glass-card hover:bg-white/5"
        >
          <Download className="w-4 h-4 mr-2" /> {t.reports.exportCsv}
        </Button>
      </div>

      {/* Row 2: Summary Cards — 3 equal columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="glass-card border-none overflow-hidden group hover:bg-white/5 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              {t.reports.totalTime}
            </CardTitle>
            <Clock className="h-4 w-4 text-primary animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl lg:text-4xl font-mono font-bold premium-gradient-text">
              {formatDuration(totalTime)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {filteredEntries.length > 0
                ? `${chartData.length} ${chartData.length === 1 ? 'project' : 'projects'}`
                : t.common.noData}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none overflow-hidden group hover:bg-white/5 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              {t.reports.totalTasks}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary/60" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl lg:text-4xl font-bold">
              {filteredEntries.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t.reports.completedTasks}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none overflow-hidden group hover:bg-white/5 transition-all sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              {t.reports.avgTimePerTask}
            </CardTitle>
            <History className="h-4 w-4 text-primary/60" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl lg:text-4xl font-mono font-bold">
              {formatDuration(avgTimePerTask)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {filteredEntries.length > 0
                ? `${filteredEntries.length} ${t.reports.completedTasks.toLowerCase()}`
                : t.common.noData}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Charts — 2 equal columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportsBarChart data={chartData} />
        <ReportsPieChart data={chartData} totalTime={totalTime} />
      </div>

      {/* Row 4: Detailed Table — full width */}
      <Card className="glass-card border-none overflow-hidden rounded-2xl">
        <div className="overflow-x-auto max-h-[420px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-white/5 text-muted-foreground sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 tracking-widest">
                  {t.reports.table.date}
                </th>
                <th className="px-6 py-4 tracking-widest">
                  {t.reports.table.task}
                </th>
                <th className="px-6 py-4 tracking-widest">
                  {t.reports.table.project}
                </th>
                <th className="px-6 py-4 text-right tracking-widest">
                  {t.reports.table.duration}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {new Date(entry.start_time).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium group-hover:text-primary transition-colors whitespace-nowrap">
                    {entry.task_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: entry.projects?.color || '#94a3b8',
                        }}
                      />
                      {entry.projects?.name || t.common.noProject}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold whitespace-nowrap">
                    {formatDuration(
                      new Date(entry.end_time!).getTime() -
                        new Date(entry.start_time).getTime()
                    )}
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-20 text-center text-muted-foreground opacity-50"
                  >
                    <History className="w-12 h-12 mx-auto mb-4 opacity-5 mt-4" />
                    {t.common.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
