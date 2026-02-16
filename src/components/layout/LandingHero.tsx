'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

export function LandingHero() {
  const { t } = useLanguage();

  return (
    <div className="relative isolate pt-14">
      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-balance text-5xl font-display font-bold tracking-tight premium-gradient-text sm:text-7xl"
            >
              {t.landing.heroTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8"
            >
              {t.landing.heroSubtitle}{' '}
              <span className="text-primary font-bold">{t.common.appName}</span>
              .
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full shadow-lg hover:shadow-primary/25 group"
              >
                <Link href="/login" className="flex items-center gap-2">
                  {t.landing.startTracking}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="mt-16 flow-root sm:mt-24">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                {
                  icon: Clock,
                  title: t.landing.feature1Title,
                  desc: t.landing.feature1Desc,
                },
                {
                  icon: BarChart3,
                  title: t.landing.feature2Title,
                  desc: t.landing.feature2Desc,
                },
                {
                  icon: ShieldCheck,
                  title: t.landing.feature3Title,
                  desc: t.landing.feature3Desc,
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                  className="glass-card p-8 rounded-3xl"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
