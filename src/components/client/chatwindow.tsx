'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/usechat';
import { useAuth } from '@/components/providers/authprovider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, Shield, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

export interface ChatWindowProps {
  orderId: string;
  orderNumber?: string;
}

export function ChatWindow({ orderId, orderNumber }: ChatWindowProps) {
  const { user } = useAuth();
  const { messages, sendMessage } = useChat(orderId);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-[480px] rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-indigo-600" />
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
            {orderNumber ? `Chat for ${orderNumber}` : 'Order Direct Chat'}
          </span>
        </div>
        <span className="text-[11px] text-zinc-500">Live Campus Connect</span>
      </div>

      {/* Messages Feed */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-zinc-400">
            <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs font-medium">No messages yet</p>
            <p className="text-[11px]">Ask questions about paper type, binding, or pickup timings.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMine = msg.senderId === user?.id;
              const isAdmin = msg.senderRole === 'ADMIN';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-zinc-500">
                      {isMine ? 'You' : msg.senderName}
                    </span>
                    {isAdmin && (
                      <span className="flex items-center gap-0.5 text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-1.5 py-0.2 rounded-full font-medium">
                        <Shield className="h-2.5 w-2.5" /> Staff
                      </span>
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isMine
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-zinc-400 mt-1 px-1">
                    {msg.createdAt ? format(new Date(msg.createdAt), 'hh:mm a') : ''}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-zinc-200 p-3 dark:border-zinc-800 flex gap-2">
        <Input
          placeholder="Type message to print shop..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="text-xs h-9"
        />
        <Button type="submit" size="sm" className="h-9 px-3 gap-1">
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Send</span>
        </Button>
      </form>
    </div>
  );
}
