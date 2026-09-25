export type Role = 'STUDENT' | 'STAFF' | 'ADMIN';
export type StaffRole = 'OPERATOR' | 'DELIVERY' | 'COORDINATOR' | 'MANAGER';

export type ServiceType = 'XEROX' | 'ASSIGNMENT' | 'MANUAL';

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'ORDER_ACCEPTED'
  | 'PROCESSING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'AVAILABLE_FOR_PICKUP'
  | 'COMPLETED'
  | 'CANCELLED'
  // Legacy aliases
  | 'PENDING'
  | 'CONFIRMED'
  | 'PRINTING'
  | 'READY_FOR_PICKUP';

export type PaymentStatus = 'PENDING' | 'PAID';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  staffRole?: StaffRole;
  assignedServices?: ServiceType[];
  isActive?: boolean;
  phone?: string;
  college?: string;
  rollNumber?: string;
  department?: string;
  semester?: string;
  hostel?: string;
  roomNumber?: string;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  orderId?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  pageCount?: number;
  uploadedAt: string;
}

export interface XeroxConfig {
  copies: number;
  colorMode: 'BW' | 'COLOR';
  totalPages?: number;
  pageRange?: string;
  printSides?: 'SINGLE' | 'DOUBLE';
  paperSize?: 'A4' | 'A3';
  bindingType?: 'NONE' | 'STAPLE' | 'SPIRAL' | 'HARD';
  deliveryOption?: 'HOSTEL' | 'PICKUP';
  isSunday?: boolean;
  instructions?: string;
}

export interface AssignmentConfig {
  orderType: 'NORMAL' | 'EMERGENCY';
  quantity: number; // Number of assignments
  subject: string;
  topic?: string;
  deadline?: string;
  pageCount?: number;
  format?: 'PRINT' | 'HANDWRITTEN';
  bindingType?: 'NONE' | 'STAPLE' | 'SPIRAL' | 'HARD';
  instructions?: string;
}

export interface ManualConfig {
  orderType: 'NORMAL' | 'EMERGENCY';
  practicalsCount: number; // for normal: ₹25 * practicals, for emergency: ₹30 * practicals
  pagesCount?: number;
  normalDiagramsCount: number; // +₹10 each
  medicalDiagramsCount: number; // +₹50 each
  subject: string;
  department?: string;
  semester?: string;
  labName?: string;
  diagramColor?: boolean;
  bindingType?: 'SPIRAL' | 'HARD' | 'RECORD_BOOK';
  instructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. UNI-000124
  userId: string;
  user?: User;
  serviceType: ServiceType;
  status: OrderStatus;
  paymentStatus: PaymentStatus; // Direct/Offline only
  totalAmount: number;
  
  // Customer & Delivery Information
  customerName: string;
  customerPhone: string;
  hostel: string;
  roomNumber: string;
  deliveryAddress?: string;
  deliveryOption: 'HOSTEL' | 'PICKUP';
  isSunday?: boolean;

  // Assigned Agent (Reached customer)
  agentName?: string;
  agentPhone?: string;

  xeroxConfig?: XeroxConfig;
  assignmentConfig?: AssignmentConfig;
  manualConfig?: ManualConfig;
  files: UploadedFile[];
  notes?: string;
  pickupTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderRole: Role;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface PricingConfig {
  // Assignment
  assignmentNormalPrice: number; // ₹30 / assignment
  assignmentEmergencyPrice: number; // ₹40 / assignment

  // Manual / Record
  manualNormalPerPractical: number; // ₹25 / practical
  manualEmergencyPerPage: number; // ₹30 / practical (single night emergency)
  manualNormalDiagram: number; // ₹10
  manualMedicalDiagram: number; // ₹50

  // Xerox
  xeroxBwPerPage: number; // ₹1 / page
  xeroxColorPerPage: number; // ₹5 / page
  xeroxDeliveryFee: number; // ₹20
  xeroxSundaySurcharge: number; // ₹20 (ONLY on Xerox)

  // Legacy fallback fields for compatibility
  bwPerPage?: number;
  colorPerPage?: number;
  doubleSideDiscount?: number;
  stapleBinding?: number;
  spiralBinding?: number;
  hardBinding?: number;
  manualRecordBook?: number;
  assignmentHandwrittenPerSheet?: number;
  deliveryFee?: number;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  activeToday: number;
}
