'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export function LoginContent() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('admin@arctictime.com');
  const [password, setPassword] = useState('Password123!');
  const [confirmPassword, setConfirmPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && password !== confirmPassword) {
      toast.error(t.auth.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (data.session) {
          toast.success(t.auth.successLogin);
          router.push('/');
          router.refresh();
        } else {
          toast.success(
            t.auth.successRegister +
              ' ' +
              (t.auth.checkEmail || 'Check your email for confirmation link.')
          );
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t.auth.successLogin);
        router.push('/');
        router.refresh();
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60dvh] w-full flex items-center justify-center px-4">
      <Card className="w-full max-w-md glass-card border-t-4 border-t-primary/50 relative z-20">
        <CardHeader className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60 leading-none">
            {isSignUp ? t.auth.createAccount : t.auth.welcome}
          </h1>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-6 pt-8">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-base font-medium text-foreground/80"
              >
                {t.auth.email}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base bg-secondary/30 border-primary/20 focus-visible:ring-primary/30 transition-all hover:bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-base font-medium text-foreground/80"
              >
                {t.auth.password}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base bg-secondary/30 border-primary/20 focus-visible:ring-primary/30 transition-all hover:bg-secondary/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label
                  htmlFor="confirmPassword"
                  className="text-base font-medium text-foreground/80"
                >
                  {t.auth.confirmPassword}
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 text-base bg-secondary/30 border-primary/20 focus-visible:ring-primary/30 transition-all hover:bg-secondary/50"
                  placeholder="••••••••"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-6 pt-6 pb-8 px-8">
            <Button
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? t.common.loading
                : isSignUp
                  ? t.auth.signUp
                  : t.auth.login}
            </Button>
            <Button
              variant="link"
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground/80 hover:text-primary transition-colors font-medium"
            >
              {isSignUp ? t.auth.alreadyHaveAccount : t.auth.noAccount}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
