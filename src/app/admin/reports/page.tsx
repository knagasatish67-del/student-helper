'use client';
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/adminlayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/admin/statcard';
import { BarChart3, TrendingUp, DollarSign, Package, Printer, BookOpen, FileEdit } from 'lucide-react';

export default function AdminReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reports')
      .then((res) => res.json())
      .then((data) => setReport(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            Business Reports & Analytics
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Revenue breakdowns, service popularity, paper consumption, and fulfillment statistics.
          </p>
        </div>

        {/* Top summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Revenue Generated"
            value={`₹${(report?.totalRevenue ?? 0).toFixed(2)}`}
            subtitle="Combined order gross"
            icon={DollarSign}
            color="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50"
          />
          <StatCard
            title="Total Orders Processed"
            value={report?.totalOrders ?? 0}
            subtitle="Campus print jobs"
            icon={Package}
            color="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50"
          />
          <StatCard
            title="Avg. Order Value"
            value={
              report?.totalOrders
                ? `₹${(report.totalRevenue / report.totalOrders).toFixed(2)}`
                : '₹0.00'
            }
            subtitle="Per student transaction"
            icon={TrendingUp}
            color="bg-purple-50 text-purple-600 dark:bg-purple-950/50"
          />
        </div>

        {/* Revenue by Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Printer className="h-4 w-4 text-blue-600" />
                Document Xerox
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(report?.revenueByService?.XEROX ?? 0).toFixed(2)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {report?.serviceBreakdown?.XEROX ?? 0} orders completed
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileEdit className="h-4 w-4 text-purple-600" />
                Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(report?.revenueByService?.ASSIGNMENT ?? 0).toFixed(2)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {report?.serviceBreakdown?.ASSIGNMENT ?? 0} assignments prepared
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                Lab Manuals & Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(report?.revenueByService?.MANUAL ?? 0).toFixed(2)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {report?.serviceBreakdown?.MANUAL ?? 0} manuals bound
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Paper consumption & machine health */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Operational Efficiency & Consumables</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <span className="text-zinc-500 block mb-1">A4 Paper Reams Remaining</span>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">42 Reams</span>
              <span className="text-emerald-600 block mt-1 font-medium">✓ Sufficient for 3 weeks</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <span className="text-zinc-500 block mb-1">Black Toner Levels</span>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">78% Full</span>
              <span className="text-emerald-600 block mt-1 font-medium">✓ Industrial Laser OK</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <span className="text-zinc-500 block mb-1">Spiral Rings & Covers</span>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">350 Units</span>
              <span className="text-emerald-600 block mt-1 font-medium">✓ Stock healthy</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
