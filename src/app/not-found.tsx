import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-(--spacing(32)))] flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-4xl font-bold tracking-tight">404 - Not Found</h2>
      <p className="text-lg text-muted-foreground">
        Could not find requested resource
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Return Home
      </Link>
    </div>
  );
}
