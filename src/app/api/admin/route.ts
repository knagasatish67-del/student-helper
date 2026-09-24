import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function GET() {
  return NextResponse.json({
    shop: memoryDb.settings,
    totalOrders: memoryDb.orders.size,
    totalUsers: memoryDb.getAllUsers().length,
  });
}
