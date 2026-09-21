import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';
import { AdminStats } from '@/types';

export async function GET() {
  const orders = Array.from(memoryDb.orders.values());
  const users = Array.from(memoryDb.users.values()).filter((u) => u.role === 'STUDENT');

  const pending = orders.filter(
    (o) =>
      o.status === 'ORDER_PLACED' ||
      o.status === 'ORDER_ACCEPTED' ||
      o.status === 'PROCESSING' ||
      o.status === 'PENDING' ||
      o.status === 'CONFIRMED' ||
      o.status === 'PRINTING' ||
      o.status === 'OUT_FOR_DELIVERY' ||
      o.status === 'READY_FOR_PICKUP' ||
      o.status === 'AVAILABLE_FOR_PICKUP' ||
      o.status === 'READY'
  ).length;
  const completed = orders.filter((o) => o.status === 'COMPLETED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const stats: AdminStats = {
    totalOrders: orders.length,
    pendingOrders: pending,
    completedOrders: completed,
    totalRevenue,
    totalCustomers: users.length,
    activeToday: Math.min(orders.length, 12),
  };

  return NextResponse.json({ stats });
}
