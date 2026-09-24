import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';
import { signToken, comparePassword, hashPassword, extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { User } from '@/types';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const userRecord = memoryDb.users.get(payload.userId);
  if (!userRecord) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const safeUser = { ...userRecord };
  delete (safeUser as any).passwordHash;
  return NextResponse.json({ user: safeUser });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone, college, rollNumber, department, semester } = body;

    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Name, email, and password required' }, { status: 400 });
      }

      if (memoryDb.users.has(email.toLowerCase())) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }

      const pHash = await hashPassword(password);
      const newUser: User & { passwordHash: string } = {
        id: `usr-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: 'STUDENT',
        phone: phone || '',
        college: college || 'Campus College',
        rollNumber: rollNumber || '',
        department: department || '',
        semester: semester || '',
        createdAt: new Date().toISOString(),
        passwordHash: pHash,
      };

      memoryDb.users.set(newUser.id, newUser);
      memoryDb.users.set(newUser.email, newUser);

      const token = signToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      });

      const registeredUser = { ...newUser };
      delete (registeredUser as any).passwordHash;
      return NextResponse.json({ user: registeredUser, token });
    }

    // Default: login
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const userRecord = memoryDb.users.get(email.toLowerCase());
    if (!userRecord) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await comparePassword(password, userRecord.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({
      userId: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
      name: userRecord.name,
    });

    const loggedInUser = { ...userRecord };
    delete (loggedInUser as any).passwordHash;
    return NextResponse.json({ user: loggedInUser, token });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Auth server error' }, { status: 500 });
  }
}
