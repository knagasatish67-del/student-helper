'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/authprovider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@studenthelper.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(email, password, 'ADMIN');
      if (!res.success) {
        toast({
          title: 'Login Failed',
          description: res.error || 'Invalid admin credentials. Please verify your email and password.',
          variant: 'destructive',
        });
        return;
      }
      toast({ title: 'Admin Authorized', description: 'Welcome to the management console' });
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast({ title: 'Login Failed', description: err.message || 'Invalid admin credentials', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Admin Management Console
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Staff access to process incoming print queues and student orders.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Staff Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs"
                    placeholder="admin@studenthelper.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Admin Passcode
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
              <div className="rounded-lg bg-zinc-100 p-3 text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <span className="font-semibold block mb-0.5">Preconfigured Admin Credentials:</span>
                Email: <code className="font-mono font-bold">admin@studenthelper.com</code> <br />
                Password: <code className="font-mono font-bold">admin123</code>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" disabled={isLoading} className="w-full gap-2 text-xs font-semibold h-10">
                {isLoading ? 'Verifying access...' : 'Access Dashboard'} <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="text-center text-xs text-zinc-500 pt-2">
                <Link href="/" className="hover:underline">
                  ← Return to Public Student Portal
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
