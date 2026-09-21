import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderid: string }> }
) {
  const { orderid } = await params;
  const msgs = memoryDb.messages.get(orderid);
  if (msgs) {
    msgs.forEach((m) => (m.isRead = true));
  }
  return NextResponse.json({ success: true });
}
