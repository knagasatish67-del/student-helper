import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import firebaseConfigData from './firebase-config.json';
import { User, Order, StaffRole, Role } from '@/types';

// Client Firebase config from provisioned JSON or environment variables for Vercel
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfigData.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfigData.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfigData.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfigData.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigData.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfigData.appId,
};

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || firebaseConfigData.firestoreDatabaseId;
const db: Firestore = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Test connection on boot per Firebase guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline, fallback caching active.');
    }
    return false;
  }
}

// Map Firebase User to our app's User type
export async function fetchOrCreateUserProfile(
  fbUser: FirebaseUser,
  additionalData?: Partial<User>
): Promise<User> {
  const isOwner = fbUser.email === 'knagasatish@gmail.com' || fbUser.email === 'knagasatish67@gmail.com';
  const assignedRole: Role = isOwner
    ? 'ADMIN'
    : (additionalData?.role || 'STUDENT');

  try {
    const userDocRef = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data() as User;
      // Upgrade to ADMIN if owner
      if (isOwner && data.role !== 'ADMIN') {
        data.role = 'ADMIN';
        await setDoc(userDocRef, { role: 'ADMIN' }, { merge: true });
        await setDoc(doc(db, 'admins', fbUser.uid), {
          uid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || 'Administrator',
          createdAt: new Date().toISOString(),
        }, { merge: true });
      }
      return data;
    }

    const newUser: User = {
      id: fbUser.uid,
      name: fbUser.displayName || additionalData?.name || fbUser.email?.split('@')[0] || (assignedRole === 'ADMIN' ? 'Administrator' : 'Student'),
      email: fbUser.email || '',
      role: assignedRole,
      phone: additionalData?.phone || fbUser.phoneNumber || '',
      college: additionalData?.college || (assignedRole === 'ADMIN' ? 'Campus Admin Center' : 'Campus University'),
      rollNumber: additionalData?.rollNumber || '',
      department: additionalData?.department || '',
      semester: additionalData?.semester || '',
      hostel: additionalData?.hostel || '',
      roomNumber: additionalData?.roomNumber || '',
      createdAt: new Date().toISOString(),
    };

    await setDoc(userDocRef, newUser, { merge: true });

    if (assignedRole === 'ADMIN') {
      try {
        await setDoc(doc(db, 'admins', fbUser.uid), {
          uid: fbUser.uid,
          email: fbUser.email,
          name: newUser.name,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      } catch {
        // Non-blocking admin whitelist sync
      }
    }

    return newUser;
  } catch (err: any) {
    console.warn('Firebase profile sync notice (using session profile):', err?.message || err);
    return {
      id: fbUser.uid,
      name: fbUser.displayName || additionalData?.name || (assignedRole === 'ADMIN' ? 'Administrator' : 'Student User'),
      email: fbUser.email || '',
      role: assignedRole,
      createdAt: new Date().toISOString(),
    };
  }
}

// Google Sign-In for Users & Admins
export async function signInWithGoogle(desiredRole: Role = 'STUDENT'): Promise<{ user: User; fbUser: FirebaseUser }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const profile = await fetchOrCreateUserProfile(result.user, { role: desiredRole });
    return { user: profile, fbUser: result.user };
  } catch (err: any) {
    console.error('Google Sign-in failed:', err);
    throw new Error(err.message || 'Failed to sign in with Google');
  }
}

// Email/Password Sign-Up (ONLY for Users/Students)
export async function signUpStudentWithEmail(params: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  college?: string;
  rollNumber?: string;
  department?: string;
  semester?: string;
}): Promise<{ user: User; fbUser: FirebaseUser }> {
  try {
    const result = await createUserWithEmailAndPassword(auth, params.email, params.password);
    if (result.user) {
      await updateProfile(result.user, { displayName: params.name });
    }

    const studentProfile: User = {
      id: result.user.uid,
      name: params.name,
      email: params.email,
      role: 'STUDENT',
      phone: params.phone || '',
      college: params.college || 'Campus University',
      rollNumber: params.rollNumber || '',
      department: params.department || '',
      semester: params.semester || '',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', result.user.uid), studentProfile);
    return { user: studentProfile, fbUser: result.user };
  } catch (err: any) {
    console.error('Student signup failed:', err);
    throw new Error(err.message || 'Failed to create student account');
  }
}

// Email/Password Sign-In (For Students, Staff, and Admins)
export async function signInWithEmail(email: string, password: string): Promise<{ user: User; fbUser: FirebaseUser }> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const profile = await fetchOrCreateUserProfile(result.user);
    return { user: profile, fbUser: result.user };
  } catch (err: any) {
    console.error('Email signin failed:', err);
    throw new Error(err.message || 'Invalid email or password');
  }
}

// Sign Out
export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Persist Order to Firestore
export async function persistOrderToFirestore(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, 'orders', order.id), order, { merge: true });
  } catch (err) {
    console.error('Failed to persist order to Firestore:', err);
  }
}

// Real-time listener for student orders
export function subscribeToStudentOrders(userId: string, onUpdate: (orders: Order[]) => void) {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((d) => d.data() as Order);
        // Sort newest first
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(orders);
      },
      (err) => {
        console.warn('Orders real-time subscription error, using cached data:', err);
      }
    );
  } catch (err) {
    console.warn('Could not setup orders snapshot:', err);
    return () => {};
  }
}

// Real-time listener for Admin/Staff orders
export function subscribeToAllOrders(onUpdate: (orders: Order[]) => void) {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((d) => d.data() as Order);
        onUpdate(orders);
      },
      (err) => {
        console.warn('All-orders snapshot error, using cached data:', err);
      }
    );
  } catch (err) {
    console.warn('Could not setup all-orders snapshot:', err);
    return () => {};
  }
}

// Update Order status in Firestore
export async function updateOrderStatusFirestore(
  orderId: string,
  status: Order['status'],
  paymentStatus?: Order['paymentStatus'],
  agentDetails?: { name?: string; phone?: string }
): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updates: any = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
    }
    if (agentDetails?.name) {
      updates.agentName = agentDetails.name;
    }
    if (agentDetails?.phone) {
      updates.agentPhone = agentDetails.phone;
    }
    await updateDoc(orderRef, updates);
  } catch (err) {
    console.error('Error updating order status in Firestore:', err);
  }
}

// Add Staff Member (Admin Only)
export async function createStaffMemberInFirestore(params: {
  name: string;
  email: string;
  phone: string;
  staffRole: StaffRole;
  notes?: string;
}): Promise<User> {
  const staffId = `staff-${Date.now()}`;
  const staffUser: User = {
    id: staffId,
    name: params.name,
    email: params.email.toLowerCase(),
    role: 'STAFF',
    staffRole: params.staffRole,
    phone: params.phone,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'users', staffId), staffUser);
  } catch (err) {
    console.error('Could not save staff to Firestore directly:', err);
  }

  return staffUser;
}

// Fetch all staff members
export async function fetchStaffMembersFromFirestore(): Promise<User[]> {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'STAFF'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data() as User);
  } catch (err) {
    console.error('Could not fetch staff from Firestore:', err);
    return [];
  }
}

export { app, auth, db, googleProvider, onAuthStateChanged };
