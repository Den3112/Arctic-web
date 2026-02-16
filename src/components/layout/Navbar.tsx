'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Timer,
  Settings,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { User as UserType } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale } from '@/locales';
import { ActiveTimerBanner } from './ActiveTimerBanner';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { locale, setLocale, t } = useLanguage();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // if (!user) return null // Removed to allow guest access

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Close mobile menu on navigation
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Close on navigation

  // Helper to set language, assuming setLocale is the correct function
  const setLanguage = (lang: Locale) => {
    setLocale(lang);
  };

  return (
    <>
      <nav className="glass-navbar sticky top-0 z-50 transition-all duration-300">
        <div className="hidden md:block">
          <ActiveTimerBanner />
        </div>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition-transform hover:scale-105"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 ring-1 ring-white/20">
                <Timer className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                ArcticTime
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <div
                data-testid="desktop-nav"
                className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md"
              >
                <NavButton
                  href="/"
                  icon={<Timer className="w-4 h-4" />}
                  label={t.timer.header}
                  active={pathname === '/'}
                />
                <NavButton
                  href="/projects"
                  icon={<Settings className="w-4 h-4" />}
                  label={t.common.projects}
                  active={pathname === '/projects'}
                />
                <NavButton
                  href="/reports"
                  icon={<BarChart3 className="w-4 h-4" />}
                  label={t.common.reports}
                  active={pathname === '/reports'}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 mr-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                    locale === 'en'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  EN
                </button>
                <div className="w-px h-3 bg-white/10" />
                <button
                  onClick={() => setLanguage('uk')}
                  className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                    locale === 'uk'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  UK
                </button>
              </div>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden lg:flex flex-col items-end mr-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                      {user.email?.split('@')[0]}
                    </span>
                    <span className="text-[9px] text-primary/60 font-medium">
                      {t.navbar.pro}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-10 w-10 border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 glass-navbar border-white/10"
                    >
                      <div className="px-2 py-2 flex items-center gap-3 border-b border-white/10 mb-1">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold truncate">
                            {user.email}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {t.navbar.freePlan}
                          </span>
                        </div>
                      </div>
                      <DropdownMenuItem
                        onClick={() => handleLogout()}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.navbar.logout}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden rounded-full hover:bg-white/10 transition-colors h-11 w-11"
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                    data-testid="mobile-menu-trigger"
                    aria-label={
                      isMobileMenuOpen ? t.navbar.closeMenu : t.navbar.openMenu
                    }
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-6 w-6 text-primary" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="rounded-full px-6 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95">
                    {t.navbar.signIn}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Outside nav to prevent stacking context constraints */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'calc(100vh - 64px)', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl overflow-hidden fixed left-0 right-0 top-[64px] bottom-0 z-100"
            id="mobile-menu"
            data-testid="mobile-menu-overlay"
          >
            <div className="flex flex-col p-4 gap-2 h-full overflow-y-auto">
              <div className="flex items-center justify-between px-2 mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest pl-1 mb-1">
                    <div className="w-1 h-3 bg-primary rounded-full" />
                    {t.navbar.navigation}
                  </div>
                </div>
              </div>

              {user && (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start gap-3 h-14 text-xl font-medium hover:bg-white/5 active:scale-[0.98] transition-all px-6 ${
                      pathname === '/'
                        ? 'bg-primary/10 text-primary border-l-4 border-primary rounded-l-none'
                        : 'text-foreground'
                    }`}
                  >
                    <Link href="/" data-testid="mobile-nav-timer">
                      <Timer className="w-6 h-6" />
                      {t.timer.header}
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start gap-3 h-14 text-xl font-medium hover:bg-white/5 active:scale-[0.98] transition-all px-6 ${
                      pathname === '/projects'
                        ? 'bg-primary/10 text-primary border-l-4 border-primary rounded-l-none'
                        : 'text-foreground'
                    }`}
                  >
                    <Link href="/projects" data-testid="mobile-nav-projects">
                      <Settings className="w-6 h-6" />
                      {t.common.projects}
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start gap-3 h-14 text-xl font-medium hover:bg-white/5 active:scale-[0.98] transition-all px-6 ${
                      pathname === '/reports'
                        ? 'bg-primary/10 text-primary border-l-4 border-primary rounded-l-none'
                        : 'text-foreground'
                    }`}
                  >
                    <Link href="/reports" data-testid="mobile-nav-reports">
                      <BarChart3 className="w-6 h-6" />
                      {t.common.reports}
                    </Link>
                  </Button>
                </>
              )}

              <div className="h-px bg-white/10 my-2 shrink-0" />

              {/* Mobile Language Switcher */}
              <div className="mt-auto pt-4 flex flex-col gap-3">
                <div className="px-2 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest pl-1 mb-1">
                  {t.navbar.languageSettings}
                </div>
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-2 text-sm font-bold rounded-lg transition-all ${
                      locale === 'en'
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('uk')}
                    className={`px-3 py-2 text-sm font-bold rounded-lg transition-all ${
                      locale === 'uk'
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Українська
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Active Timer Banner - Fixed at bottom for easier reach - Only show on very small screens or as needed */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-100 pointer-events-none">
        <div className="pointer-events-auto">
          <ActiveTimerBanner />
        </div>
      </div>
    </>
  );
}

function NavButton({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      className={`gap-2 px-4 h-9 rounded-full transition-all hover:scale-105 active:scale-95 ${
        active
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
          : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
      }`}
    >
      <Link href={href}>
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </Link>
    </Button>
  );
}
