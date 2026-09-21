'use client';
import React from 'react';
import Link from 'next/link';
import { Order, OrderStatus } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export interface OrderTableProps {
  orders: Order[];
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
  isLoading?: boolean;
}

export function OrderTable({ orders, onStatusChange, isLoading }: OrderTableProps) {
  const formatDateSafe = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr || 'Just now';
      return format(d, 'MMM dd, hh:mm a');
    } catch {
      return 'Just now';
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'ORDER_PLACED':
        return <Badge variant="default" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">Order Placed</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'CONFIRMED':
        return <Badge variant="default">Confirmed</Badge>;
      case 'PRINTING':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">Printing</Badge>;
      case 'READY_FOR_PICKUP':
        return <Badge variant="success">Ready for Delivery</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceBadge = (type: string) => {
    switch (type) {
      case 'XEROX':
        return <span className="inline-flex items-center gap-1 font-medium text-xs text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300 px-2 py-0.5 rounded">Xerox</span>;
      case 'ASSIGNMENT':
        return <span className="inline-flex items-center gap-1 font-medium text-xs text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 px-2 py-0.5 rounded">Assignment</span>;
      case 'MANUAL':
        return <span className="inline-flex items-center gap-1 font-medium text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded">Lab Manual</span>;
      default:
        return <span>{type}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        Loading orders queue...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center text-zinc-400">
        <Printer className="h-10 w-10 mx-auto mb-2 opacity-30" />
        <p className="text-sm font-medium">No orders found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Files</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-semibold text-xs font-mono text-zinc-900 dark:text-zinc-100">
                {order.orderNumber}
              </TableCell>
              <TableCell>
                <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {order.customerName || order.user?.name || 'Student'}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {order.customerPhone || order.hostel || order.user?.rollNumber || order.user?.email || 'Walk-in'}
                </div>
              </TableCell>
              <TableCell>{getServiceBadge(order.serviceType)}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <FileText className="h-3.5 w-3.5" />
                  {order.files?.length || 0} file(s)
                </span>
              </TableCell>
              <TableCell className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                ₹{(order.totalAmount || 0).toFixed(2)}
              </TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-[11px] text-zinc-500">
                {formatDateSafe(order.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {onStatusChange && (order.status === 'PENDING' || order.status === 'ORDER_PLACED') && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      onClick={() => onStatusChange(order.id, 'PRINTING')}
                    >
                      Print
                    </Button>
                  )}
                  {onStatusChange && order.status === 'PRINTING' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      onClick={() => onStatusChange(order.id, 'READY_FOR_PICKUP')}
                    >
                      Ready
                    </Button>
                  )}
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
