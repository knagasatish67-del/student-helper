'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error caught by ErrorBoundary:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 shadow-sm">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-zinc-500">
        {error?.message || 'An unexpected error occurred while loading this page. Please try again.'}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button
          onClick={() => reset()}
          size="sm"
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Home className="h-3.5 w-3.5" /> Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
