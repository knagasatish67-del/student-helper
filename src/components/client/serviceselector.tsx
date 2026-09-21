'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Printer, FileEdit, BookOpen } from 'lucide-react';

export interface ServiceSelectorProps {
  activeService?: string;
}

export function ServiceSelector({ activeService }: ServiceSelectorProps = {}) {
  const pathname = usePathname();

  const services = [
    {
      id: 'xerox',
      name: 'Document Xerox & Print',
      href: '/order/xerox',
      icon: Printer,
      desc: 'B&W / Color printouts, spiral binding & double-sided options',
    },
    {
      id: 'assignment',
      name: 'Assignment Preparation',
      href: '/order/assignment',
      icon: FileEdit,
      desc: 'Print & Handwritten assignments formatted with cover page',
    },
    {
      id: 'manual',
      name: 'Lab Manuals & Records',
      href: '/order/manual',
      icon: BookOpen,
      desc: 'Engineering/Science lab manuals with hard/spiral binding',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-8">
      {services.map((s) => {
        const Icon = s.icon;
        const isActive = activeService
          ? activeService.toLowerCase().includes(s.id)
          : pathname.includes(s.id);
        return (
          <Link
            key={s.id}
            href={s.href}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
              isActive
                ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm'
                : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">{s.name}</div>
              <div className="text-xs text-zinc-500 line-clamp-1">{s.desc}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
