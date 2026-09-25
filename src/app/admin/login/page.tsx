'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/authprovider';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  UserCheck,
  Info,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Role } from '@/types';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const [roleType, setRoleType] = useState<Role>('ADMIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleRoleSwitch = (type: Role) => {
    setRoleType(type);
    setEmail('');
    setPassword('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter your account email and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password, roleType);
      if (!res.success) {
        toast({
          title: 'Authorization Failed',
          description: res.error || 'Invalid credentials or unauthorized access.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: roleType === 'ADMIN' ? 'Admin Access Authorized' : 'Staff Workstation Ready',
        description: `Welcome! Logged in as ${roleType === 'ADMIN' ? 'System Administrator' : 'Operations Staff'}.`,
      });

      if (roleType === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/admin/orders');
      }
    } catch (err: any) {
      toast({
        title: 'Login Error',
        description: err.message || 'Server error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await loginWithGoogle('ADMIN');
      if (!res.success) {
        toast({
          title: 'Google Sign-In Failed',
          description: res.error || 'Could not authorize administrator with Google.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Admin Authorized via Google',
        description: 'Welcome K.Nagasatish! Administrator privileges activated.',
      });
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast({
        title: 'Sign In Error',
        description: err.message || 'Firebase error',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4 py-10 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-4">
        {/* Back to student site */}
        <div className="flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Student Portal
          </Link>
          <span className="text-[11px] font-semibold text-zinc-400">
            Internal Operations Portal
          </span>
        </div>

        {/* Brand header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-lg">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {roleType === 'ADMIN' ? 'Administrator Login' : 'Staff Operator Login'}
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            {roleType === 'ADMIN'
              ? 'Master administrator access for print management, staff assignments, and store analytics.'
              : 'Sign in with your staff account credentials assigned by the administrator.'}
          </p>
        </div>

        {/* Portal Role Switcher: Administrator vs Staff */}
        <div className="flex rounded-xl bg-zinc-200/80 p-1 dark:bg-zinc-800/80 border border-zinc-300/60 dark:border-zinc-700/60 shadow-inner">
          <button
            type="button"
            onClick={() => handleRoleSwitch('ADMIN')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              roleType === 'ADMIN'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Shield className="h-3.5 w-3.5" /> Administrator
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('STAFF')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              roleType === 'STAFF'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" /> Staff Operator
          </button>
        </div>

        <Card className="border-zinc-200/90 dark:border-zinc-800 shadow-md bg-white dark:bg-zinc-900">
          <CardContent className="space-y-4 pt-6">
            {/* GOOGLE SIGN-IN FOR MASTER ADMIN */}
            {roleType === 'ADMIN' && (
              <>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleAdminLogin}
                    disabled={isGoogleLoading}
                    className="w-full h-10 border-zinc-300 dark:border-zinc-700 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-xs font-medium gap-2 shadow-xs"
                  >
                    {isGoogleLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-white" />
                        Authorizing Google...
                      </span>
                    ) : (
                      <>
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Sign In with Admin Google Account</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] font-medium text-zinc-400">
                    Or sign in with master email & password
                  </span>
                </div>
              </>
            )}

            {/* Note for Staff */}
            {roleType === 'STAFF' && (
              <div className="rounded-lg bg-zinc-50 border border-zinc-200/80 p-3 text-[11px] text-zinc-600 dark:bg-zinc-800/50 dark:border-zinc-700/60 dark:text-zinc-300 flex items-start gap-2">
                <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  Staff accounts (Xerox operators, delivery couriers) are created and assigned by the Administrator in the <strong>Admin Dashboard &rarr; Staff Team</strong>.
                </p>
              </div>
            )}

            {/* SIGN IN FORM */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  {roleType === 'ADMIN' ? 'Master Admin Email' : 'Staff Account Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs"
                    placeholder={roleType === 'ADMIN' ? 'Knagasatish@gmail.com' : 'staff.email@campus.edu'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  {roleType === 'ADMIN' ? 'Master Admin Password' : 'Staff Passcode'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9 text-xs font-mono"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gap-2 text-xs font-semibold h-10 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {isLoading ? 'Authorizing...' : `Sign In as ${roleType === 'ADMIN' ? 'Administrator' : 'Staff Operator'}`}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
