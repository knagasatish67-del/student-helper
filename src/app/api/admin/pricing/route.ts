import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function GET() {
  return NextResponse.json({ pricing: memoryDb.pricing });
}

export async function POST(request: Request) {
  try {
    const newPricing = await request.json();
    memoryDb.pricing = { ...memoryDb.pricing, ...newPricing };
    return NextResponse.json({ success: true, pricing: memoryDb.pricing });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
