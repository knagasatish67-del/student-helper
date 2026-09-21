import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';
import { OrderStatus } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = memoryDb.orders.get(id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, agentName, agentPhone, notes } = body;

    const order = memoryDb.orders.get(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (status) order.status = status as OrderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (agentName !== undefined) order.agentName = agentName;
    if (agentPhone !== undefined) order.agentPhone = agentPhone;
    if (notes !== undefined) order.notes = notes;
    order.updatedAt = new Date().toISOString();

    // Add status notification message to chat automatically
    const statusMsg = {
      id: `msg-${Date.now()}`,
      orderId: order.id,
      senderId: 'usr-admin-01',
      senderRole: 'ADMIN' as const,
      senderName: 'Print Shop System',
      content: agentName
        ? `Service Agent assigned: ${agentName} (${agentPhone || 'No phone'}). Status: ${order.status.replace(/_/g, ' ')}`
        : `Status updated to: ${order.status.replace(/_/g, ' ')}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    const curMsgs = memoryDb.messages.get(order.id) || [];
    curMsgs.push(statusMsg);
    memoryDb.messages.set(order.id, curMsgs);

    memoryDb.orders.set(id, order);

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
