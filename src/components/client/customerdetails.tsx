'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Phone, Home, MapPin, Building } from 'lucide-react';

export interface CustomerDetails {
  name: string;
  phone: string;
  hostel: string;
  roomNumber: string;
  deliveryAddress: string;
  deliveryOption: 'HOSTEL' | 'PICKUP';
}

export interface CustomerDetailsSectionProps {
  details: CustomerDetails;
  onChange: (details: CustomerDetails) => void;
  serviceType: 'XEROX' | 'ASSIGNMENT' | 'MANUAL';
}

export function CustomerDetailsSection({
  details,
  onChange,
  serviceType,
}: CustomerDetailsSectionProps) {
  const updateField = (field: keyof CustomerDetails, value: any) => {
    onChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-600" />
          Customer & Delivery Details
        </CardTitle>
        <p className="text-xs text-zinc-500">
          Our service agent uses these contact and room details to deliver your order directly.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Delivery Option Toggle */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Collection Preference
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateField('deliveryOption', 'HOSTEL')}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                details.deliveryOption === 'HOSTEL'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs">
                <Home className="h-4 w-4 text-indigo-600" />
                Hostel Room Delivery
              </div>
              <span className="text-[11px] text-zinc-500 mt-1">
                {serviceType === 'XEROX'
                  ? 'Delivered to room (+₹20 delivery fee)'
                  : 'Delivered directly to room (FREE)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => updateField('deliveryOption', 'PICKUP')}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                details.deliveryOption === 'PICKUP'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs">
                <Building className="h-4 w-4 text-indigo-600" />
                Campus Counter Pickup
              </div>
              <span className="text-[11px] text-zinc-500 mt-1">
                Collect from Main Student Center (FREE)
              </span>
            </button>
          </div>
        </div>

        {/* Name and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="e.g. Alex Sharma"
                value={details.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Contact Number (WhatsApp) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="e.g. +91 98765 43210"
                value={details.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Hostel and Room Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Hostel / Residence <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Enter your hostel or residence name"
                value={details.hostel}
                onChange={(e) => updateField('hostel', e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Room Number / Block <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="e.g. Room 204, Block B"
                value={details.roomNumber}
                onChange={(e) => updateField('roomNumber', e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Delivery Address / Landmarks */}
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Delivery Details / Landmark (Optional)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="e.g. 2nd Floor, Near Water Cooler / Hand over to roommate"
              value={details.deliveryAddress}
              onChange={(e) => updateField('deliveryAddress', e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
