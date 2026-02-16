'use client';

import { Github } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import Link from 'next/link';

export function Footer() {
  const { t } = useLanguage();
  const [year] = useState(() => new Date().getFullYear());

  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-md py-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg">{t.common.appName}</h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Precision time tracking for professional workflows. Optimized for
              clarity and performance.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              {t.common.resources}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  {t.common.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  {t.common.contact}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              {t.common.legal}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  {t.common.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  {t.common.terms}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              {t.common.support}
            </h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://github.com/Den3112/Arctic-web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            &copy; {year || '2026'} {t.common.appName}.{' '}
            {t.common.allRightsReserved}
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground/40 italic">
            <span>v1.0.0-stable</span>
            <span>Handcrafted with precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
