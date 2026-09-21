import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';
import { UploadedFile } from '@/types';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const orderId = formData.get('orderId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const uploadedFile: UploadedFile = {
      id: fileId,
      orderId: orderId || undefined,
      fileName: file.name,
      fileUrl: `/uploads/${file.name}`,
      fileSize: file.size,
      fileType: file.type || 'application/pdf',
      pageCount: Math.max(1, Math.round(file.size / 150000)) || 10,
      uploadedAt: new Date().toISOString(),
    };

    memoryDb.files.set(fileId, uploadedFile);

    return NextResponse.json({ success: true, file: uploadedFile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
