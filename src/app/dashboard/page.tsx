'use client';
import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { useAuth } from '@/components/providers/authprovider';
import { useOrders } from '@/hooks/useorders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Printer,
  FileEdit,
  BookOpen,
  ShoppingBag,
  Clock,
  ArrowRight,
  TrendingUp,
  User,
} from 'lucide-react';
import { format } from 'date-fns';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { orders } = useOrders();

  const activeOrders = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PRINTING' || o.status === 'READY_FOR_PICKUP'
  );
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Welcome Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-900 to-indigo-700 p-6 sm:p-8 text-white shadow-md">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1.5 max-w-2xl">
              Manage your academic printing jobs, download submitted materials, and track live pickup status.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/order/xerox">
                <Button size="sm" className="bg-white text-indigo-900 hover:bg-zinc-100 font-semibold gap-1.5">
                  <Printer className="h-4 w-4" /> Xerox Document
                </Button>
              </Link>
              <Link href="/order/assignment">
                <Button size="sm" variant="outline" className="text-white border-indigo-400/50 hover:bg-white/10 gap-1.5">
                  <FileEdit className="h-4 w-4" /> Prepare Assignment
                </Button>
              </Link>
              <Link href="/order/manual">
                <Button size="sm" variant="outline" className="text-white border-indigo-400/50 hover:bg-white/10 gap-1.5">
                  <BookOpen className="h-4 w-4" /> Lab Manual
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase">Active In Queue</p>
                  <p className="text-2xl font-bold mt-1 text-indigo-600 dark:text-indigo-400">
                    {activeOrders.length}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Printing or ready for pickup</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-950/50">
                  <Clock className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase">Total Orders Placed</p>
                  <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-100">
                    {orders.length}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Across this semester</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/50">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase">Total Spent</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                    ₹{totalSpent.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Academic expense saving</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/50">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Queue */}
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Recent Print Jobs</CardTitle>
              <Link href="/my-orders" className="text-xs font-semibold text-indigo-600 hover:underline">
                View All Orders →
              </Link>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-400">No print jobs yet.</div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="py-3.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 flex items-center justify-center">
                          <Printer className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">
                            {order.orderNumber} • {order.serviceType}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {format(new Date(order.createdAt), 'MMM dd, hh:mm a')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold">₹{order.totalAmount.toFixed(2)}</span>
                        <Badge variant="outline">{order.status}</Badge>
                        <Link href={`/orders/${order.id}`}>
                          <Button size="sm" variant="ghost" className="h-7 text-xs">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
