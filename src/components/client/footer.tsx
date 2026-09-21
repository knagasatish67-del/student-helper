import React from 'react';
import Link from 'next/link';
import { Printer, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50/50 py-10 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Info */}
          <div className="space-y-2 text-center md:text-left max-w-md">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Printer className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-white">
                Student<span className="text-indigo-600">Helper</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Your one-stop campus solution for high-speed printing, xerox, assignment formatting, and lab manual preparation with direct hostel delivery.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-emerald-600 font-medium pt-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Student Friendly Pricing & Direct Offline Payment</span>
            </div>
          </div>

          {/* Quick Print Services Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/order/xerox" className="hover:text-indigo-600 transition-colors">
              Xerox & Print
            </Link>
            <Link href="/order/assignment" className="hover:text-indigo-600 transition-colors">
              Assignments
            </Link>
            <Link href="/order/manual" className="hover:text-indigo-600 transition-colors">
              Lab Manuals
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200/80 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
          © {new Date().getFullYear()} StudentHelper Campus Hub. Built for fast academic printing and student convenience.
        </div>
      </div>
    </footer>
  );
}
