'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { StatusTimeline } from '@/components/client/statustimeline';
import { ChatWindow } from '@/components/client/chatwindow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order, OrderStatus } from '@/types';
import {
  Search,
  Truck,
  Phone,
  User,
  MapPin,
  Clock,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Package,
} from 'lucide-react';
import { format } from 'date-fns';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('orderId') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Fetch recent orders for quick click
  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setRecentOrders(data.orders.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  const handleSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch ?? searchQuery).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(`No active order found matching "${q}". Please check the Order ID.`);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to retrieve order tracking info');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="mx-auto max-w-5xl py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 mb-3">
          <Truck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
          Live Order Tracking
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-500">
          Enter your unique University Order ID (e.g. UNI-000124) to track real-time agent delivery status.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Enter Order ID (e.g. UNI-000124 or UNI-XXXXXX)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-xs sm:text-sm font-mono uppercase font-semibold"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-11 px-6 font-semibold">
            {loading ? 'Tracking...' : 'Track'}
          </Button>
        </form>

        {/* Quick select from recent orders */}
        {recentOrders.length > 0 && !order && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
            <span>Recent orders:</span>
            {recentOrders.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchQuery(o.orderNumber);
                  handleSearch(o.orderNumber);
                }}
                className="font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="max-w-xl mx-auto mb-8 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 text-xs flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Result */}
      {order && (
        <div className="space-y-6">
          {/* Acceptance / Delivery Agent Banner */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/40 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-100 flex items-center gap-2">
                    Your order has been accepted!
                    <Badge variant="default" className="text-[10px] uppercase font-mono">
                      {order.orderNumber}
                    </Badge>
                  </h3>
                  <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-0.5">
                    Our service agent will reach you as soon as possible with your documents.
                  </p>
                </div>
              </div>

              {/* Service Agent Info if assigned */}
              {order.agentName && (
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-800/80 shadow-xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                      Service Agent
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {order.agentName}
                    </span>
                  </div>
                  {order.agentPhone && (
                    <a
                      href={`tel:${order.agentPhone}`}
                      className="ml-2 inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <Phone className="h-3 w-3" /> Call
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Stage Timeline */}
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Stage by Stage Order Progress</span>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                  Status: {order.status.replace(/_/g, ' ')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline status={order.status} />
            </CardContent>
          </Card>

          {/* Grid: Order & Delivery details vs Live Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Delivery & Customer Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Delivery & Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="text-zinc-400 block text-[11px]">Customer Name</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {order.customerName || order.user?.name || 'Student'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="text-zinc-400 block text-[11px]">Contact Phone</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {order.customerPhone || order.user?.phone || 'N/A'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="text-zinc-400 block text-[11px]">Hostel & Room</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {order.hostel || 'Main Campus Hostel'} • {order.roomNumber || 'Room N/A'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="text-zinc-400 block text-[11px]">Collection Mode</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {order.deliveryOption === 'HOSTEL'
                          ? 'Hostel Room Delivery'
                          : 'Campus Counter Pickup'}
                      </span>
                    </div>
                  </div>

                  {order.deliveryAddress && (
                    <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60">
                      <span className="text-zinc-400 block text-[11px]">Delivery Instructions / Address</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {order.deliveryAddress}
                      </span>
                    </div>
                  )}

                  {/* Payment status badge */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-amber-600" />
                      <div>
                        <span className="font-semibold text-amber-950 dark:text-amber-200 block">
                          Payment Mode: Direct / Offline
                        </span>
                        <span className="text-[11px] text-amber-800 dark:text-amber-300">
                          Pay cash directly to delivery agent upon receiving
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-zinc-500 block">Total Due</span>
                      <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Chat with Shop & Agent */}
            <div>
              <ChatWindow orderId={order.id} orderNumber={order.orderNumber} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-16 text-center text-sm">Loading tracking engine...</div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
