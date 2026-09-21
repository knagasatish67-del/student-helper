import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function GET() {
  try {
    const customers = Array.from(memoryDb.users.values())
      .filter((u) => u.role === 'STUDENT')
      .map(({ passwordHash, ...safeUser }) => safeUser);

    return NextResponse.json({ customers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
