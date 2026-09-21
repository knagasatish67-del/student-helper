'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Printer, FileEdit, BookOpen, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  // Don't display in admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      href: '/order/xerox',
      label: 'Xerox',
      icon: Printer,
      isActive: pathname.startsWith('/order/xerox'),
    },
    {
      href: '/order/assignment',
      label: 'Assignment',
      icon: FileEdit,
      isActive: pathname.startsWith('/order/assignment'),
    },
    {
      href: '/order/manual',
      label: 'Lab Manual',
      icon: BookOpen,
      isActive: pathname.startsWith('/order/manual'),
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
      isActive: pathname.startsWith('/profile'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 block sm:hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 shadow-lg">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                item.isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
