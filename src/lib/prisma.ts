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

  getStaffUsers(): (User & { passwordHash: string })[] {
    return this.getAllUsers().filter((u) => u.role === 'STAFF');
  }

  getAdminUsers(): (User & { passwordHash: string })[] {
    return this.getAllUsers().filter((u) => u.role === 'ADMIN');
  }

  hasAdminUser(): boolean {
    return this.getAdminUsers().length > 0;
  }

  addAdminUser(admin: User & { passwordHash: string }) {
    this.users.set(admin.id, admin);
    this.users.set(admin.email.toLowerCase(), admin);
  }

  addStaffUser(staff: User & { passwordHash: string }) {
    this.users.set(staff.id, staff);
    this.users.set(staff.email.toLowerCase(), staff);
  }

  private initialized = false;

  constructor() {
    this.initSeed();
  }

  private initSeed() {
    if (this.initialized) return;
    this.initialized = true;

    // Master Administrator Account (K.Nagasatish)
    const masterAdminHash = bcrypt.hashSync('Nayana67$', 10);
    const masterAdmin: User & { passwordHash: string } = {
      id: 'usr-admin-master',
      name: 'K.Nagasatish',
      email: 'knagasatish@gmail.com',
      role: 'ADMIN',
      phone: '7330798667',
      college: 'Campus Administration',
      department: 'Central Print Operations',
      createdAt: new Date().toISOString(),
      passwordHash: masterAdminHash,
    };
    this.users.set(masterAdmin.id, masterAdmin);
    this.users.set(masterAdmin.email.toLowerCase(), masterAdmin);

    // Support both knagasatish@gmail.com and knagasatish67@gmail.com
    const masterAdminAlias: User & { passwordHash: string } = {
      ...masterAdmin,
      id: 'usr-admin-master-alias',
      email: 'knagasatish67@gmail.com',
    };
    this.users.set(masterAdminAlias.id, masterAdminAlias);
    this.users.set(masterAdminAlias.email.toLowerCase(), masterAdminAlias);

    // Real Master Pricing Matrix (₹1/BW page, ₹5/Color, ₹25 assignment, ₹25 practical)
    this.pricing = {
      assignmentNormalPrice: 25,
      assignmentEmergencyPrice: 40,
      manualNormalPerPractical: 25,
      manualEmergencyPerPage: 10,
      manualNormalDiagram: 10,
      manualMedicalDiagram: 50,
      xeroxBwPerPage: 1,
      xeroxColorPerPage: 5,
      xeroxDeliveryFee: 20,
      xeroxSundaySurcharge: 20,
    };
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
