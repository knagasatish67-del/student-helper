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
import { UploadedFile, XeroxConfig } from '@/types';
import { Printer, Calendar, Sun, FileCheck, Layers } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/providers/authprovider';
import { OrderConfirmedModal } from '@/components/client/orderconfirmedmodal';

export default function XeroxOrderPage() {
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
      id: 'xerox-file-1',
      fileName: 'Lecture_Notes_Unit_3.pdf',
      fileUrl: '/uploads/sample.pdf',
      fileSize: 1420000,
      fileType: 'application/pdf',
      pageCount: 20,
      uploadedAt: new Date().toISOString(),
    },
  ]);

  const [config, setConfig] = useState<XeroxConfig>({
    copies: 1,
    colorMode: 'BW', // 'BW' = ₹1/page, 'COLOR' = ₹5/page
    printSides: 'DOUBLE',
    paperSize: 'A4',
    bindingType: 'STAPLE',
    deliveryOption: 'HOSTEL',
    isSunday: new Date().getDay() === 0, // Auto-detect Sunday
    instructions: '',
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

  // Sync customer delivery option with config
  const handleCustomerChange = (newCust: CustomerDetails) => {
    setCustomer(newCust);
    setConfig((prev) => ({ ...prev, deliveryOption: newCust.deliveryOption }));
  };

  const totalPages = useMemo(() => {
    return files.reduce((sum, f) => sum + (f.pageCount || 1), 0);
  }, [files]);

  // PRD Exact Pricing for Xerox:
  // Black & White: ₹1 / page
  // Colour: ₹5 / page
  // Delivery: +₹20 (or Free for campus pickup)
  // Sunday Surcharge: +₹20 (Sunday surcharge ONLY for Xerox!)
  const pricing = useMemo(() => {
    const ratePerPage = config.colorMode === 'COLOR' ? 5 : 1;
    const copies = Math.max(1, config.copies || 1);
    const printCost = totalPages * ratePerPage * copies;

    const deliveryCost = customer.deliveryOption === 'HOSTEL' ? 20 : 0;
    const sundaySurcharge = config.isSunday ? 20 : 0;

    const totalAmount = printCost + deliveryCost + sundaySurcharge;

    const items: CostLineItem[] = [
      {
        label: `${config.colorMode === 'COLOR' ? 'Colour Print' : 'Black & White Xerox'}`,
        amount: printCost,
        subtext: `${totalPages} page(s) × ₹${ratePerPage} × ${copies} ${copies > 1 ? 'copies' : 'copy'}`,
      },
      {
        label: customer.deliveryOption === 'HOSTEL' ? 'Hostel Room Delivery Fee' : 'Campus Counter Pickup',
        amount: deliveryCost,
        subtext: customer.deliveryOption === 'HOSTEL' ? 'Direct delivery to room' : 'Collect at Main Center',
      },
    ];

    if (sundaySurcharge > 0) {
      items.push({
        label: 'Sunday Express Processing Surcharge',
        amount: sundaySurcharge,
        subtext: 'Special Sunday shop opening operation (+₹20 Xerox only)',
      });
    }

    return { printCost, deliveryCost, sundaySurcharge, totalAmount, items };
  }, [totalPages, config.colorMode, config.copies, customer.deliveryOption, config.isSunday]);

  const handlePlaceOrder = async () => {
    if (files.length === 0) {
      toast({
        title: 'Upload required',
        description: 'Please upload at least one document or PDF to print.',
        variant: 'destructive',
      });
      return;
    }
    if (!customer.name.trim() || !customer.phone.trim() || !customer.roomNumber.trim()) {
      toast({
        title: 'Customer Details Incomplete',
        description: 'Please enter your name, contact phone, and room number.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const orderPayload = {
        serviceType: 'XEROX',
        totalAmount: pricing.totalAmount,
        xeroxConfig: {
          ...config,
          totalPages,
          deliveryOption: customer.deliveryOption,
        },
        customerName: customer.name,
        customerPhone: customer.phone,
        hostel: customer.hostel,
        roomNumber: customer.roomNumber,
        deliveryAddress: customer.deliveryAddress,
        deliveryOption: customer.deliveryOption,
        isSunday: config.isSunday,
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
          title: 'Xerox Order Placed!',
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
              <Printer className="h-7 w-7 text-indigo-600" />
              University Xerox & Document Printing
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              Photocopy, B&W notes (₹1/page), vibrant colour prints (₹5/page), with optional Sunday delivery to your hostel room.
            </p>
          </div>

          <div className="mb-8">
            <ServiceSelector activeService="XEROX" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Form + Upload + Customer Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Color Mode & Page Pricing */}
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    1. Print Mode & Configuration
                  </CardTitle>
                  <p className="text-xs text-zinc-500">
                    B&W photocopy is ₹1 / page. Full Colour printing is ₹5 / page.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* B&W vs Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* B&W (₹1) */}
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, colorMode: 'BW' })}
                      className={`relative flex flex-col p-4 rounded-xl border text-left transition-all ${
                        config.colorMode === 'BW'
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                          : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          Black & White Xerox
                        </span>
                        <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                          ₹1 / page
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        Crisp 75 GSM monochrome photocopy for lecture notes, question papers, and slides.
                      </span>
                    </button>

                    {/* Color (₹5) */}
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, colorMode: 'COLOR' })}
                      className={`relative flex flex-col p-4 rounded-xl border text-left transition-all ${
                        config.colorMode === 'COLOR'
                          ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                          : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          Full Colour Laser
                        </span>
                        <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                          ₹5 / page
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        High-definition color for project covers, circuit schematics, charts, and diagrams.
                      </span>
                    </button>
                  </div>

                  {/* Print Sides and Copies */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Print Sides
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setConfig({ ...config, printSides: 'DOUBLE' })}
                          className={`p-2 rounded-lg border text-xs font-semibold ${
                            config.printSides === 'DOUBLE'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50'
                              : 'border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          Back-to-Back (Duplex)
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfig({ ...config, printSides: 'SINGLE' })}
                          className={`p-2 rounded-lg border text-xs font-semibold ${
                            config.printSides === 'SINGLE'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50'
                              : 'border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          Single-Sided
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Number of Copies
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setConfig({ ...config, copies: Math.max(1, (config.copies || 1) - 1) })
                          }
                          className="h-9 w-9 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-base hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          -
                        </button>
                        <Input
                          type="number"
                          min="1"
                          value={config.copies || 1}
                          onChange={(e) =>
                            setConfig({ ...config, copies: Math.max(1, parseInt(e.target.value) || 1) })
                          }
                          className="w-16 text-center text-xs font-bold"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setConfig({ ...config, copies: (config.copies || 1) + 1 })
                          }
                          className="h-9 w-9 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-base hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sunday Surcharge Toggle (PRD: Sunday +₹20 ONLY for Xerox) */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40">
                      <div className="flex items-center gap-2.5">
                        <Sun className="h-5 w-5 text-amber-600 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-amber-950 dark:text-amber-200 block">
                            Sunday Delivery Service (+₹20)
                          </span>
                          <span className="text-[11px] text-amber-800 dark:text-amber-300">
                            Apply Sunday surcharge for holiday print operations.
                          </span>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.isSunday || false}
                          onChange={(e) => setConfig({ ...config, isSunday: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload (Unlimited PDFs) */}
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    2. Upload Documents to Xerox
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload files={files} onFilesChange={setFiles} />
                </CardContent>
              </Card>

              {/* Customer & Delivery Details */}
              <CustomerDetailsSection
                details={customer}
                onChange={handleCustomerChange}
                serviceType="XEROX"
              />
            </div>

            {/* Right Col: Cost Breakdown */}
            <div>
              <OrderSummary
                serviceName={`Xerox (${config.colorMode === 'COLOR' ? 'Colour' : 'B&W'})`}
                items={pricing.items}
                totalAmount={pricing.totalAmount}
                onSubmit={handlePlaceOrder}
                isLoading={isLoading}
                submitLabel="Confirm & Place Xerox Order"
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
          serviceType="Xerox Printing"
          totalAmount={confirmedOrder.totalAmount}
        />
      )}
    </div>
  );
}
