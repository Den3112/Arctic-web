import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | ArcticTime',
  description:
    'Sign in to your ArcticTime account to track time and manage projects.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
