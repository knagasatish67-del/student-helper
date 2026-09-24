'use client';
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/adminlayout';
import { CustomerTable } from '@/components/admin/customertable';
import { User } from '@/types';
import { Users, Search, RefreshCw, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (data.customers) {
        const seen = new Set<string>();
        const unique = data.customers.filter((c: User) => {
          const key = c.id || c.email;
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setCustomers(unique);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const exportCustomersCSV = () => {
    if (customers.length === 0) {
      toast({ title: 'No students', description: 'No student records to export' });
      return;
    }
    const headers = [
      'Student Name',
      'Email',
      'Phone',
      'Roll Number',
      'College',
      'Department',
      'Semester',
      'Hostel',
      'Room',
      'Registered At',
    ];
    const rows = customers.map((c) => [
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.rollNumber || '').replace(/"/g, '""')}"`,
      `"${(c.college || '').replace(/"/g, '""')}"`,
      `"${(c.department || '').replace(/"/g, '""')}"`,
      `"${(c.semester || '').replace(/"/g, '""')}"`,
      `"${(c.hostel || '').replace(/"/g, '""')}"`,
      `"${(c.roomNumber || '').replace(/"/g, '""')}"`,
      `"${c.createdAt || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `students_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Export Complete', description: 'Student directory downloaded as CSV' });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.rollNumber && c.rollNumber.toLowerCase().includes(term)) ||
      (c.department && c.department.toLowerCase().includes(term))
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Enrolled Students Directory
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Registered student records, roll numbers, academic departments, and order histories.
          </p>
        </div>

        <div className="flex gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search student by name, roll, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" onClick={fetchCustomers} className="h-9 w-9" title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportCustomersCSV}
              className="h-9 gap-1.5 text-xs"
              title="Export all students to CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-sm text-zinc-500">Loading student directory...</div>
        ) : (
          <CustomerTable customers={filtered} />
        )}
      </div>
    </AdminLayout>
  );
}
