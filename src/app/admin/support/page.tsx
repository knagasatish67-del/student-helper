'use client';
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/adminlayout';
import { ChatPanel } from '@/components/admin/chatpanel';
import { Order } from '@/types';
import { Headphones } from 'lucide-react';

export default function AdminSupportPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to load inquiries', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const timer = setInterval(loadOrders, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Headphones className="h-6 w-6 text-indigo-600" />
            Live Student Support Desk
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time chat messaging with students about order updates, custom paper requests, or pickup notifications.
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-sm text-zinc-500">Loading support inquiries...</div>
        ) : (
          <ChatPanel orders={orders} />
        )}
      </div>
    </AdminLayout>
  );
}
