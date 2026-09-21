import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';
import { ChatMessage } from '@/types';
import { socketEmitter } from '@/lib/socket';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderid: string }> }
) {
  const { orderid } = await params;
  const messages = memoryDb.messages.get(orderid) || [];
  return NextResponse.json({ messages });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderid: string }> }
) {
  try {
    const { orderid } = await params;
    const { content, senderName, senderRole } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is empty' }, { status: 400 });
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      orderId: orderid,
      senderId: senderRole === 'ADMIN' ? 'usr-admin-01' : 'usr-student-01',
      senderRole: senderRole || 'STUDENT',
      senderName: senderName || (senderRole === 'ADMIN' ? 'Print Shop Admin' : 'Student'),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    const current = memoryDb.messages.get(orderid) || [];
    current.push(newMsg);
    memoryDb.messages.set(orderid, current);

    socketEmitter.emit(`chat:${orderid}`, newMsg);

    return NextResponse.json({ success: true, message: newMsg });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
