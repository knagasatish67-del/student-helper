'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/adminlayout';
import { StatCard } from '@/components/admin/statcard';
import { OrderTable } from '@/components/admin/ordertable';
import { Order, AdminStats, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Clock,
  CheckCircle2,
  DollarSign,
  Users,
  Printer,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/stats'),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.orders) setOrders(ordersData.orders);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.stats) setStats(statsData.stats);
      }
    } catch (e) {
      console.error('Failed to load admin stats or orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast({ title: 'Status Updated', description: `Order status set to ${status}` });
        fetchData();
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Print Shop Operations Center
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Live monitor for photocopy, assignment preparation, and lab record requests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchData}
              className="gap-2 text-xs h-9"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Queue
            </Button>
            <Link href="/admin/orders">
              <Button size="sm" className="gap-2 text-xs h-9">
                Full Orders Queue <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending In Queue"
            value={stats?.pendingOrders ?? 0}
            subtitle="Orders needing print or readying"
            icon={Clock}
            trend="Active Jobs"
            trendUp={false}
            color="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${(stats?.totalRevenue ?? 0).toFixed(2)}`}
            subtitle="Cash & online campus pay"
            icon={DollarSign}
            trend="+18% this week"
            trendUp={true}
            color="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          />
          <StatCard
            title="Total Completed"
            value={stats?.completedOrders ?? 0}
            subtitle="Delivered / Collected"
            icon={CheckCircle2}
            trend="100% fulfill rate"
            trendUp={true}
            color="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
          />
          <StatCard
            title="Enrolled Students"
            value={stats?.totalCustomers ?? 0}
            subtitle="Registered campus users"
            icon={Users}
            trend="Active base"
            trendUp={true}
            color="bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400"
          />
        </div>

        {/* Active Print Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Printer className="h-4 w-4 text-indigo-600" />
                Current Processing Queue
              </h3>
              <p className="text-xs text-zinc-500">
                Click status buttons to instantly notify the student via real-time timeline.
              </p>
            </div>
            <span className="text-xs font-semibold text-zinc-500">
              {orders.length} Total Records
            </span>
          </div>

          <OrderTable
            orders={orders}
            onStatusChange={handleStatusChange}
            isLoading={loading}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
