'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { useAuth } from '@/components/providers/authprovider';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Save, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'student@university.edu',
    phone: user?.phone || '+91 98765 43210',
    rollNumber: user?.rollNumber || '21CS1042',
    college: user?.college || 'Engineering Institute of Technology',
    department: user?.department || 'Computer Science & Engineering',
    semester: user?.semester || 'Semester 4',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    toast({ title: 'Profile Saved', description: 'Your academic details have been updated.' });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white flex items-center gap-2.5">
              <User className="h-7 w-7 text-indigo-600" />
              Student Profile & Academics
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Used to automatically configure cover pages, roll numbers, and department headers for your assignments.
            </p>
          </div>

          <form onSubmit={handleSave}>
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Full Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Email Address
                    </label>
                    <Input
                      disabled
                      value={formData.email}
                      className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Phone Number
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Roll Number / Student ID
                    </label>
                    <Input
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Department / Branch
                    </label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Semester
                    </label>
                    <Input
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    College / University Name
                  </label>
                  <Input
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <Button type="submit" className="gap-2 text-xs font-semibold">
                  {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {saved ? 'Updated' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
