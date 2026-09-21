'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/authprovider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Printer, Lock, Mail, ArrowRight, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('student123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(email, password, 'STUDENT');
      if (!res.success) {
        toast({
          title: 'Login Failed',
          description: res.error || 'Invalid email or password. Please check your credentials.',
          variant: 'destructive',
        });
        return;
      }
      toast({ title: 'Welcome back!', description: 'Logged in successfully.' });
      router.push('/dashboard');
    } catch (err: any) {
      toast({
        title: 'Login Failed',
        description: err.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Printer className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Student Helper
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Sign in to your student account
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Access your orders, track print queue, and chat with shop staff.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 text-xs"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Demo creds notice */}
              <div className="rounded-lg bg-indigo-50/70 p-3 text-[11px] text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                <span className="font-semibold block mb-0.5">Quick Demo Credentials:</span>
                Student: <code className="bg-white/60 dark:bg-zinc-800 px-1 py-0.5 rounded">student@university.edu</code> / <code className="bg-white/60 dark:bg-zinc-800 px-1 py-0.5 rounded">student123</code>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" disabled={isLoading} className="w-full gap-2 text-xs font-semibold h-10">
                {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-between w-full text-xs text-zinc-500 pt-2">
                <Link href="/register" className="text-indigo-600 hover:underline">
                  Need an account? Register
                </Link>
                <Link href="/admin/login" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Admin Staff
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
