'use client';
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/adminlayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings, Save, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    shopName: 'Student Helper Campus Print Shop',
    counterLocation: 'Counter 1, Student Activity Center, Ground Floor (Opp. Library)',
    phone: '+91 98765 43210',
    email: 'print@studenthelper.com',
    openHours: 'Mon - Sat: 8:00 AM - 9:00 PM',
    isOnline: true,
    announcement: 'Final Exam rush hours active: Orders placed before 4:00 PM ready same day!',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast({ title: 'Settings Saved', description: 'Shop details published successfully.' });
      } else {
        toast({ title: 'Error', description: 'Could not update settings', variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Settings className="h-6 w-6 text-indigo-600" />
            Print Shop Settings & Profile
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your physical campus counter location, hours, contact information, and public announcements.
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-sm text-zinc-500">Loading settings...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-base">Counter & Business Information</CardTitle>
                <CardDescription>
                  These details appear on student invoices, receipts, and order pickup notices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Print Shop Name
                    </label>
                    <Input
                      value={settings.shopName}
                      onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Counter Phone Number
                    </label>
                    <Input
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Physical Campus Pickup Location
                  </label>
                  <Input
                    value={settings.counterLocation}
                    onChange={(e) => setSettings({ ...settings, counterLocation: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Contact Email
                    </label>
                    <Input
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Daily Operating Hours
                    </label>
                    <Input
                      value={settings.openHours}
                      onChange={(e) => setSettings({ ...settings, openHours: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Campus Announcement Banner
                  </label>
                  <textarea
                    rows={2}
                    value={settings.announcement}
                    onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="online-toggle"
                    checked={settings.isOnline}
                    onChange={(e) => setSettings({ ...settings, isOnline: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
                  />
                  <label htmlFor="online-toggle" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Accept New Orders Online (Turn off during power cuts or maintenance)
                  </label>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <Button type="submit" disabled={saving} className="gap-2 text-xs font-semibold">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save & Publish'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
