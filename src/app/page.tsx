'use client';
import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { Button } from '@/components/ui/button';
import {
  Printer,
  FileEdit,
  BookOpen,
  Zap,
  Sparkles,
  Truck,
  Banknote,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950 pb-16 sm:pb-0">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-zinc-200/80 bg-gradient-to-b from-indigo-50/50 via-white to-white py-14 sm:py-20 dark:border-zinc-800 dark:from-zinc-900/50 dark:via-zinc-950 dark:to-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/60 dark:text-indigo-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>University Student Document Hub • Offline Cash/UPI Collection</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-white max-w-4xl mx-auto">
              Assignment • Lab Record <br />
              <span className="text-indigo-600 dark:text-indigo-400">
                & University Xerox
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Upload your documents for instant print, assignment preparation, and practical lab manuals.
              Our campus delivery agents hand over completed orders directly to your hostel room with zero online payment required.
            </p>

            {/* Primary Order CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/order/xerox">
                <Button size="lg" className="w-full sm:w-auto gap-2 font-semibold shadow-md shadow-indigo-500/20">
                  <Printer className="h-4 w-4" /> Order Xerox (₹1/page)
                </Button>
              </Link>
              <Link href="/order/assignment">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <FileEdit className="h-4 w-4 text-purple-600" /> Order Assignment (₹30)
                </Button>
              </Link>
              <Link href="/order/manual">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" /> Order Lab Manual
                </Button>
              </Link>
            </div>

            {/* Offline Payment & Direct Delivery Highlights */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-zinc-200/80 pt-6 dark:border-zinc-800">
              <div className="flex flex-col items-center text-center">
                <Banknote className="h-5 w-5 text-amber-600 mb-1" />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">No Online Payment</span>
                <span className="text-[11px] text-zinc-500">Pay cash on delivery</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Truck className="h-5 w-5 text-indigo-600 mb-1" />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Hostel Room Delivery</span>
                <span className="text-[11px] text-zinc-500">Delivered directly to room</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Zap className="h-5 w-5 text-amber-500 mb-1" />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Emergency Express</span>
                <span className="text-[11px] text-zinc-500">Overnight rush available</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Layers className="h-5 w-5 text-emerald-600 mb-1" />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Unlimited PDF Uploads</span>
                <span className="text-[11px] text-zinc-500">No limit on file count</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRD Direct/Offline Payment Explainer Banner */}
        <section className="py-12 bg-zinc-50/50 dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-indigo-50/80 border border-indigo-200 p-6 sm:p-8 dark:bg-indigo-950/30 dark:border-indigo-900/60">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                  <Banknote className="h-7 w-7" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-indigo-950 dark:text-indigo-100">
                    Direct Offline Payment & Hostel Room Handover
                  </h3>
                  <p className="text-xs sm:text-sm text-indigo-900/80 dark:text-indigo-300 mt-1 leading-relaxed">
                    You never need to enter debit card details or worry about payment gateway failures. Once your document is prepared, a university delivery agent hands over your physical order to your hostel room, where you can inspect and pay directly in cash or UPI.
                  </p>
                </div>
                <Link href="/order/xerox" className="shrink-0">
                  <Button className="font-semibold gap-2">
                    Start Printing <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
