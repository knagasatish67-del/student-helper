'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, Banknote, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface OrderConfirmedModalProps {
  isOpen: boolean;
  orderNumber: string;
  orderId?: string;
  serviceType: string;
  totalAmount: number;
  onClose?: () => void;
  redirectUrl?: string;
}

export function OrderConfirmedModal({
  isOpen,
  orderNumber,
  orderId,
  serviceType,
  totalAmount,
  onClose,
  redirectUrl,
}: OrderConfirmedModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [isCancelled, setIsCancelled] = useState(false);

  const targetUrl =
    redirectUrl ||
    `/order/success?id=${orderId || 'ord'}&num=${orderNumber}&service=${encodeURIComponent(
      serviceType
    )}&amount=${totalAmount}`;

  const navigateToReceipt = React.useCallback(() => {
    try {
      router.push(targetUrl);
    } catch {
      window.location.href = targetUrl;
    }
  }, [router, targetUrl]);

  // Reset cancellation when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setIsCancelled(false);
      setCountdown(3);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isCancelled) return;

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeout = setTimeout(() => {
      navigateToReceipt();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isOpen, isCancelled, navigateToReceipt]);

  if (!isOpen) return null;

  const handleCancel = () => {
    setIsCancelled(true);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      id="order-confirmed-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div
        id="order-confirmed-modal-content"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 text-center shadow-2xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 animate-in zoom-in-95 duration-200"
      >
        {/* Close / Cancel Button */}
        <button
          type="button"
          onClick={handleCancel}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          title="Cancel auto-redirect"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Animated Green Circle with Tick Checkmark */}
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-950/40">
          <svg
            className="h-10 w-10 animate-in zoom-in spin-in-12 duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Primary Confirmed & Thank You Headings */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Order Confirmed
        </h2>
        <p className="mt-1 text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          Thank You!
        </p>

        {/* Verification Pill with requested exact phrasing */}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
          <Check className="h-3.5 w-3.5" />
          <span>order conformed • thank you</span>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Your order has been queued successfully. Our campus delivery agent will deliver your documents directly to your hostel room.
        </p>

        {/* Order Details Snippet */}
        <div className="mt-5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-4 border border-zinc-100 dark:border-zinc-700/60 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Order Reference:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
              #{orderNumber}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Service:</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{serviceType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Amount to Pay:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400">
            <Banknote className="h-3.5 w-3.5 shrink-0" />
            <span>Pay via Cash or UPI at your hostel room upon delivery</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2">
          <Button
            id="view-receipt-button"
            onClick={navigateToReceipt}
            className="w-full h-11 font-semibold text-sm gap-2 shadow-lg shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <span>
              {isCancelled
                ? 'View Order Summary'
                : `View Order Summary (${countdown}s)`}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          {isCancelled ? (
            <div className="text-[11px] text-zinc-400">
              Auto-redirect paused. Click above to view your receipt anytime.
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Redirecting automatically...</span>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
              >
                Cancel redirect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
