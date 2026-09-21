import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';
import { signToken, comparePassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const userRecord = memoryDb.users.get(email.toLowerCase());
    if (!userRecord || userRecord.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin account not found or access denied' }, { status: 401 });
    }

    const isValid = await comparePassword(password, userRecord.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = signToken({
      userId: userRecord.id,
      email: userRecord.email,
      role: 'ADMIN',
      name: userRecord.name,
    });

    const { passwordHash: _, ...safeUser } = userRecord;
    return NextResponse.json({ user: safeUser, token });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
