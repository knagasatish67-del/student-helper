import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function GET() {
  const orders = Array.from(memoryDb.orders.values());

  const serviceBreakdown = {
    XEROX: orders.filter((o) => o.serviceType === 'XEROX').length,
    ASSIGNMENT: orders.filter((o) => o.serviceType === 'ASSIGNMENT').length,
    MANUAL: orders.filter((o) => o.serviceType === 'MANUAL').length,
  };

  const revenueByService = {
    XEROX: orders
      .filter((o) => o.serviceType === 'XEROX')
      .reduce((sum, o) => sum + o.totalAmount, 0),
    ASSIGNMENT: orders
      .filter((o) => o.serviceType === 'ASSIGNMENT')
      .reduce((sum, o) => sum + o.totalAmount, 0),
    MANUAL: orders
      .filter((o) => o.serviceType === 'MANUAL')
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return NextResponse.json({
    totalOrders: orders.length,
    totalRevenue,
    serviceBreakdown,
    revenueByService,
    recentCompleted: orders.filter((o) => o.status === 'COMPLETED').slice(0, 10),
  });
}
