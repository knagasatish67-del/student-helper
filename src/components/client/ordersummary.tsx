'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, Loader2, Banknote } from 'lucide-react';

export interface CostLineItem {
  label: string;
  amount: number;
  subtext?: string;
}

export interface OrderSummaryProps {
  serviceName: string;
  items?: CostLineItem[];
  totalPages?: number;
  copies?: number;
  printCost?: number;
  bindingCost?: number;
  deliveryCost?: number;
  sundaySurcharge?: number;
  totalAmount: number;
  onSubmit: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  isValid?: boolean;
}

export function OrderSummary({
  serviceName,
  items,
  totalPages,
  copies = 1,
  printCost = 0,
  bindingCost = 0,
  deliveryCost = 0,
  sundaySurcharge = 0,
  totalAmount,
  onSubmit,
  isLoading = false,
  submitLabel = 'Confirm & Place Order',
  isValid = true,
}: OrderSummaryProps) {
  return (
    <Card className="border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/60 sticky top-24">
      <CardHeader className="pb-3 border-b border-zinc-200/60 dark:border-zinc-800">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <span>Cost Breakdown</span>
          <span className="text-xs font-normal text-zinc-500 uppercase tracking-wider">
            PRD Rate Card
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs pt-4">
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Selected Service</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{serviceName}</span>
        </div>

        {items && items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <div>
                <span>{item.label}</span>
                {item.subtext && (
                  <span className="block text-[10px] text-zinc-400">{item.subtext}</span>
                )}
              </div>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {item.amount === 0 ? 'FREE' : `₹${item.amount.toFixed(2)}`}
              </span>
            </div>
          ))
        ) : (
          <>
            {totalPages !== undefined && (
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Total Volume</span>
                <span>
                  {totalPages} pages {copies > 1 ? `× ${copies} copies` : ''}
                </span>
              </div>
            )}
            {printCost > 0 && (
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Print / Processing Cost</span>
                <span>₹{printCost.toFixed(2)}</span>
              </div>
            )}
            {bindingCost > 0 && (
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Finishing & Binding</span>
                <span>₹{bindingCost.toFixed(2)}</span>
              </div>
            )}
            {deliveryCost > 0 ? (
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Hostel Room Delivery</span>
                <span>₹{deliveryCost.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Delivery / Collection</span>
                <span className="font-semibold">FREE</span>
              </div>
            )}
            {sundaySurcharge > 0 && (
              <div className="flex justify-between text-amber-700 dark:text-amber-400">
                <span>Sunday Processing Surcharge</span>
                <span>₹{sundaySurcharge.toFixed(2)}</span>
              </div>
            )}
          </>
        )}

        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 flex justify-between items-baseline font-bold text-sm text-zinc-900 dark:text-zinc-100">
          <span>Total To Pay</span>
          <span className="text-xl text-indigo-600 dark:text-indigo-400">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Offline Payment Notice */}
        <div className="rounded-lg bg-amber-50 p-2.5 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200 font-semibold text-[11px]">
            <Banknote className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            Direct / Offline Payment
          </div>
          <p className="text-[10px] text-amber-700 dark:text-amber-300 mt-0.5">
            No advance online payment needed. Hand over exact cash or pay directly when the service agent arrives at your hostel room.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2.5 pt-2">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!isValid || isLoading}
          className="w-full h-11 text-sm font-semibold gap-2 shadow-md shadow-indigo-500/10"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting Order...
            </>
          ) : (
            <>
              {submitLabel}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 text-center">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Verified University Campus Service</span>
        </div>
      </CardFooter>
    </Card>
  );
}
