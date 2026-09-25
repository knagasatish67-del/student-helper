import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { User, StaffRole } from '@/types';
import { createStaffMemberInFirestore } from '@/lib/firebase';

export async function GET() {
  const staff = memoryDb.getStaffUsers().map((u) => {
    const copy = { ...u };
    delete (copy as any).passwordHash;
    return copy;
  });

  return NextResponse.json({ staff });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, staffRole, department } = body;

    if (!name || !email || !password || !staffRole) {
      return NextResponse.json(
        { error: 'Name, email, password, and staff role are required' },
        { status: 400 }
      );
    }

    const emailKey = email.toLowerCase().trim();
    if (memoryDb.users.has(emailKey)) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const staffId = `usr-staff-${Date.now()}`;

    const newStaffUser: User & { passwordHash: string } = {
      id: staffId,
      name,
      email: emailKey,
      role: 'STAFF',
      staffRole: staffRole as StaffRole,
      phone: phone || '',
      college: 'Campus Center',
      department: department || 'Operations',
      isActive: true,
      createdAt: new Date().toISOString(),
      passwordHash,
    };

    memoryDb.addStaffUser(newStaffUser);

    // Also persist in Firestore if connected
    try {
      await createStaffMemberInFirestore({
        name,
        email: emailKey,
        phone: phone || '',
        staffRole: staffRole as StaffRole,
      });
    } catch (fsErr) {
      console.warn('Firestore staff save non-critical warning:', fsErr);
    }

    const safeStaff = { ...newStaffUser };
    delete (safeStaff as any).passwordHash;

    return NextResponse.json({ success: true, staff: safeStaff });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
