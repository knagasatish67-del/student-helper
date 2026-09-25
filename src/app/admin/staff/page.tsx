'use client';
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/adminlayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  UserPlus,
  Shield,
  Printer,
  Truck,
  BookOpen,
  Phone,
  Mail,
  Copy,
  Check,
  Info,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { User, StaffRole } from '@/types';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    staffRole: 'OPERATOR' as StaffRole,
    department: 'Print Operations',
  });

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/staff');
      const data = await res.json();
      if (data.staff) {
        setStaffList(data.staff);
      }
    } catch {
      toast({ title: 'Error', description: 'Could not fetch staff members', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast({ title: 'Missing fields', description: 'Please fill name, email, and password', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Failed to add staff', description: data.error, variant: 'destructive' });
        return;
      }

      toast({
        title: 'Staff Member Added!',
        description: `${formData.name} was successfully registered as a ${formData.staffRole}.`,
      });

      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        staffRole: 'OPERATOR',
        department: 'Print Operations',
      });
      fetchStaff();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCreds = (email: string, role: string) => {
    navigator.clipboard.writeText(`Email: ${email} | Role: ${role}`);
    setCopiedId(email);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: 'Copied!', description: 'Staff credentials copied to clipboard' });
  };

  const getRoleBadge = (role?: StaffRole) => {
    switch (role) {
      case 'OPERATOR':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 gap-1 hover:bg-blue-100 border-none font-medium">
            <Printer className="h-3 w-3" /> Xerox Operator
          </Badge>
        );
      case 'DELIVERY':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 gap-1 hover:bg-emerald-100 border-none font-medium">
            <Truck className="h-3 w-3" /> Delivery Agent
          </Badge>
        );
      case 'COORDINATOR':
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 gap-1 hover:bg-purple-100 border-none font-medium">
            <BookOpen className="h-3 w-3" /> Assignment Coordinator
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 gap-1 hover:bg-amber-100 border-none font-medium">
            <Shield className="h-3 w-3" /> Operations Manager
          </Badge>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Staff & Operator Management
              </h1>
              <Badge variant="outline" className="text-xs">
                {staffList.length} Active Members
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Add and manage print operators, assignment writers, and hostel delivery personnel.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={fetchStaff} disabled={isLoading} className="gap-1.5 text-xs">
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add Staff Member
            </Button>
          </div>
        </div>

        {/* Informational Architecture Guide */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Info className="h-4 w-4" />
            </div>
            <div className="text-xs space-y-1 text-zinc-700 dark:text-zinc-300">
              <h4 className="font-semibold text-indigo-950 dark:text-indigo-200">
                How Staff Accounts Work (Separated From Public Signups)
              </h4>
              <p>
                Regular students can self-register or sign in with Google on the student portal. <strong>Staff accounts cannot self-register</strong>; they are created and assigned here by the Administrator.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
                <div className="p-2 bg-white/70 dark:bg-zinc-900/60 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">1. Xerox Operators</span>
                  Can update orders to &quot;PRINTING&quot; and &quot;READY&quot;, print customer cover sheets, and see uploaded documents.
                </div>
                <div className="p-2 bg-white/70 dark:bg-zinc-900/60 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">2. Delivery Agents</span>
                  Can view hostel room numbers, call student phone numbers, and mark orders &quot;OUT_FOR_DELIVERY&quot; or &quot;COMPLETED&quot;.
                </div>
                <div className="p-2 bg-white/70 dark:bg-zinc-900/60 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">3. Isolated Permissions</span>
                  Staff cannot modify base pricing matrix, delete users, or view store revenue analytics.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Cards Grid / Empty State */}
        {staffList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center bg-white dark:bg-zinc-900/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-3">
              <UserPlus className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No Staff Members Added Yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
              Add your first Xerox Machine Operator or Hostel Delivery Courier to begin delegating campus fulfillment shifts.
            </p>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add First Staff Member
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffList.map((member) => (
              <Card key={member.id} className="border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 font-bold dark:bg-zinc-800 dark:text-zinc-200 text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{member.name}</h3>
                        <p className="text-xs text-zinc-500">{member.department || 'Operations'}</p>
                      </div>
                    </div>
                    <div>{getRoleBadge(member.staffRole)}</div>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="font-mono text-[11px] truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Role ID: {member.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Active Operator
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCreds(member.email, member.staffRole || 'STAFF')}
                      className="h-7 text-xs text-zinc-500 hover:text-zinc-900 gap-1 px-2"
                    >
                      {copiedId === member.email ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      Copy Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal: Add Staff Member */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <UserPlus className="h-5 w-5" />
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Add New Staff Member
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Create a dedicated operator account with access to the orders processing portal.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleCreateStaff}>
                <CardContent className="space-y-3.5 pt-4 text-xs">
                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Staff Full Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Staff Login Email *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="e.g. ramesh.print@studenthelper.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Temporary Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                      <Input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Assigned Role *
                      </label>
                      <select
                        value={formData.staffRole}
                        onChange={(e) => setFormData({ ...formData, staffRole: e.target.value as StaffRole })}
                        className="w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                      >
                        <option value="OPERATOR">Xerox Machine Operator</option>
                        <option value="DELIVERY">Hostel Delivery Agent</option>
                        <option value="COORDINATOR">Assignment Coordinator</option>
                        <option value="MANAGER">Floor Shift Manager</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Phone Contact
                      </label>
                      <Input
                        placeholder="+91 98480 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Department / Machine Counter
                    </label>
                    <Input
                      placeholder="e.g. Counter 2 (Color Xerox & Spiral)"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </CardContent>

                <div className="flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800 p-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="sm"
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Register Staff Account'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
