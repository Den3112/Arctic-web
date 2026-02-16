'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Database, Lock } from 'lucide-react';

export function PrivacyContent() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-br from-foreground to-primary">
          {t.common.privacy}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t.footerPages.privacy.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/5 space-y-8"
      >
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Database className="w-6 h-6 text-primary" />
            {t.footerPages.privacy.dataCollectionTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t.footerPages.privacy.dataCollectionText}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Lock className="w-6 h-6 text-primary" />
            {t.footerPages.privacy.privacyFirstTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t.footerPages.privacy.privacyFirstText}
          </p>
        </section>
      </motion.div>
    </div>
  );
}
