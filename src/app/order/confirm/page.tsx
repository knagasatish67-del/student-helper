'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { OrderConfirmedModal } from '@/components/client/orderconfirmedmodal';

export default function OrderConfirmPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    isOpen: boolean;
    orderNumber: string;
    orderId?: string;
    totalAmount: number;
  } | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('pending_order');
    if (saved) {
      try {
        setDraft(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleConfirm = async () => {
    if (!draft) return;
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.removeItem('pending_order');
        setConfirmedOrder({
          isOpen: true,
          orderNumber: data.order.orderNumber,
          orderId: data.order.id,
          totalAmount: data.order.totalAmount,
        });
        toast({ title: 'Order Confirmed!', description: `Order #${data.order.orderNumber} is in the queue.` });
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!draft) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Printer className="h-10 w-10 text-zinc-400 mb-3" />
          <h2 className="text-base font-bold">No active draft found</h2>
          <p className="text-xs text-zinc-500 mt-1 mb-4">Please select a service and upload documents.</p>
          <Link href="/order/xerox">
            <Button size="sm">Go to Xerox Order</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-xl">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Printer className="h-5 w-5 text-indigo-600" />
                Confirm Your Print Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 space-y-2">
                <div className="flex justify-between font-semibold text-zinc-900 dark:text-zinc-100">
                  <span>Service</span>
                  <span>{draft.serviceType}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Files Attached</span>
                  <span>{draft.files?.length || 0} document(s)</span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-2 flex justify-between font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  <span>Total Due</span>
                  <span>₹{(draft.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Pay securely online or choose cash payment upon campus counter collection.</span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="w-1/2 text-xs"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Edit Order
              </Button>
              <Button
                className="w-1/2 text-xs font-semibold gap-1.5"
                disabled={loading}
                onClick={handleConfirm}
              >
                {loading ? 'Submitting...' : 'Confirm & Submit'} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />

      {confirmedOrder && (
        <OrderConfirmedModal
          isOpen={confirmedOrder.isOpen}
          orderNumber={confirmedOrder.orderNumber}
          orderId={confirmedOrder.orderId}
          serviceType={draft?.serviceType || 'Print Service'}
          totalAmount={confirmedOrder.totalAmount}
        />
      )}
    </div>
  );
}
