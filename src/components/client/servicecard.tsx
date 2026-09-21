import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react';

export interface ServiceCardProps {
  title: string;
  description: string;
  priceTag: string;
  features: string[];
  icon: LucideIcon;
  href: string;
  badge?: string;
  iconBg?: string;
}

export function ServiceCard({
  title,
  description,
  priceTag,
  features,
  icon: Icon,
  href,
  badge,
  iconBg = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
}: ServiceCardProps) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-all duration-200 border-zinc-200/80 dark:border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className="h-6 w-6" />
          </div>
          {badge && (
            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/60 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              {badge}
            </span>
          )}
        </div>
        <CardTitle className="mt-4 text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {priceTag}
          </span>
          <span className="text-xs text-zinc-500">starting price</span>
        </div>
        <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
          {features.map((feat, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className="w-full gap-2 font-medium">
            Order Now <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
