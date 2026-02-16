'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export function AboutContent() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-br from-foreground to-primary">
          {t.common.about}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t.footerPages.about.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/5 space-y-8"
      >
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            {t.footerPages.about.missionTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t.footerPages.about.missionText}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            {t.footerPages.about.projectTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t.footerPages.about.projectText}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold italic">
            {t.footerPages.about.companyTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t.footerPages.about.companyText}
          </p>
        </section>
      </motion.div>
    </div>
  );
}
