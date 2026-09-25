'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/authprovider';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  Printer,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Clock,
  Truck,
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, loginWithGoogle } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Sign In fields (No demo credentials)
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up fields (Only for Users / Students)
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    college: 'Campus Engineering College',
    rollNumber: '',
    department: 'Computer Science',
    semester: '6th Semester',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(signInEmail, signInPassword, 'STUDENT');
      if (!res.success) {
        toast({
          title: 'Sign In Failed',
          description: res.error || 'Invalid student credentials. Please check your email and password.',
          variant: 'destructive',
        });
        return;
      }
      toast({ title: 'Welcome back!', description: 'Logged into your student portal.' });
      router.push('/dashboard');
    } catch (err: any) {
      toast({
        title: 'Sign In Failed',
        description: err.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      toast({
        title: 'Incomplete Form',
        description: 'Please provide your full name, student email, and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(signUpData);
      if (!res.success) {
        toast({
          title: 'Sign Up Failed',
          description: res.error || 'Could not register student account. Please verify details.',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Account Created!',
        description: 'Welcome to Student Helper. Your campus profile has been initialized.',
      });
      router.push('/dashboard');
    } catch (err: any) {
      toast({
        title: 'Registration Error',
        description: err.message || 'Error creating account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        toast({
          title: 'Google Sign-In',
          description: res.error || 'Could not sign in with Google.',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Signed in with Google!',
        description: 'Welcome to Student Helper. Profile synced via Firebase Auth.',
      });
      router.push('/dashboard');
    } catch (err: any) {
      toast({
        title: 'Google Sign-In Error',
        description: err.message || 'Firebase Auth error',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand logo & title */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Printer className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Student<span className="text-indigo-600 dark:text-indigo-400">Helper</span>
            </span>
          </Link>
          <div className="mt-2.5 flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-[11px] font-medium bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 gap-1 py-0.5">
              <Sparkles className="h-3 w-3" /> Firebase Auth & Firestore Active
            </Badge>
          </div>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {activeTab === 'signin' ? 'Welcome back to Campus Hub' : 'Create your Student Account'}
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {activeTab === 'signin'
              ? 'Sign in to place prints, emergency assignments, or track deliveries.'
              : 'Sign up to order xerox copies, practical manuals, and fast hostel delivery.'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Users can Sign In or Sign Up) */}
        <div className="mt-6 flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === 'signin'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Student Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === 'signup'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            New Student Sign Up
          </button>
        </div>

        {/* Main Card */}
        <Card className="mt-4 border-zinc-200/80 dark:border-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/90 overflow-hidden">
          <CardContent className="p-6 space-y-5">
            {/* Google Sign-In with Firebase Auth */}
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full h-11 border-zinc-300 dark:border-zinc-700 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-xs font-medium gap-3 shadow-xs"
              >
                {isGoogleLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    Connecting to Google...
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
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-zinc-400 mt-1.5">
                Fast & secure authentication using Firebase Auth
              </p>
            </div>

            {/* Separator */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] font-medium text-zinc-400">
                Or continue with email
              </span>
            </div>

            {/* TAB 1: SIGN IN */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="pl-9 text-xs"
                      placeholder="student@university.edu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="pl-9 pr-9 text-xs"
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
                  className="w-full h-10 gap-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  {isLoading ? 'Signing in...' : 'Sign In as Student'} <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}

            {/* TAB 2: SIGN UP (ONLY FOR STUDENTS) */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Alex Johnson"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Student Email *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="student@college.edu"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 6 chars"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="text-xs pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                      <Input
                        placeholder="+91 98765 43210"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        className="text-xs pl-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Roll / Student ID
                    </label>
                    <Input
                      placeholder="e.g. 21CS108"
                      value={signUpData.rollNumber}
                      onChange={(e) => setSignUpData({ ...signUpData, rollNumber: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Semester
                    </label>
                    <Input
                      placeholder="e.g. 6th Semester"
                      value={signUpData.semester}
                      onChange={(e) => setSignUpData({ ...signUpData, semester: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    College / Department
                  </label>
                  <Input
                    placeholder="e.g. College of Engineering - Computer Science"
                    value={signUpData.college}
                    onChange={(e) => setSignUpData({ ...signUpData, college: e.target.value })}
                    className="text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 gap-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm mt-2"
                >
                  {isLoading ? 'Creating Student Account...' : 'Complete Sign Up'} <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}

            {/* Campus Highlights Grid */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-500">
              <div className="flex flex-col items-center gap-1 p-1">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>₹1/Page Xerox</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span>24h Emergency</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1">
                <Truck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Hostel Delivery</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ADMIN & STAFF PORTAL LINK (EXPLAINING ONLY SIGN-IN FOR ADMIN/STAFF) */}
        <div className="mt-5 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Campus Staff & Admin Portal
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Invitation-only access for print operators & admins.
                </p>
              </div>
            </div>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              Sign In <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
