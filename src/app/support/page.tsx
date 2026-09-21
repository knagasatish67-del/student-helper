'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/client/navbar';
import { Footer } from '@/components/client/footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HelpCircle, Send, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function SupportPage() {
  const [inquiry, setInquiry] = useState('');
  const [email, setEmail] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.trim()) return;
    toast({ title: 'Message Sent', description: 'Our shop attendant will reply shortly!' });
    setInquiry('');
    setEmail('');
  };

  const faqs = [
    {
      q: 'How long does a standard xerox / print job take?',
      a: 'Most standard documents under 100 pages are printed and bound within 15–20 minutes of order confirmation. During peak exam hours, please allow 30–45 minutes.',
    },
    {
      q: 'Where do I collect my printed documents on campus?',
      a: 'Collect orders from Counter 1 inside the Student Activities & Services Center, directly opposite the Central Academic Library.',
    },
    {
      q: 'What file formats can I upload for printing?',
      a: 'We accept PDF, DOC, DOCX, PPT, PPTX, JPG, and PNG files up to 50MB each. PDF is strongly recommended to preserve exact fonts and margins.',
    },
    {
      q: 'What binding options are available for project reports?',
      a: 'We provide corner stapling (up to 60 pages), spiral wire binding with clear plastic protective front cover, and hardbound golden-embossed university project books.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white flex items-center justify-center gap-2.5">
              <HelpCircle className="h-8 w-8 text-indigo-600" />
              Campus Print Help & Support
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Need assistance with an active order, bulk syllabus printing, or special paper requirements?
            </p>
          </div>

          {/* Quick Inquiries */}
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
                Send Quick Inquiry to Shop Counter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSend} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Your Email or Phone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-xs"
                    required
                  />
                  <Input
                    placeholder="Related Order # (Optional, e.g. SH-1002)"
                    className="text-xs"
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Describe your query or custom printing requirement..."
                  value={inquiry}
                  onChange={(e) => setInquiry(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  required
                />
                <Button type="submit" size="sm" className="gap-2 text-xs">
                  <Send className="h-3.5 w-3.5" /> Submit Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQs */}
          <div>
            <h2 className="text-lg font-bold mb-4">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, i) => (
                <Card key={i} className="border-zinc-200 dark:border-zinc-800 p-4 text-xs">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">{faq.q}</h4>
                  <p className="text-zinc-500 leading-relaxed">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
