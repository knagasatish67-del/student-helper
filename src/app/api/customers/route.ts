import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function GET() {
  try {
    const customers = memoryDb
      .getAllUsers()
      .filter((u) => u.role === 'STUDENT')
      .map((u) => {
        const copy = { ...u };
        delete (copy as any).passwordHash;
        return copy;
      });

    return NextResponse.json({ customers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
