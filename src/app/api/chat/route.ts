import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function GET() {
  // Returns all recent chats across orders
  const allMessages: any[] = [];
  memoryDb.messages.forEach((msgs, orderId) => {
    allMessages.push({ orderId, messages: msgs });
  });
  return NextResponse.json({ chats: allMessages });
}
