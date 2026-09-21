import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function GET() {
  return NextResponse.json({ settings: memoryDb.settings });
}

export async function POST(request: Request) {
  try {
    const updated = await request.json();
    memoryDb.settings = { ...memoryDb.settings, ...updated };
    return NextResponse.json({ success: true, settings: memoryDb.settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
