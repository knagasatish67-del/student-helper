'use client';
import { useEffect, useState } from 'react';
import { socketEmitter } from '@/lib/socket';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    setIsConnected(true);
  }, []);

  const emit = (event: string, data: any) => {
    socketEmitter.emit(event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    return socketEmitter.on(event, callback);
  };

  return { isConnected, emit, on };
}
