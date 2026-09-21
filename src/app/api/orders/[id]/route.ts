import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = memoryDb.orders.get(id);

    if (!order) {
      // Check by orderNumber as well
      const match = Array.from(memoryDb.orders.values()).find(
        (o) => o.orderNumber.toLowerCase() === id.toLowerCase()
      );
      if (match) {
        return NextResponse.json({ order: match });
      }
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
