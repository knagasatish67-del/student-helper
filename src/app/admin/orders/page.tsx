'use client';
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/adminlayout';
import { OrderTable } from '@/components/admin/ordertable';
import { Order, OrderStatus } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      toast({ title: 'No orders', description: 'No orders available to export' });
      return;
    }
    const headers = [
      'Order Number',
      'Student Name',
      'Phone',
      'Hostel',
      'Room',
      'Service Type',
      'Total Amount (INR)',
      'Status',
      'Payment Status',
      'Files Count',
      'Pickup/Delivery Time',
      'Created At',
    ];
    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${(o.customerName || o.user?.name || 'Student').replace(/"/g, '""')}"`,
      `"${(o.customerPhone || o.user?.phone || '').replace(/"/g, '""')}"`,
      `"${(o.hostel || o.user?.hostel || '').replace(/"/g, '""')}"`,
      `"${(o.roomNumber || o.user?.roomNumber || '').replace(/"/g, '""')}"`,
      `"${o.serviceType}"`,
      o.totalAmount || 0,
      `"${o.status}"`,
      `"${o.paymentStatus || 'PENDING'}"`,
      o.files?.length || 0,
      `"${(o.pickupTime || '').replace(/"/g, '""')}"`,
      `"${o.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Export Complete', description: 'Orders downloaded as CSV' });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast({ title: 'Status Updated', description: `Order ${status}` });
        fetchOrders();
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (o.orderNumber && o.orderNumber.toLowerCase().includes(term)) ||
      (o.customerName && o.customerName.toLowerCase().includes(term)) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(term)) ||
      (o.hostel && o.hostel.toLowerCase().includes(term)) ||
      (o.user?.name && o.user.name.toLowerCase().includes(term)) ||
      (o.user?.rollNumber && o.user.rollNumber.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Orders Management
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Search, inspect documents, download student print files, and manage printing workflows.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search order #, student name, roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PRINTING">Printing</option>
              <option value="READY_FOR_PICKUP">Ready for Pickup</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <Button size="icon" variant="outline" onClick={fetchOrders} className="h-9 w-9 shrink-0" title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={exportOrdersCSV}
              className="h-9 gap-1.5 text-xs shrink-0"
              title="Export all orders to CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <OrderTable
          orders={filteredOrders}
          onStatusChange={handleStatusChange}
          isLoading={loading}
        />
      </div>
    </AdminLayout>
  );
}
