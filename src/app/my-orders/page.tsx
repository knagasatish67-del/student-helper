'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { useOrders } from '@/hooks/useorders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Printer,
  ShoppingBag,
  Eye,
  ArrowRight,
  Clock,
  Plus,
  Truck,
  Banknote,
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';

export default function MyOrdersPage() {
  const { orders, isLoading } = useOrders();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  const isCompletedStatus = (st: string) => st === 'COMPLETED' || st === 'CANCELLED';

  const filteredOrders = orders.filter((o) => {
    if (filter === 'ACTIVE') return !isCompletedStatus(o.status);
    if (filter === 'COMPLETED') return isCompletedStatus(o.status);
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ORDER_PLACED':
      case 'PENDING':
        return <Badge variant="warning">Order Placed</Badge>;
      case 'ORDER_ACCEPTED':
      case 'CONFIRMED':
        return <Badge variant="default">Accepted</Badge>;
      case 'PROCESSING':
      case 'PRINTING':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'READY':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Ready</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge variant="default" className="bg-amber-100 text-amber-800">Out for Delivery</Badge>;
      case 'AVAILABLE_FOR_PICKUP':
      case 'READY_FOR_PICKUP':
        return <Badge variant="success">Ready for Pickup</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950 pb-16 sm:pb-0">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white flex items-center gap-2.5">
                <ShoppingBag className="h-7 w-7 text-indigo-600" />
                My Print & Service Orders
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Real-time tracking of your photocopy, assignment, and lab manual jobs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/track">
                <Button variant="outline" className="gap-2 text-xs h-9">
                  <Truck className="h-4 w-4 text-indigo-600" /> Dedicated Tracker
                </Button>
              </Link>
              <Link href="/order/xerox">
                <Button className="gap-2 text-xs h-9">
                  <Plus className="h-4 w-4" /> Place New Order
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-zinc-200 pb-3 mb-6 dark:border-zinc-800 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'ALL'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'ACTIVE'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400'
              }`}
            >
              Active Queue ({orders.filter((o) => !isCompletedStatus(o.status)).length})
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'COMPLETED'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400'
              }`}
            >
              Completed ({orders.filter((o) => isCompletedStatus(o.status)).length})
            </button>
          </div>

          {/* List of Orders */}
          {isLoading ? (
            <div className="p-16 text-center text-sm text-zinc-500">
              Loading your orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card className="border-dashed p-12 text-center">
              <Printer className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                No orders in this view
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Select one of our campus services to place your xerox, assignment, or practical manual order.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Link href="/order/xerox">
                  <Button size="sm">Order Xerox</Button>
                </Link>
                <Link href="/order/assignment">
                  <Button size="sm" variant="outline">Order Assignment</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-all border-zinc-200 dark:border-zinc-800"
                >
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {order.orderNumber}
                        </span>
                        <Badge variant="outline" className="text-[11px] font-semibold">
                          {order.serviceType}
                        </Badge>
                        {getStatusBadge(order.status)}
                      </div>

                      <p className="text-xs text-zinc-500">
                        Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy • hh:mm a')}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                          {order.hostel || 'Main Campus'}, {order.roomNumber || 'Room N/A'}
                        </span>
                        {order.agentName && (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Truck className="h-3.5 w-3.5" />
                            Agent: {order.agentName}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                          <Banknote className="h-3.5 w-3.5" />
                          Offline Due: ₹{order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <Link href={`/orders/${order.id}`}>
                        <Button size="sm" variant="outline" className="text-xs gap-1.5">
                          <Eye className="h-3.5 w-3.5" /> Track Status
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
