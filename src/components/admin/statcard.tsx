import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp = true,
  color = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
}: StatCardProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{title}</span>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</div>
          <div className="mt-1 flex items-center justify-between text-xs">
            {subtitle && <span className="text-zinc-500">{subtitle}</span>}
            {trend && (
              <span
                className={`font-semibold ${
                  trendUp ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
