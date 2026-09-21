import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const file = memoryDb.files.get(id);
  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
  return NextResponse.json({ file });
}
