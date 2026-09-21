import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/prisma';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { Order } from '@/types';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    let userId: string | null = null;

    if (token) {
      const payload = verifyToken(token);
      if (payload) userId = payload.userId;
    }

    const allOrders = Array.from(memoryDb.orders.values());
    // If authenticated as student, filter by their userId, else return all or recent
    const orders = userId
      ? allOrders.filter((o) => o.userId === userId)
      : allOrders;

    // Sort by createdAt desc
    orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceType,
      totalAmount,
      xeroxConfig,
      assignmentConfig,
      manualConfig,
      files,
      notes,
      pickupTime,
      customerName,
      customerPhone,
      hostel,
      roomNumber,
      deliveryAddress,
      deliveryOption,
      isSunday,
    } = body;

    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    let userId = 'usr-student-01'; // Default student
    let user = memoryDb.users.get(userId);

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
        user = memoryDb.users.get(userId);
      }
    }

    const orderCount = memoryDb.orders.size + 125;
    const orderNumber = `UNI-${orderCount.toString().padStart(6, '0')}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId,
      user: user ? {
        id: user.id,
        name: customerName || user.name,
        email: user.email,
        role: user.role,
        phone: customerPhone || user.phone,
        college: user.college,
        rollNumber: user.rollNumber,
        department: user.department,
        semester: user.semester,
        hostel: hostel || user.hostel,
        roomNumber: roomNumber || user.roomNumber,
        createdAt: user.createdAt,
      } : undefined,
      customerName: customerName || user?.name || 'Walk-in Student',
      customerPhone: customerPhone || user?.phone || '',
      hostel: hostel || user?.hostel || 'Hostel 3 (Ganga)',
      roomNumber: roomNumber || user?.roomNumber || 'Room 204',
      deliveryAddress: deliveryAddress || '',
      deliveryOption: deliveryOption || 'HOSTEL',
      isSunday: isSunday ?? (new Date().getDay() === 0),
      serviceType,
      status: 'ORDER_PLACED',
      paymentStatus: 'PENDING',
      totalAmount: totalAmount || 30,
      xeroxConfig,
      assignmentConfig,
      manualConfig,
      files: files || [],
      notes,
      pickupTime: pickupTime || 'Today during shop hours',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryDb.orders.set(newOrder.id, newOrder);

    // Initial greeting chat message
    const welcomeMsg = {
      id: `msg-${Date.now()}`,
      orderId: newOrder.id,
      senderId: 'usr-admin-01',
      senderRole: 'ADMIN' as const,
      senderName: 'Campus Service Coordinator',
      content: `Hello ${newOrder.customerName}! Your order ${newOrder.orderNumber} for ${serviceType.toLowerCase()} has been accepted. Our service agent will deliver to ${newOrder.hostel}, ${newOrder.roomNumber}. Direct payment of ₹${newOrder.totalAmount.toFixed(2)} can be paid upon handover.`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    memoryDb.messages.set(newOrder.id, [welcomeMsg]);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
