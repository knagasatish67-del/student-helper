'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { ServiceSelector } from '@/components/client/serviceselector';
import { FileUpload } from '@/components/client/fileupload';
import { OrderSummary, CostLineItem } from '@/components/client/ordersummary';
import { CustomerDetailsSection, CustomerDetails } from '@/components/client/customerdetails';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UploadedFile, ManualConfig } from '@/types';
import { BookOpen, Zap, Clock, Palette, Stethoscope } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/providers/authprovider';
import { OrderConfirmedModal } from '@/components/client/orderconfirmedmodal';

export default function ManualOrderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [confirmedOrder, setConfirmedOrder] = useState<{
    isOpen: boolean;
    orderNumber: string;
    orderId?: string;
    totalAmount: number;
  } | null>(null);

  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: 'manual-file-1',
      fileName: 'Database_Management_Lab_Manual.pdf',
      fileUrl: '/uploads/sample.pdf',
      fileSize: 3200000,
      fileType: 'application/pdf',
      pageCount: 25,
      uploadedAt: new Date().toISOString(),
    },
  ]);

  const [config, setConfig] = useState<ManualConfig>({
    orderType: 'NORMAL', // 'NORMAL' = ₹25/practical, 'EMERGENCY' = ₹30/practical
    practicalsCount: 5, // Default 5 practical experiments
    pagesCount: 25,
    normalDiagramsCount: 0, // +₹10 each
    medicalDiagramsCount: 0, // +₹50 each
    subject: 'Database Systems Lab',
    department: 'Computer Science',
    labName: 'DBMS & SQL Laboratory',
    semester: 'Semester 4',
    diagramColor: true,
    bindingType: 'RECORD_BOOK',
    instructions: 'Please bind with standard university hard record cover and include experiment index.',
  });

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: user?.name || 'Alex Sharma',
    phone: user?.phone || '+91 91234 56789',
    hostel: user?.hostel || 'Hostel 3 (Ganga)',
    roomNumber: user?.roomNumber || 'Room 204',
    deliveryAddress: 'Ganga Block B, 2nd Floor',
    deliveryOption: 'HOSTEL',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Total pages from files if emergency
  const totalUploadedPages = useMemo(() => {
    return files.reduce((sum, f) => sum + (f.pageCount || 1), 0) || config.pagesCount || 10;
  }, [files, config.pagesCount]);

  // Pricing for Manual:
  // Normal: ₹25 / practical
  // Emergency / Single Night: ₹30 / practical
  // Normal Diagram: +₹10 each
  // Medical Department Diagram: +₹50 each
  // Delivery: Free (₹0)
  // Sunday Surcharge: ₹0
  const pricing = useMemo(() => {
    let baseCost = 0;
    const items: CostLineItem[] = [];
    const practicals = Math.max(1, config.practicalsCount || 1);

    if (config.orderType === 'NORMAL') {
      baseCost = practicals * 25;
      items.push({
        label: 'Lab Manual Practicals',
        amount: baseCost,
        subtext: `${practicals} practical(s) × ₹25 / practical`,
      });
    } else {
      // EMERGENCY: ₹30 / practical
      baseCost = practicals * 30;
      items.push({
        label: 'Emergency / Single Night Manual',
        amount: baseCost,
        subtext: `${practicals} practical(s) × ₹30 / practical`,
      });
    }

    // Normal diagrams (+₹10 each)
    let normalDiagramCost = 0;
    if (config.normalDiagramsCount > 0) {
      normalDiagramCost = config.normalDiagramsCount * 10;
      items.push({
        label: 'Standard Technical Diagrams',
        amount: normalDiagramCost,
        subtext: `${config.normalDiagramsCount} diagram(s) × ₹10 each`,
      });
    }

    // Medical department diagrams (+₹50 each)
    let medicalDiagramCost = 0;
    if (config.medicalDiagramsCount > 0) {
      medicalDiagramCost = config.medicalDiagramsCount * 50;
      items.push({
        label: 'Medical / Anatomical Diagrams',
        amount: medicalDiagramCost,
        subtext: `${config.medicalDiagramsCount} detailed diagram(s) × ₹50 each`,
      });
    }

    // Delivery is free for Manuals per PRD
    items.push({
      label: 'Hostel Room Delivery',
      amount: 0,
      subtext: 'Free campus delivery for lab manuals',
    });

    const totalAmount = baseCost + normalDiagramCost + medicalDiagramCost;
    return { baseCost, normalDiagramCost, medicalDiagramCost, totalAmount, items };
  }, [
    config.orderType,
    config.practicalsCount,
    config.normalDiagramsCount,
    config.medicalDiagramsCount,
  ]);

  const handlePlaceOrder = async () => {
    if (files.length === 0) {
      toast({
        title: 'Document required',
        description: 'Please upload at least one lab manual or practical experiment file.',
        variant: 'destructive',
      });
      return;
    }
    if (!customer.name.trim() || !customer.phone.trim() || !customer.roomNumber.trim()) {
      toast({
        title: 'Customer Details Incomplete',
        description: 'Please provide your name, phone number, and room number.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const orderPayload = {
        serviceType: 'MANUAL',
        totalAmount: pricing.totalAmount,
        manualConfig: {
          ...config,
          pagesCount: totalUploadedPages,
        },
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
          title: 'Lab Manual Order Submitted!',
          description: `Order #${data.order.orderNumber} successfully received.`,
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
              <BookOpen className="h-7 w-7 text-emerald-600" />
              University Lab Manual & Record Service
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              Lab experiment manuals & record books with neat handwriting/printing, precise diagrams, and standard university binding.
            </p>
          </div>

          <div className="mb-8">
            <ServiceSelector activeService="MANUAL" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Form + Upload + Customer Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Urgency Type: Normal vs Emergency */}
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    1. Select Order Type & Rate Calculation
                  </CardTitle>
                  <p className="text-xs text-zinc-500">
                    Normal order calculates at ₹25 / practical; emergency single-night calculates at ₹30 / practical.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Normal: ₹25 / practical */}
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, orderType: 'NORMAL' })}
                      className={`relative flex flex-col p-4 rounded-xl border text-left transition-all ${
                        config.orderType === 'NORMAL'
                          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                          : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="flex items-center gap-1.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          <Clock className="h-4 w-4 text-emerald-600" />
                          Normal Lab Manual
                        </span>
                        <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                          ₹25 / practical
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        Standard timetable submission. Free hostel delivery included.
                      </span>
                    </button>

                    {/* Emergency / Single Night: ₹30 / per practical */}
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
                          Emergency / Single Night
                        </span>
                        <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                          ₹30 / per practical
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        Urgent overnight lab record completion before morning inspection (₹30 / practical).
                      </span>
                    </button>
                  </div>

                  {/* Input based on selection */}
                  <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Number of Practical Experiments
                      </label>
                      <p className="text-[11px] text-zinc-500">
                        {config.orderType === 'NORMAL'
                          ? 'Total experiments to complete (₹25 per practical)'
                          : 'Urgent experiments to complete (₹30 per practical)'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            practicalsCount: Math.max(1, (config.practicalsCount || 1) - 1),
                          })
                        }
                        className="h-8 w-8 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {config.practicalsCount || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            practicalsCount: (config.practicalsCount || 1) + 1,
                          })
                        }
                        className="h-8 w-8 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Diagrams Add-on Section (PRD Exact: Normal +₹10, Medical +₹50) */}
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    2. Scientific Diagrams Add-ons
                  </CardTitle>
                  <p className="text-xs text-zinc-500">
                    Hand-drawn circuit schematics, apparatus diagrams, or medical illustrations.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Normal Diagram (+₹10) */}
                  <div className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                        <Palette className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold block text-zinc-900 dark:text-zinc-100">
                          Normal Diagram (+₹10 each)
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          Engineering, physics, chemistry, flowcharts & basic graphs
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            normalDiagramsCount: Math.max(0, config.normalDiagramsCount - 1),
                          })
                        }
                        className="h-7 w-7 rounded border flex items-center justify-center text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-xs">
                        {config.normalDiagramsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            normalDiagramsCount: config.normalDiagramsCount + 1,
                          })
                        }
                        className="h-7 w-7 rounded border flex items-center justify-center text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Medical Diagram (+₹50) */}
                  <div className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold block text-zinc-900 dark:text-zinc-100">
                          Medical Department Diagram (+₹50 each)
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          High-complexity anatomical, histology, physiology, and pathology sketches
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            medicalDiagramsCount: Math.max(0, config.medicalDiagramsCount - 1),
                          })
                        }
                        className="h-7 w-7 rounded border flex items-center justify-center text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-xs">
                        {config.medicalDiagramsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            medicalDiagramsCount: config.medicalDiagramsCount + 1,
                          })
                        }
                        className="h-7 w-7 rounded border flex items-center justify-center text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lab & Course Details */}
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    3. Lab Subject & Course Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Lab Course / Subject
                      </label>
                      <Input
                        placeholder="e.g. Database Systems Lab, Physics Lab"
                        value={config.subject}
                        onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Department / Branch
                      </label>
                      <Input
                        placeholder="e.g. Computer Science, Mechanical, Medical"
                        value={config.department || ''}
                        onChange={(e) => setConfig({ ...config, department: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Instructions for Cover & Index
                    </label>
                    <Input
                      placeholder="e.g. Mention experiment titles, date of experiment, and signature blocks"
                      value={config.instructions || ''}
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
                    4. Upload Lab Manual / Syllabus Documents
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
                serviceType="MANUAL"
              />
            </div>

            {/* Right Col: Cost Breakdown */}
            <div>
              <OrderSummary
                serviceName={`Lab Manual (${config.orderType === 'EMERGENCY' ? 'Emergency' : 'Normal'})`}
                items={pricing.items}
                totalAmount={pricing.totalAmount}
                onSubmit={handlePlaceOrder}
                isLoading={isLoading}
                submitLabel="Submit Lab Manual Order"
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
          serviceType="Lab Manual"
          totalAmount={confirmedOrder.totalAmount}
        />
      )}
    </div>
  );
}
