'use client';
import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { ServiceSelector } from '@/components/client/serviceselector';
import { FileUpload } from '@/components/client/fileupload';
import { OrderSummary, CostLineItem } from '@/components/client/ordersummary';
import { CustomerDetailsSection, CustomerDetails } from '@/components/client/customerdetails';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UploadedFile, AssignmentConfig } from '@/types';
import { FileEdit, Zap, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/providers/authprovider';
import { OrderConfirmedModal } from '@/components/client/orderconfirmedmodal';

export default function AssignmentOrderPage() {
  const { user } = useAuth();
  const [confirmedOrder, setConfirmedOrder] = useState<{
    isOpen: boolean;
    orderNumber: string;
    orderId?: string;
    totalAmount: number;
  } | null>(null);

  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: 'assignment-file-1',
      fileName: 'Compiler_Design_Assignment_2.pdf',
      fileUrl: '/uploads/sample.pdf',
      fileSize: 1800000,
      fileType: 'application/pdf',
      pageCount: 16,
      uploadedAt: new Date().toISOString(),
    },
  ]);

  const [config, setConfig] = useState<AssignmentConfig>({
    orderType: 'NORMAL', // 'NORMAL' = ₹30, 'EMERGENCY' = ₹40
    quantity: 1,
    subject: 'Compiler Design',
    topic: 'Lexical Analysis & Syntax Trees',
    deadline: 'Tomorrow 10:00 AM',
    pageCount: 16,
    format: 'PRINT',
    bindingType: 'STAPLE',
    instructions: 'Please include student name, roll number, and department on the cover page.',
  });

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: user?.name || 'Alex Sharma',
    phone: user?.phone || '+91 91234 56789',
    hostel: user?.hostel || '',
    roomNumber: user?.roomNumber || '',
    deliveryAddress: '',
    deliveryOption: 'HOSTEL',
  });

  const [isLoading, setIsLoading] = useState(false);

  // PRD Exact Pricing:
  // Normal: ₹30 per assignment
  // Emergency / 24 Hours: ₹40 per assignment
  // Hostel Delivery: Free (₹0)
  // Sunday Surcharge: ₹0 (Applies ONLY to Xerox)
  const pricing = useMemo(() => {
    const ratePerUnit = config.orderType === 'EMERGENCY' ? 40 : 30;
    const baseCost = ratePerUnit * (config.quantity || 1);
    const deliveryFee = 0; // FREE for assignments per PRD
    const totalAmount = baseCost + deliveryFee;

    const items: CostLineItem[] = [
      {
        label: `${config.orderType === 'EMERGENCY' ? 'Emergency (24h)' : 'Normal'} Assignment`,
        amount: baseCost,
        subtext: `${config.quantity} assignment(s) × ₹${ratePerUnit}`,
      },
      {
        label: 'Hostel Room Delivery',
        amount: 0,
        subtext: 'Free campus delivery for all assignments',
      },
    ];

    return { baseCost, deliveryFee, totalAmount, items };
  }, [config.orderType, config.quantity]);

  const handlePlaceOrder = async () => {
    if (files.length === 0) {
      toast({
        title: 'Document required',
        description: 'Please upload at least one assignment PDF or document.',
        variant: 'destructive',
      });
      return;
    }
    if (!customer.name.trim() || !customer.phone.trim() || !customer.roomNumber.trim()) {
      toast({
        title: 'Customer Details Incomplete',
        description: 'Please provide your name, phone number, and room number for delivery.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const orderPayload = {
        serviceType: 'ASSIGNMENT',
        totalAmount: pricing.totalAmount,
        assignmentConfig: config,
        customerName: customer.name,
        customerPhone: customer.phone,
        hostel: customer.hostel,
        roomNumber: customer.roomNumber,
        deliveryAddress: customer.deliveryAddress,
        deliveryOption: customer.deliveryOption,
        files,
        notes: config.instructions,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setConfirmedOrder({
          isOpen: true,
          orderNumber: data.order.orderNumber,
          orderId: data.order.id,
          totalAmount: data.order.totalAmount,
        });
        toast({
          title: 'Order Submitted!',
          description: `Assignment Order #${data.order.orderNumber} successfully received.`,
        });
      } else {
        toast({
          title: 'Order Failed',
          description: data.error || 'Failed to place order',
          variant: 'destructive',
        });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white flex items-center gap-2.5">
              <FileEdit className="h-7 w-7 text-purple-600" />
              University Assignment Service
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              Submit your assignment documents for high-quality printing, binding, and direct hostel room delivery.
            </p>
          </div>

          <div className="mb-8">
            <ServiceSelector activeService="ASSIGNMENT" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Form + Upload + Customer Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Speed & Pricing Option */}
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    1. Select Delivery Urgency & Pricing
                  </CardTitle>
                  <p className="text-xs text-zinc-500">
                    Pricing strictly adheres to university standard rate cards.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Normal Order: ₹30 */}
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, orderType: 'NORMAL' })}
                      className={`relative flex flex-col p-4 rounded-xl border text-left transition-all ${
                        config.orderType === 'NORMAL'
                          ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/30 ring-2 ring-purple-500/20'
                          : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="flex items-center gap-1.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          <Clock className="h-4 w-4 text-purple-600" />
                          Normal Assignment
                        </span>
                        <span className="text-base font-extrabold text-purple-700 dark:text-purple-400">
                          ₹30
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        Standard delivery within 24–48 hours. Free hostel delivery included.
                      </span>
                    </button>

                    {/* Emergency Order: ₹40 */}
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, orderType: 'EMERGENCY' })}
                      className={`relative flex flex-col p-4 rounded-xl border text-left transition-all ${
                        config.orderType === 'EMERGENCY'
                          ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                          : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="flex items-center gap-1.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          <Zap className="h-4 w-4 text-amber-600" />
                          Emergency / 24 Hours
                        </span>
                        <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                          ₹40
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        Priority express processing and urgent handover. Free hostel delivery included.
                      </span>
                    </button>
                  </div>

                  {/* Quantity */}
                  <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Number of Assignments
                      </label>
                      <p className="text-[11px] text-zinc-500">
                        If submitting multiple assignments under this order
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setConfig({ ...config, quantity: Math.max(1, (config.quantity || 1) - 1) })
                        }
                        className="h-8 w-8 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {config.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig({ ...config, quantity: (config.quantity || 1) + 1 })
                        }
                        className="h-8 w-8 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Subject & Topic Details */}
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    2. Subject & Submission Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Subject Name
                      </label>
                      <Input
                        placeholder="e.g. Compiler Design, Artificial Intelligence"
                        value={config.subject}
                        onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                        className="text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Topic / Assignment Title
                      </label>
                      <Input
                        placeholder="e.g. Unit 3 Syntax Analysis"
                        value={config.topic}
                        onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Submission Deadline / Date
                    </label>
                    <Input
                      placeholder="e.g. Tomorrow by 10:00 AM"
                      value={config.deadline}
                      onChange={(e) => setConfig({ ...config, deadline: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Special Notes / Cover Page Instructions
                    </label>
                    <Input
                      placeholder="e.g. Include student name, roll number, and department header"
                      value={config.instructions}
                      onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload (Unlimited PDFs) */}
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    3. Upload Assignment Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload files={files} onFilesChange={setFiles} />
                </CardContent>
              </Card>

              {/* Customer & Delivery Details */}
              <CustomerDetailsSection
                details={customer}
                onChange={setCustomer}
                serviceType="ASSIGNMENT"
              />
            </div>

            {/* Right Col: Cost Breakdown & Offline Payment Summary */}
            <div>
              <OrderSummary
                serviceName={`Assignment (${config.orderType === 'EMERGENCY' ? 'Emergency 24h' : 'Normal'})`}
                items={pricing.items}
                totalAmount={pricing.totalAmount}
                onSubmit={handlePlaceOrder}
                isLoading={isLoading}
                submitLabel="Submit Assignment Order"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {confirmedOrder && (
        <OrderConfirmedModal
          isOpen={confirmedOrder.isOpen}
          orderNumber={confirmedOrder.orderNumber}
          orderId={confirmedOrder.orderId}
          serviceType="Assignment"
          totalAmount={confirmedOrder.totalAmount}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </div>
  );
}
