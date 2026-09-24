'use client';
import React, { useState, useEffect } from 'react';
import { Order } from '@/types';
import { useChat } from '@/hooks/usechat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export function ChatPanel({ orders }: { orders: Order[] }) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders[0]?.id || ''
  );

  useEffect(() => {
    if (orders.length > 0) {
      if (!selectedOrderId || !orders.some((o) => o.id === selectedOrderId)) {
        setSelectedOrderId(orders[0].id);
      }
    }
  }, [orders, selectedOrderId]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const activeId = selectedOrder?.id || selectedOrderId;
  const { messages, sendMessage } = useChat(activeId);
  const [text, setText] = useState('');

  const safeFormatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return format(d, 'hh:mm a');
    } catch {
      return '';
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-center">
        <MessageSquare className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mb-3" />
        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No Student Inquiries Yet</h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          When students place orders for Xerox, Assignments, or Lab Manuals, live customer conversations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs overflow-hidden h-[600px]">
      {/* Left List of Orders */}
      <div className="border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
        <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 font-semibold text-xs text-zinc-500 uppercase tracking-wider">
          Student Inquiries ({orders.length})
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {orders.map((order, idx) => {
              const isSelected = order.id === activeId;
              const studentName = order.customerName || order.user?.name || 'Student';
              return (
                <button
                  key={order.id ? `${order.id}-${idx}` : `chat-order-${idx}`}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>{order.orderNumber}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">
                        ({order.serviceType})
                      </span>
                    </div>
                    <div className="text-xs text-zinc-700 dark:text-zinc-300 truncate mt-0.5 font-medium">
                      {studentName}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {order.hostel ? `${order.hostel} ${order.roomNumber || ''}` : (order.user?.rollNumber || order.user?.college || 'Campus delivery')}
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                    {safeFormatTime(order.createdAt)}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right Chat Details & Messages */}
      <div className="md:col-span-2 flex flex-col h-full">
        {selectedOrder ? (
          <>
            {/* Chat header */}
            <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/40">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedOrder.customerName || selectedOrder.user?.name || 'Student'} — {selectedOrder.orderNumber}
                </h3>
                <p className="text-[10px] text-zinc-500">
                  {selectedOrder.customerPhone || selectedOrder.user?.phone || 'No phone'} • Status: {selectedOrder.status}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400 py-12">
                  <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-xs">No chat history for this order.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m, idx) => {
                    const isAdmin = m.senderRole === 'ADMIN';
                    return (
                      <div
                        key={m.id ? `${m.id}-${idx}` : `msg-${idx}`}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-zinc-400 mb-0.5 px-1 font-semibold">
                          {isAdmin ? 'You (Shop)' : m.senderName}
                        </span>
                        <div
                          className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                            isAdmin
                              ? 'bg-indigo-600 text-white rounded-br-xs'
                              : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 rounded-bl-xs'
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[9px] text-zinc-400 mt-0.5 px-1">
                          {safeFormatTime(m.createdAt)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Reply Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
              <Input
                placeholder="Reply to student regarding pickup/printing details..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="text-xs h-9"
              />
              <Button type="submit" size="sm" className="h-9 px-3 gap-1">
                <Send className="h-3.5 w-3.5" /> Send
              </Button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-zinc-400">
            Select an order to view chat
          </div>
        )}
      </div>
    </div>
  );
}
