'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';
import { signInWithGoogle, auth, onAuthStateChanged, fetchOrCreateUserProfile, logOut as fbSignOut } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (targetRole?: Role) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from saved session without any fake demo fallback
  useEffect(() => {
    const savedToken = localStorage.getItem('sh_token');
    const savedUser = localStorage.getItem('sh_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('sh_token');
        localStorage.removeItem('sh_user');
        localStorage.removeItem('sh_role');
        setUser(null);
        setToken(null);
      }
    } else {
      // Completely clean: No dummy/demo user loaded
      setUser(null);
      setToken(null);
    }
    setIsLoading(false);

    // Listen to Firebase Auth state in background
    try {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const currentRole = (localStorage.getItem('sh_role') as Role) || 'STUDENT';
            const profile = await fetchOrCreateUserProfile(fbUser, { role: currentRole });
            setUser(profile);
            localStorage.setItem('sh_user', JSON.stringify(profile));
            localStorage.setItem('sh_role', profile.role);
          } catch (e) {
            console.warn('Firebase profile sync error:', e);
          }
        }
      });
      return () => unsubscribe();
    } catch {
      // Firebase auth listener non-blocking fallback
    }
  }, []);

  // Google Sign-In with Firebase Auth
  const loginWithGoogle = async (targetRole: Role = 'STUDENT') => {
    try {
      setIsLoading(true);
      const { user: fbProfile, fbUser } = await signInWithGoogle();
      const userToken = await fbUser.getIdToken();

      const adjustedProfile = {
        ...fbProfile,
        role: targetRole,
      };

      setUser(adjustedProfile);
      setToken(userToken);
      localStorage.setItem('sh_token', userToken);
      localStorage.setItem('sh_user', JSON.stringify(adjustedProfile));
      localStorage.setItem('sh_role', targetRole);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Google sign-in failed' };
    }
  };

  // Login for Student, Staff, or Admin
  const login = async (email: string, password: string, role: Role = 'STUDENT') => {
    try {
      let endpoint = '/api/auth';
      if (role === 'ADMIN') {
        endpoint = '/api/auth/admin-login';
      } else if (role === 'STAFF') {
        endpoint = '/api/auth/staff-login';
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, action: 'login' }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('sh_token', data.token);
      localStorage.setItem('sh_user', JSON.stringify(data.user));
      localStorage.setItem('sh_role', data.user.role);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  // Register is available for Students (Users)
  const register = async (userData: Partial<User> & { password: string }) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, role: 'STUDENT', action: 'register' }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('sh_token', data.token);
      localStorage.setItem('sh_user', JSON.stringify(data.user));
      localStorage.setItem('sh_role', 'STUDENT');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fbSignOut();
    } catch {
      // safe fallback
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('sh_token');
    localStorage.removeItem('sh_user');
    localStorage.removeItem('sh_role');
  };

  const value = React.useMemo(
    () => ({ user, token, isLoading, login, loginWithGoogle, register, logout, setUser }),
    [user, token, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
