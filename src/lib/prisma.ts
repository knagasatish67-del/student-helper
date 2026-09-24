import { User, Order, ChatMessage, PricingConfig, UploadedFile } from '@/types';
import bcrypt from 'bcryptjs';

// In-Memory Database store that persists within the server process
class MemoryDatabase {
  users: Map<string, User & { passwordHash: string }> = new Map();
  orders: Map<string, Order> = new Map();
  messages: Map<string, ChatMessage[]> = new Map(); // orderId -> messages
  files: Map<string, UploadedFile> = new Map();
  pricing: PricingConfig = {
    // PRD Exact Pricing
    assignmentNormalPrice: 30, // ₹30 per assignment
    assignmentEmergencyPrice: 40, // ₹40 for 24hr / emergency
    manualNormalPerPractical: 25, // ₹25 per practical
    manualEmergencyPerPage: 30, // ₹30 per practical for emergency single night
    manualNormalDiagram: 10, // +₹10 per normal diagram
    manualMedicalDiagram: 50, // +₹50 per medical diagram
    xeroxBwPerPage: 1, // ₹1 per B&W page
    xeroxColorPerPage: 5, // ₹5 per Colour page
    xeroxDeliveryFee: 20, // ₹20 delivery fee
    xeroxSundaySurcharge: 20, // +₹20 Sunday surcharge (ONLY for Xerox)

    // Legacy compatibility defaults
    bwPerPage: 1.0,
    colorPerPage: 5.0,
    doubleSideDiscount: 0,
    stapleBinding: 0,
    spiralBinding: 20,
    hardBinding: 100,
    manualRecordBook: 50,
    assignmentHandwrittenPerSheet: 30,
    deliveryFee: 20,
  };
  settings = {
    shopName: 'Campus Xerox & Student Hub',
    shopEmail: 'support@studenthelper.com',
    shopPhone: '+91 98765 43210',
    shopAddress: 'Beside University Library, Gate No. 2, Campus Center',
    openingHours: 'Mon - Sat: 8:00 AM - 9:00 PM | Sun: 10:00 AM - 4:00 PM',
    acceptingOrders: true,
  };

  getAllUsers(): (User & { passwordHash: string })[] {
    const unique = new Map<string, User & { passwordHash: string }>();
    for (const u of this.users.values()) {
      if (u && u.id) {
        unique.set(u.id, u);
      }
    }
    return Array.from(unique.values());
  }

  private initialized = false;

  constructor() {
    this.initSeed();
  }

  private initSeed() {
    if (this.initialized) return;
    this.initialized = true;

    // Seed default admin
    const adminHash = bcrypt.hashSync('admin123', 10);
    const adminUser: User & { passwordHash: string } = {
      id: 'usr-admin-01',
      name: 'Campus Print Admin',
      email: 'admin@studenthelper.com',
      role: 'ADMIN',
      phone: '+91 98765 43210',
      college: 'University Tech Campus',
      department: 'Admin Services',
      createdAt: new Date().toISOString(),
      passwordHash: adminHash,
    };
    this.users.set(adminUser.id, adminUser);
    this.users.set(adminUser.email, adminUser);

    // Seed default students (both college.edu and university.edu aliases)
    const studentHash = bcrypt.hashSync('student123', 10);
    const studentUser: User & { passwordHash: string } = {
      id: 'usr-student-01',
      name: 'Alex Sharma',
      email: 'student@college.edu',
      role: 'STUDENT',
      phone: '+91 91234 56789',
      college: 'College of Engineering & Technology',
      rollNumber: '21CS108',
      department: 'Computer Science & Engineering',
      semester: '6th Semester',
      createdAt: new Date().toISOString(),
      passwordHash: studentHash,
    };
    this.users.set(studentUser.id, studentUser);
    this.users.set(studentUser.email.toLowerCase(), studentUser);

    const studentUserAlias: User & { passwordHash: string } = {
      ...studentUser,
      id: 'usr-student-02',
      email: 'student@university.edu',
    };
    this.users.set(studentUserAlias.id, studentUserAlias);
    this.users.set(studentUserAlias.email.toLowerCase(), studentUserAlias);

    // Seed initial orders matching PRD specifications
    const initialOrders: Order[] = [
      {
        id: 'ord-1001',
        orderNumber: 'UNI-000124',
        userId: studentUser.id,
        user: studentUser,
        customerName: 'Alex Sharma',
        customerPhone: '+91 91234 56789',
        hostel: 'Hostel 3 (Ganga)',
        roomNumber: 'Room 204',
        deliveryAddress: 'Ganga Block B, 2nd Floor, Room 204',
        deliveryOption: 'HOSTEL',
        agentName: 'Rajesh Kumar',
        agentPhone: '+91 98480 12345',
        serviceType: 'XEROX',
        status: 'OUT_FOR_DELIVERY',
        paymentStatus: 'PAID',
        totalAmount: 50, // 30 BW pages (₹30) + ₹20 delivery
        xeroxConfig: {
          copies: 1,
          totalPages: 30,
          colorMode: 'BW',
          printSides: 'DOUBLE',
          paperSize: 'A4',
          bindingType: 'STAPLE',
          deliveryOption: 'HOSTEL',
          isSunday: false,
          instructions: 'Please staple on top-left neatly.',
        },
        files: [
          {
            id: 'file-101',
            fileName: 'Cloud_Computing_Unit_1_2.pdf',
            fileUrl: '/uploads/sample.pdf',
            fileSize: 2450000,
            fileType: 'application/pdf',
            pageCount: 30,
            uploadedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
        ],
        notes: 'Hand over to roommate if unavailable',
        pickupTime: 'Delivery within 2 hours',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'ord-1002',
        orderNumber: 'UNI-000118',
        userId: studentUser.id,
        user: studentUser,
        customerName: 'Alex Sharma',
        customerPhone: '+91 91234 56789',
        hostel: 'Hostel 3 (Ganga)',
        roomNumber: 'Room 204',
        deliveryAddress: 'Ganga Block B, Room 204',
        deliveryOption: 'HOSTEL',
        agentName: 'Sunil Varma',
        agentPhone: '+91 94401 23456',
        serviceType: 'ASSIGNMENT',
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        totalAmount: 40, // 1 emergency assignment = ₹40 (free hostel delivery)
        assignmentConfig: {
          orderType: 'EMERGENCY',
          quantity: 1,
          subject: 'Artificial Intelligence',
          topic: 'Neural Networks & Deep Learning',
          deadline: 'Tomorrow 10:00 AM',
          pageCount: 12,
          format: 'PRINT',
          bindingType: 'STAPLE',
          instructions: 'Emergency submission needed before 10 AM.',
        },
        files: [
          {
            id: 'file-102',
            fileName: 'AI_Assignment_Alex_21CS108.pdf',
            fileUrl: '/uploads/sample.pdf',
            fileSize: 1800000,
            fileType: 'application/pdf',
            pageCount: 12,
            uploadedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
      {
        id: 'ord-1003',
        orderNumber: 'UNI-000105',
        userId: studentUser.id,
        user: studentUser,
        customerName: 'Alex Sharma',
        customerPhone: '+91 91234 56789',
        hostel: 'Hostel 3 (Ganga)',
        roomNumber: 'Room 204',
        deliveryAddress: 'Ganga Block B, Room 204',
        deliveryOption: 'HOSTEL',
        agentName: 'Rajesh Kumar',
        agentPhone: '+91 98480 12345',
        serviceType: 'MANUAL',
        status: 'ORDER_ACCEPTED',
        paymentStatus: 'PENDING',
        totalAmount: 185, // 5 practicals (₹125) + 3 normal diagrams (₹30) + 0 delivery = ₹155 (or with 1 medical diagram +₹50)
        manualConfig: {
          orderType: 'NORMAL',
          practicalsCount: 5,
          normalDiagramsCount: 1,
          medicalDiagramsCount: 1,
          subject: 'Web Technologies & Cloud Lab',
          department: 'Computer Science',
          semester: '6th Semester',
          labName: 'Lab 4 - Full Stack',
          diagramColor: true,
          bindingType: 'RECORD_BOOK',
          instructions: 'Include title page and department index cleanly.',
        },
        files: [
          {
            id: 'file-103',
            fileName: 'WT_Lab_Manual_Final.pdf',
            fileUrl: '/uploads/sample.pdf',
            fileSize: 4200000,
            fileType: 'application/pdf',
            pageCount: 28,
            uploadedAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ];

    for (const order of initialOrders) {
      this.orders.set(order.id, order);
    }

    // Seed chat messages
    const sampleMsgs: ChatMessage[] = [
      {
        id: 'msg-1',
        orderId: 'ord-1001',
        senderId: studentUser.id,
        senderRole: 'STUDENT',
        senderName: studentUser.name,
        content: 'Hi! Could you please ensure the spiral rings are black color?',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        isRead: true,
      },
      {
        id: 'msg-2',
        orderId: 'ord-1001',
        senderId: adminUser.id,
        senderRole: 'ADMIN',
        senderName: 'Campus Xerox Admin',
        content: 'Sure Alex! We used black spiral rings. Your order is printed and ready at Counter 1.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        isRead: true,
      },
    ];
    this.messages.set('ord-1001', sampleMsgs);
  }
}

// Global singleton across all Next.js route chunks and worker threads
const globalForDb = globalThis as unknown as { __memoryDb?: MemoryDatabase };
if (!globalForDb.__memoryDb) {
  globalForDb.__memoryDb = new MemoryDatabase();
}
export const memoryDb = globalForDb.__memoryDb;

// Prisma compatibility layer
let prisma: any;
try {
  // Attempt to load generated @prisma/client if available
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch {
  // Graceful fallback per migration specifications
  const noOp = {
    findMany: async () => Array.from(memoryDb.orders.values()),
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  };
  prisma = new Proxy({}, { get: () => noOp });
}

export { prisma };
