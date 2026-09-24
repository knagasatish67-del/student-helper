'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { StatusTimeline } from '@/components/client/statustimeline';
import { ChatWindow } from '@/components/client/chatwindow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';
import {
  FileText,
  ArrowLeft,
  Download,
  AlertCircle,
  Truck,
  User,
  Phone,
  Banknote,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
    if (order?.status === 'COMPLETED' || order?.status === 'CANCELLED') return;
    const interval = setInterval(fetchOrder, 6000);
    return () => clearInterval(interval);
  }, [fetchOrder, order?.status]);

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      if (res.ok) {
        toast({ title: 'Order Cancelled' });
        fetchOrder();
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/my-orders')}
            className="mb-6 gap-2 text-xs"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Button>

          {loading ? (
            <div className="p-16 text-center text-sm text-zinc-500">Loading order status...</div>
          ) : !order ? (
            <div className="p-16 text-center">
              <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
              <h2 className="text-lg font-bold">Order Not Found</h2>
              <p className="text-xs text-zinc-500 mt-1">Please check your order ID or tracking link.</p>
            </div>
          ) : (
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
                        <Badge variant="default" className="text-[10px] font-mono">
                          {order.orderNumber}
                        </Badge>
                      </h3>
                      <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-0.5">
                        Our service agent will reach you as soon as possible with your documents.
                      </p>
                    </div>
                  </div>

                  {/* Agent assignment card */}
                  {order.agentName ? (
                    <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-xs">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <span className="text-[10px] text-zinc-400 block font-medium">Assigned Agent</span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{order.agentName}</span>
                      </div>
                      {order.agentPhone && (
                        <a
                          href={`tel:${order.agentPhone}`}
                          className="ml-2 inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                        >
                          <Phone className="h-3 w-3" /> Call
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-500 bg-white/70 dark:bg-zinc-900/70 px-3 py-1.5 rounded-lg border border-indigo-100">
                      Service agent assignment in progress...
                    </div>
                  )}
                </div>
              </div>

              {/* Stage-by-Stage Status Timeline Card */}
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <CardTitle className="text-xl font-bold font-mono">
                        {order.orderNumber}
                      </CardTitle>
                      <Badge variant="default">{order.serviceType}</Badge>
                      <Badge variant="outline" className="font-bold">
                        ₹{order.totalAmount.toFixed(2)}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Submitted on {format(new Date(order.createdAt), 'MMMM dd, yyyy • hh:mm a')}
                    </p>
                  </div>

                  {(order.status === 'PENDING' || order.status === 'ORDER_PLACED') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelOrder}
                      className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900"
                    >
                      Cancel Order
                    </Button>
                  )}
                </CardHeader>

                <CardContent className="pt-4">
                  <StatusTimeline
                    status={order.status}
                    deliveryOption={order.deliveryOption || 'HOSTEL'}
                  />
                </CardContent>
              </Card>

              {/* Grid: Order Specifications & Attached files vs Live Chat */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer & Delivery Address Card */}
                  <Card className="border-zinc-200 dark:border-zinc-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">
                        Delivery Destination & Payment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3.5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                          <span className="text-zinc-400 block text-[11px]">Recipient</span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {order.customerName || order.user?.name || 'Student'}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                          <span className="text-zinc-400 block text-[11px]">Contact Phone</span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {order.customerPhone || order.user?.phone || 'N/A'}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                          <span className="text-zinc-400 block text-[11px]">Hostel & Room</span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {order.hostel || 'Main Campus'} • {order.roomNumber || 'Room N/A'}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                          <span className="text-zinc-400 block text-[11px]">Delivery Mode</span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {order.deliveryOption === 'HOSTEL'
                              ? 'Hostel Room Delivery'
                              : 'Campus Counter Pickup'}
                          </span>
                        </div>
                      </div>

                      {order.deliveryAddress && (
                        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                          <span className="text-zinc-400 block text-[11px]">Landmark / Room Details</span>
                          <span className="text-zinc-800 dark:text-zinc-200">{order.deliveryAddress}</span>
                        </div>
                      )}

                      {/* Payment reminder */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-amber-600" />
                          <div>
                            <span className="font-semibold text-amber-950 dark:text-amber-200 block">
                              Direct Offline Payment Due: ₹{order.totalAmount.toFixed(2)}
                            </span>
                            <span className="text-[11px] text-amber-800 dark:text-amber-300">
                              Payment Status: {order.paymentStatus || 'Pending'} (Pay to agent upon arrival)
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Print Specifications */}
                  <Card className="border-zinc-200 dark:border-zinc-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">Service Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {order.xeroxConfig && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Copies</span>
                            <span className="font-bold">{order.xeroxConfig.copies}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Color Mode</span>
                            <span className="font-bold">
                              {order.xeroxConfig.colorMode === 'COLOR' ? 'Full Colour (₹5)' : 'B&W (₹1)'}
                            </span>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Print Sides</span>
                            <span className="font-bold">{order.xeroxConfig.printSides}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Sunday Service</span>
                            <span className="font-bold">{order.isSunday ? 'Yes (+₹20)' : 'No'}</span>
                          </div>
                        </div>
                      )}

                      {order.assignmentConfig && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Type</span>
                            <span className="font-bold">
                              {order.assignmentConfig.orderType === 'EMERGENCY'
                                ? 'Emergency (₹40)'
                                : 'Normal (₹30)'}
                            </span>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Subject</span>
                            <span className="font-bold">{order.assignmentConfig.subject || 'N/A'}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Quantity</span>
                            <span className="font-bold">{order.assignmentConfig.quantity || 1}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Deadline</span>
                            <span className="font-bold">{order.assignmentConfig.deadline || 'Standard'}</span>
                          </div>
                        </div>
                      )}

                      {order.manualConfig && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Order Mode</span>
                            <span className="font-bold">
                              {order.manualConfig.orderType === 'EMERGENCY'
                                ? `Emergency (${order.manualConfig.practicalsCount || 1} practicals @ ₹30/practical)`
                                : `Normal (${order.manualConfig.practicalsCount || 1} practicals @ ₹25/practical)`}
                            </span>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Normal Diagrams</span>
                            <span className="font-bold">
                              {order.manualConfig.normalDiagramsCount || 0} (+₹10 each)
                            </span>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Medical Diagrams</span>
                            <span className="font-bold">
                              {order.manualConfig.medicalDiagramsCount || 0} (+₹50 each)
                            </span>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                            <span className="text-zinc-500 block">Lab Subject</span>
                            <span className="font-bold">{order.manualConfig.subject}</span>
                          </div>
                        </div>
                      )}

                      {order.notes && (
                        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-xs">
                          <span className="text-zinc-500 block mb-0.5 font-medium">Notes / Instructions:</span>
                          <span className="text-zinc-800 dark:text-zinc-200">{order.notes}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Attached Files */}
                  <Card className="border-zinc-200 dark:border-zinc-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">
                        Uploaded Documents ({order.files?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                      {order.files?.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                            <span className="font-medium truncate">{f.fileName}</span>
                            <span className="text-zinc-400">({f.pageCount || 1} pages)</span>
                          </div>
                          <a href={f.fileUrl} download={f.fileName} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                              <Download className="h-3.5 w-3.5" /> View
                            </Button>
                          </a>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Right: Live Chat Window */}
                <div>
                  <ChatWindow orderId={order.id} orderNumber={order.orderNumber} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
