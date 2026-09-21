'use client';
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/adminlayout';
import { PricingForm } from '@/components/admin/pricingform';
import { PricingConfig } from '@/types';
import { DollarSign } from 'lucide-react';

const DEFAULT_PRICING: PricingConfig = {
  assignmentNormalPrice: 30,
  assignmentEmergencyPrice: 40,
  manualNormalPerPractical: 25,
  manualEmergencyPerPage: 30,
  manualNormalDiagram: 10,
  manualMedicalDiagram: 50,
  xeroxBwPerPage: 1,
  xeroxColorPerPage: 5,
  xeroxDeliveryFee: 20,
  xeroxSundaySurcharge: 20,
  bwPerPage: 1,
  colorPerPage: 5,
  deliveryFee: 20,
  spiralBinding: 20,
  hardBinding: 100,
  stapleBinding: 0,
  doubleSideDiscount: 0,
  manualRecordBook: 50,
  assignmentHandwrittenPerSheet: 30,
};

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPricing = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pricing');
      if (res.ok) {
        const data = await res.json();
        if (data.pricing) {
          setPricing(data.pricing);
          return;
        }
      }
      setPricing(DEFAULT_PRICING);
    } catch (e) {
      console.error('Pricing load error, using default rates', e);
      setPricing(DEFAULT_PRICING);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricing();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-indigo-600" />
            Pricing & Rate Cards
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Control photocopy charges per page, duplex discounts, binding types, and custom record books.
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-sm text-zinc-500">Loading pricing configuration...</div>
        ) : pricing ? (
          <PricingForm initialPricing={pricing} />
        ) : (
          <div>Failed to load pricing data.</div>
        )}
      </div>
    </AdminLayout>
  );
}
