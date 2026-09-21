'use client';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  Printer,
  Home,
  Truck,
  Banknote,
} from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNum = searchParams.get('num') || 'UNI-000124';
  const service = searchParams.get('service') || 'PRINT SERVICE';
  const amount = searchParams.get('amount') || '50';

  return (
    <div className="mx-auto max-w-xl py-10 px-4 sm:px-6">
      {/* Success Badge */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-3 ring-8 ring-emerald-50 dark:ring-emerald-950/40">
          <CheckCircle2 className="h-11 w-11 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Order Confirmed
        </h1>
        <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          Thank You!
        </p>
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>order conformed • thank you</span>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-zinc-500">
          Your service request has been queued in the campus system.
        </p>
      </div>

      {/* PRD Mandated Order Acceptance Banner */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/40 shadow-xs mb-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
              Your order has been accepted!
            </h3>
            <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 leading-relaxed">
              Our service agent will reach you as soon as possible with your documents.
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-white/80 dark:bg-zinc-900/80 px-2.5 py-1 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
              <span>Order ID:</span>
              <span className="text-indigo-600 dark:text-indigo-400">{orderNum}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Card */}
      <Card className="border-zinc-200 dark:border-zinc-800 text-left mb-6">
        <CardContent className="p-5 space-y-3.5 text-xs">
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-zinc-500 font-medium">Service Type</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{service}</span>
          </div>

          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-zinc-500 font-medium">Payment Mode</span>
            <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
              <Banknote className="h-4 w-4" />
              Direct / Offline Collection
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-zinc-500 font-medium">Total Amount Due</span>
            <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
              ₹{parseFloat(amount).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-medium">Estimated Arrival</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Within 1–2 hours to hostel room
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/order/xerox" className="flex-1">
          <Button className="w-full gap-2 h-11 text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/10">
            <Printer className="h-4 w-4" /> Place Another Order
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full gap-2 h-11 text-xs sm:text-sm">
            <Home className="h-4 w-4 text-indigo-600" /> Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={<div className="p-12 text-center text-sm">Loading order details...</div>}
        >
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
