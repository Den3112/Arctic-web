import type { Metadata } from 'next';
import { Outfit, Calistoga } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TimerProvider } from '@/contexts/TimerContext';
import { getActiveEntry } from '@/actions/time-entries';
import { PageTransition } from '@/components/layout/PageTransition';
import { Analytics } from '@vercel/analytics/next';

const bodyFont = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const displayFont = Calistoga({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-calistoga',
});

export const metadata: Metadata = {
  title: {
    default: 'ArcticTime | Professional Time Tracking',
    template: '%s | ArcticTime',
  },
  description:
    'High-performance time tracker for modern workflows and professionals. Track your productivity with ArcticTime.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ArcticTime | Professional Time Tracking',
    description:
      'High-performance time tracker for modern workflows and professionals. Track your productivity with ArcticTime.',
    type: 'website',
    url: '/',
    siteName: 'ArcticTime',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArcticTime | Professional Time Tracking',
    description:
      'High-performance time tracker for modern workflows and professionals.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // maximumScale: 1, // Removed to improve accessibility (allow zooming)
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeEntry = await getActiveEntry();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body
        className={`${bodyFont.variable} ${displayFont.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        {/* Elite Background Atmosphere is now handled via CSS only */}

        <LanguageProvider>
          <TimerProvider initialActiveEntry={activeEntry}>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto px-4 pt-32 pb-24 md:pb-8 relative z-10">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </div>
          </TimerProvider>
          <Toaster position="top-center" />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
