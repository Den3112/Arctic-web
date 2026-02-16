'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Send, ExternalLink } from 'lucide-react';

export function ContactContent() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-br from-foreground to-primary">
          {t.common.contact}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t.footerPages.contact.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center space-y-6"
        >
          <div className="bg-primary/10 p-4 rounded-2xl">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold italic">
            {t.footerPages.contact.emailLabel}
          </h2>
          <p className="text-muted-foreground font-medium">
            {t.footerPages.contact.contactPerson}
          </p>
          <a
            href={`mailto:${t.footerPages.contact.emailValue}`}
            className="text-primary hover:underline transition-all font-semibold italic"
          >
            {t.footerPages.contact.emailValue}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center space-y-6"
        >
          <div className="bg-primary/10 p-4 rounded-2xl">
            <Send className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold italic">
            {t.footerPages.contact.telegramLabel}
          </h2>
          <p className="text-muted-foreground font-medium">
            {t.footerPages.contact.telegramHint}
          </p>
          <a
            href="https://t.me/ArcticWeb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline transition-all font-semibold italic"
          >
            {t.footerPages.contact.telegramValue}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center space-y-6 col-span-1 md:col-span-2"
        >
          <h2 className="text-2xl font-bold italic">
            {t.footerPages.contact.websiteLabel}
          </h2>
          <a
            href="https://acw.solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-xl font-bold tracking-tight flex items-center gap-2"
          >
            {t.footerPages.contact.websiteValue}
            <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
