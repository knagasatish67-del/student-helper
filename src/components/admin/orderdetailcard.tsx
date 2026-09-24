'use client';
import React, { useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Truck,
  Send,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export interface OrderDetailCardProps {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
  onOrderUpdated?: () => void;
}

export function OrderDetailCard({ order, onStatusChange, onOrderUpdated }: OrderDetailCardProps) {
  const [agentName, setAgentName] = useState(order.agentName || '');
  const [agentPhone, setAgentPhone] = useState(order.agentPhone || '');
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || 'PENDING');
  const [isUpdatingAgent, setIsUpdatingAgent] = useState(false);

  const statuses: OrderStatus[] = [
    'ORDER_PLACED',
    'ORDER_ACCEPTED',
    'PROCESSING',
    'READY',
    'OUT_FOR_DELIVERY',
    'AVAILABLE_FOR_PICKUP',
    'COMPLETED',
    'CANCELLED',
  ];

  const handleUpdateAgentAndPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingAgent(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName,
          agentPhone,
          paymentStatus,
        }),
      });
      if (res.ok) {
        toast({
          title: 'Order Updated',
          description: 'Agent assignment and payment status saved.',
        });
        if (onOrderUpdated) onOrderUpdated();
      } else {
        toast({ title: 'Update failed', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsUpdatingAgent(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl font-bold font-mono">
                {order.orderNumber}
              </CardTitle>
              <Badge variant="default">{order.serviceType}</Badge>
              <Badge variant="outline" className="font-bold">
                ₹{order.totalAmount.toFixed(2)}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy • hh:mm a')}
            </p>
          </div>

          {/* Quick status switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">Order Status:</span>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 shadow-xs focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Customer Profile & Hostel Delivery Info */}
          <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
              <User className="h-4 w-4 text-indigo-600" /> Customer & Delivery Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-zinc-400 block">Student Name</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {order.customerName || order.user?.name || 'Walk-in Student'}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block">Contact Phone</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {order.customerPhone || order.user?.phone || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block">Hostel & Room</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {order.hostel || 'Campus'} • {order.roomNumber || 'Room N/A'}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block">Collection Option</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {order.deliveryOption === 'HOSTEL' ? 'Hostel Room Delivery' : 'Campus Counter Pickup'}
                </span>
              </div>
            </div>

            {order.deliveryAddress && (
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 text-xs">
                <span className="text-zinc-400 font-medium">Delivery Landmark / Address: </span>
                <span className="text-zinc-800 dark:text-zinc-200">{order.deliveryAddress}</span>
              </div>
            )}
          </div>

          {/* Assign Service Agent & Payment Status Form */}
          <form
            onSubmit={handleUpdateAgentAndPayment}
            className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 dark:border-indigo-900/50 dark:bg-indigo-950/20 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-indigo-600" />
                Service Agent Assignment & Payment Collection
              </h4>
              <span className="text-[11px] text-zinc-500">
                Direct / Offline Cash Model
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                  Assigned Agent Name
                </label>
                <Input
                  placeholder="e.g. Ramesh K. / Agent Suresh"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="h-8 text-xs bg-white dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                  Agent Contact Phone
                </label>
                <Input
                  placeholder="e.g. +91 98765 43210"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="h-8 text-xs bg-white dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                  Direct Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs font-semibold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="PENDING">Pending (Awaiting Handover)</option>
                  <option value="PAID">Paid (Cash / Direct UPI Received)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                size="sm"
                disabled={isUpdatingAgent}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                {isUpdatingAgent ? 'Saving...' : 'Save & Notify Student Timeline'}
              </Button>
            </div>
          </form>

          {/* Service Configuration Specifications */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Service Specifications
            </h4>

            {order.xeroxConfig && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Copies</span>
                  <span className="font-bold text-sm">{order.xeroxConfig.copies}</span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Color Mode</span>
                  <span className="font-bold text-sm">
                    {order.xeroxConfig.colorMode === 'COLOR' ? 'Full Color (₹5/p)' : 'B&W (₹1/p)'}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Print Sides</span>
                  <span className="font-bold text-sm">
                    {order.xeroxConfig.printSides === 'DOUBLE' ? 'Double Sided' : 'Single Sided'}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Sunday Surcharge</span>
                  <span className="font-bold text-sm">
                    {order.isSunday ? 'Applied (+₹20)' : 'None'}
                  </span>
                </div>
              </div>
            )}

            {order.assignmentConfig && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Type</span>
                  <span className="font-bold text-sm">
                    {order.assignmentConfig.orderType === 'EMERGENCY' ? 'Emergency (₹40)' : 'Normal (₹30)'}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Subject</span>
                  <span className="font-bold text-sm">{order.assignmentConfig.subject || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Quantity</span>
                  <span className="font-bold text-sm">{order.assignmentConfig.quantity || 1}</span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Deadline</span>
                  <span className="font-bold text-sm">{order.assignmentConfig.deadline || 'Standard'}</span>
                </div>
              </div>
            )}

            {order.manualConfig && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Order Mode</span>
                  <span className="font-bold text-sm">
                    {order.manualConfig.orderType === 'EMERGENCY'
                      ? `Emergency (${order.manualConfig.practicalsCount || 1} practicals @ ₹30/practical)`
                      : `Normal (${order.manualConfig.practicalsCount || 1} practicals @ ₹25/practical)`}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Normal Diagrams</span>
                  <span className="font-bold text-sm">
                    {order.manualConfig.normalDiagramsCount || 0} (+₹10 each)
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Medical Diagrams</span>
                  <span className="font-bold text-sm">
                    {order.manualConfig.medicalDiagramsCount || 0} (+₹50 each)
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-400 block">Subject</span>
                  <span className="font-bold text-sm">{order.manualConfig.subject}</span>
                </div>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-semibold block mb-0.5">Special Student Instructions:</span>
                {order.notes}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
