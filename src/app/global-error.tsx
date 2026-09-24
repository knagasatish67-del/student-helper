'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-zinc-50 p-6 text-zinc-900 font-sans antialiased">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl border border-zinc-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 font-bold text-xl">
            !
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Application Error
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            An unexpected error occurred. You can attempt to refresh the application.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Reload Application
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
