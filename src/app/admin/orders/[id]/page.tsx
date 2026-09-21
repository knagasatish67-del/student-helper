'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/adminlayout';
import { OrderDetailCard } from '@/components/admin/orderdetailcard';
import { FileDownload } from '@/components/admin/filedownload';
import { ChatWindow } from '@/components/client/chatwindow';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (data.order) setOrder(data.order);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast({ title: 'Status Updated', description: `Order status set to ${status}` });
        fetchOrder();
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/orders')}
          className="gap-2 text-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Button>

        {loading ? (
          <div className="p-16 text-center text-sm text-zinc-500">Loading order...</div>
        ) : !order ? (
          <div className="p-16 text-center text-zinc-500">Order not found</div>
        ) : (
          <div className="space-y-6">
            <OrderDetailCard order={order} onStatusChange={handleStatusChange} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attached files to print */}
              <FileDownload files={order.files || []} />

              {/* Direct live chat with this student */}
              <ChatWindow orderId={order.id} orderNumber={order.orderNumber} />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
