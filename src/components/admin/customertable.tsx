'use client';
import React from 'react';
import { User } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { format } from 'date-fns';

export function CustomerTable({ customers }: { customers: User[] }) {
  const formatDateSafe = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '—';
      return format(d, 'MMM dd, yyyy');
    } catch {
      return '—';
    }
  };

  if (!customers || customers.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-8 text-center text-sm text-zinc-400">
        No students found.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>College</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={c.name || 'Student'} className="h-8 w-8 text-xs" />
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {c.name || 'Student'}
                    </div>
                    <div className="text-[11px] text-zinc-500">{c.email || '—'}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs font-semibold">
                {c.rollNumber || '—'}
              </TableCell>
              <TableCell className="text-xs">
                {c.department || 'General'} {c.semester ? `(${c.semester})` : ''}
              </TableCell>
              <TableCell className="text-xs text-zinc-600 dark:text-zinc-400">
                {c.college || 'Engineering'}
              </TableCell>
              <TableCell className="text-xs font-mono">{c.phone || '—'}</TableCell>
              <TableCell className="text-xs text-zinc-500">
                {formatDateSafe(c.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
