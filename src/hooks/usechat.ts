'use client';
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types';
import { useAuth } from '@/components/providers/authprovider';

export function useChat(orderId?: string) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = useCallback(async (isInitial = false) => {
    if (!orderId) return;
    try {
      if (isInitial) setIsLoading(true);
      const res = await fetch(`/api/chat/${orderId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Failed to load chat messages', e);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 4000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = async (content: string) => {
    if (!orderId || !content.trim()) return;
    const fallbackName = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
      ? 'Campus Xerox Admin'
      : 'Student';
    const fallbackRole = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
      ? 'ADMIN'
      : 'STUDENT';

    const senderName = user?.name || fallbackName;
    const senderRole = user?.role || fallbackRole;

    try {
      const res = await fetch(`/api/chat/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          content,
          senderName,
          senderRole,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setMessages((prev) => [...prev, data.message]);
        }
      }
    } catch (e) {
      console.error('Failed to send message', e);
    }
  };

  return { messages, sendMessage, isLoading, refetch: fetchMessages };
}
