import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function GET() {
  const students = Array.from(memoryDb.users.values())
    .filter((u) => u.role === 'STUDENT')
    .map(({ passwordHash, ...user }) => user);

  return NextResponse.json({ customers: students });
}
