'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved token or session
    const savedToken = localStorage.getItem('sh_token');
    const savedUser = localStorage.getItem('sh_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('sh_token');
        localStorage.removeItem('sh_user');
      }
    } else {
      // Default to guest or demo student
      const defaultStudent: User = {
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
      };
      setUser(defaultStudent);
      setToken('demo-token-student');
      localStorage.setItem('sh_token', 'demo-token-student');
      localStorage.setItem('sh_user', JSON.stringify(defaultStudent));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: Role = 'STUDENT') => {
    try {
      const endpoint = role === 'ADMIN' ? '/api/auth/admin-login' : '/api/auth';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'login' }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('sh_token', data.token);
      localStorage.setItem('sh_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, action: 'register' }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('sh_token', data.token);
      localStorage.setItem('sh_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sh_token');
    localStorage.removeItem('sh_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, setUser }}>
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
