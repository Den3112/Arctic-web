'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function DashboardHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">{t.timer.header}</h1>
      <p className="text-muted-foreground italic">{t.timer.subHeader}</p>
    </div>
  );
}
