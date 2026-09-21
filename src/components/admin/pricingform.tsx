'use client';
import React, { useState } from 'react';
import { PricingConfig } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Printer, FileEdit, BookOpen } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function PricingForm({ initialPricing }: { initialPricing: PricingConfig }) {
  const [pricing, setPricing] = useState<PricingConfig>(initialPricing);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: keyof PricingConfig, val: string) => {
    const num = parseFloat(val) || 0;
    setPricing((prev) => ({ ...prev, [key]: num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricing),
      });
      if (res.ok) {
        toast({
          title: 'PRD Rates Saved & Published',
          description: 'New rate cards are now active across all student service forms.',
        });
      } else {
        toast({ title: 'Error', description: 'Could not update pricing', variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Xerox Rates */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Printer className="h-5 w-5 text-indigo-600" />
            1. Xerox & Document Printing Rates
          </CardTitle>
          <CardDescription>
            Photocopy and document print rates with optional Sunday express surcharge.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              B&W Print (₹ / page)
            </label>
            <Input
              type="number"
              step="0.5"
              value={pricing.bwPerPage ?? 1}
              onChange={(e) => handleChange('bwPerPage', e.target.value)}
              className="text-xs"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">Default: ₹1.00</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Colour Print (₹ / page)
            </label>
            <Input
              type="number"
              step="0.5"
              value={pricing.colorPerPage ?? 5}
              onChange={(e) => handleChange('colorPerPage', e.target.value)}
              className="text-xs"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">Default: ₹5.00</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Xerox Hostel Delivery (₹)
            </label>
            <Input
              type="number"
              step="1"
              value={pricing.deliveryFee ?? 20}
              onChange={(e) => handleChange('deliveryFee', e.target.value)}
              className="text-xs"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">Default: ₹20 (Free for counter pickup)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Sunday Surcharge (₹)
            </label>
            <Input
              type="number"
              step="1"
              value={pricing.xeroxSundaySurcharge ?? 20}
              onChange={(e) => handleChange('xeroxSundaySurcharge', e.target.value)}
              className="text-xs"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">Default: ₹20 (Xerox only)</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Assignment Rates */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-purple-600" />
            2. Assignment Service Rates
          </CardTitle>
          <CardDescription>
            Normal vs 24h Emergency assignments (Hostel delivery is free for all assignments).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Normal Assignment (₹ / unit)
            </label>
            <Input
              type="number"
              step="1"
              value={pricing.assignmentNormalPrice ?? 30}
              onChange={(e) => handleChange('assignmentNormalPrice', e.target.value)}
              className="text-xs"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">Default: ₹30.00</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Emergency 24h Assignment (₹ / unit)
            </label>
            <Input
              type="number"
              step="1"
              value={pricing.assignmentEmergencyPrice ?? 40}
              onChange={(e) => handleChange('assignmentEmergencyPrice', e.target.value)}
              className="text-xs"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">Default: ₹40.00</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Assignment Hostel Delivery
            </label>
            <div className="h-9 px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-xs font-bold text-emerald-600">
              FREE (₹0.00)
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Free delivery mandate per PRD</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Manual / Record Rates */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            3. Lab Manual & Record Service Rates
          </CardTitle>
          <CardDescription>
            Per practical rate, single-night emergency per page, and scientific diagrams.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Normal Manual (₹ / practical)
            </label>
            <Input
              type="number"
              step="1"
              value={pricing.manualNormalPerPractical ?? 25}
              onChange={(e) => handleChange('manualNormalPerPractical', e.target.value)}
              className="text-xs"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">Default: ₹25.00</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Emergency Single Night (₹ / practical)
            </label>
            <Input
              type="number"
              step="1"
              value={pricing.manualEmergencyPerPage ?? 30}
              onChange={(e) => handleChange('manualEmergencyPerPage', e.target.value)}
              className="text-xs"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">Default: ₹30.00 / practical</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Normal Diagram Add-on (₹ each)
            </label>
            <Input
              type="number"
              step="1"
              value={pricing.manualNormalDiagram ?? 10}
              onChange={(e) => handleChange('manualNormalDiagram', e.target.value)}
              className="text-xs"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">Default: +₹10.00</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Medical Diagram Add-on (₹ each)
            </label>
            <Input
              type="number"
              step="5"
              value={pricing.manualMedicalDiagram ?? 50}
              onChange={(e) => handleChange('manualMedicalDiagram', e.target.value)}
              className="text-xs"
            />
            <span className="text-[11px] text-zinc-400 mt-1 block">Default: +₹50.00</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPricing(initialPricing)}
            className="gap-2 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          <Button type="submit" disabled={isSaving} className="gap-2 text-xs">
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save & Publish Rates'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
