'use client';
import React from 'react';
import { OrderStatus } from '@/types';
import {
  Clock,
  CheckCircle,
  Printer,
  Sparkles,
  Truck,
  CheckCheck,
  XCircle,
} from 'lucide-react';

export interface StatusTimelineProps {
  status: OrderStatus;
  deliveryOption?: 'HOSTEL' | 'PICKUP';
}

export function StatusTimeline({ status, deliveryOption = 'HOSTEL' }: StatusTimelineProps) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300">
        <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
        <div>
          <div className="font-semibold text-sm">Order Cancelled</div>
          <div className="text-xs text-rose-600 dark:text-rose-400">
            This order was cancelled. Please contact customer support for assistance.
          </div>
        </div>
      </div>
    );
  }

  const isPickup = deliveryOption === 'PICKUP';

  const steps = [
    {
      key: 'ORDER_PLACED',
      label: 'Order Placed',
      icon: Clock,
      desc: 'Submitted in system',
    },
    {
      key: 'ORDER_ACCEPTED',
      label: 'Order Accepted',
      icon: CheckCircle,
      desc: 'Approved by admin',
    },
    {
      key: 'PROCESSING',
      label: 'Processing',
      icon: Printer,
      desc: 'Printing & binding',
    },
    {
      key: 'READY',
      label: 'Ready',
      icon: Sparkles,
      desc: 'Quality checked',
    },
    {
      key: 'OUT_FOR_DELIVERY',
      label: isPickup ? 'Available for Pickup' : 'Out for Delivery',
      icon: Truck,
      desc: isPickup ? 'At campus counter' : 'Agent on the way',
    },
    {
      key: 'COMPLETED',
      label: 'Completed',
      icon: CheckCheck,
      desc: 'Delivered & collected',
    },
  ];

  // Map any legacy or PRD status to hierarchy index (0 to 5)
  const getLevel = (st: OrderStatus): number => {
    switch (st) {
      case 'ORDER_PLACED':
      case 'PENDING':
        return 0;
      case 'ORDER_ACCEPTED':
      case 'CONFIRMED':
        return 1;
      case 'PROCESSING':
      case 'PRINTING':
        return 2;
      case 'READY':
        return 3;
      case 'OUT_FOR_DELIVERY':
      case 'AVAILABLE_FOR_PICKUP':
      case 'READY_FOR_PICKUP':
        return 4;
      case 'COMPLETED':
        return 5;
      default:
        return 0;
    }
  };

  const currentLevel = getLevel(status);

  return (
    <div className="py-5 px-1 sm:px-2">
      <div className="grid grid-cols-6 gap-1 sm:gap-2 relative">
        {/* Continuous connector bar background */}
        <div className="absolute top-5 left-[8%] right-[8%] h-1 bg-zinc-200 dark:bg-zinc-800 -z-0 rounded-full" />
        
        {/* Animated fill progress bar */}
        <div
          className="absolute top-5 left-[8%] h-1 bg-indigo-600 transition-all duration-500 -z-0 rounded-full"
          style={{ width: `${Math.min(84, Math.max(0, (currentLevel / 5) * 84))}%` }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentLevel > idx;
          const isCurrent = currentLevel === idx;

          return (
            <div key={step.key} className="flex flex-col items-center text-center z-10">
              <div
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-all ${
                  isDone
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                    : isCurrent
                    ? 'border-indigo-600 bg-white text-indigo-600 shadow-md ring-4 ring-indigo-100 dark:bg-zinc-900 dark:ring-indigo-950'
                    : 'border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900'
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-xs font-semibold leading-tight px-0.5 ${
                  isCurrent
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : isDone
                    ? 'text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-400'
                }`}
              >
                {step.label}
              </span>
              <span className="hidden md:block text-[10px] text-zinc-400 mt-0.5 max-w-[80px]">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
