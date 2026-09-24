import Link from 'next/link';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 shadow-sm">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            404
          </h1>
          <h2 className="mt-2 text-lg font-bold text-zinc-800 dark:text-zinc-200">
            Page Not Found
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500">
            The page or service you are looking for doesn&apos;t exist or may have been moved.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs">
                <Home className="h-4 w-4" /> Go to Homepage
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2 text-xs">
                <ArrowLeft className="h-4 w-4" /> Track Orders
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
