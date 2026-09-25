import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';
import { signToken, comparePassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const userRecord = memoryDb.users.get(email.toLowerCase().trim());
    if (!userRecord || userRecord.role !== 'STAFF') {
      return NextResponse.json(
        { error: 'Staff account not found or access unauthorized' },
        { status: 401 }
      );
    }

    if (userRecord.isActive === false) {
      return NextResponse.json(
        { error: 'This staff account has been deactivated. Please contact campus admin.' },
        { status: 403 }
      );
    }

    const isValid = await comparePassword(password, userRecord.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid staff credentials' }, { status: 401 });
    }

    const token = signToken({
      userId: userRecord.id,
      email: userRecord.email,
      role: 'STAFF',
      staffRole: userRecord.staffRole,
      name: userRecord.name,
    });

    const safeUser = { ...userRecord };
    delete (safeUser as any).passwordHash;
    return NextResponse.json({ user: safeUser, token });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
