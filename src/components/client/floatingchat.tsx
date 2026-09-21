'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, PhoneCall, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FloatingChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; sender: 'AGENT' | 'USER'; text: string; time: string }[]>([
    {
      id: 'msg-1',
      sender: 'AGENT',
      text: 'Hello! 👋 How can we help you with your Xerox, Assignment, or Lab Record today?',
      time: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  // Don't render inside admin portal
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'USER' as const,
      text: inputVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'AGENT',
          text: 'Our university service coordinator has received your message and will respond right away. For urgent queries, you can also reach us via the campus helpline.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 900);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-5 z-50">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-white shadow-xl hover:bg-indigo-700 active:scale-95 transition-all group"
            aria-label="Contact Customer Support"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="hidden sm:inline-block text-xs font-semibold">
              Live Support
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        ) : null}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-5 z-50 w-[92vw] sm:w-[380px] rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-indigo-600 px-4 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-xs">
                  UH
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-indigo-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-none">University Student Support</h4>
                <p className="text-[10px] text-indigo-100 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Online • Direct Offline Delivery
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white rounded-lg p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'USER' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 ${
                    m.sender === 'USER'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      m.sender === 'USER' ? 'text-indigo-200' : 'text-zinc-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2"
          >
            <Input
              type="text"
              placeholder="Ask about your order or rates..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="h-9 text-xs flex-1"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
