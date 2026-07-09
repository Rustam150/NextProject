'use client';

import { useEffect, useState } from 'react';
import { Store } from '@/lib/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [, setTick] = useState(0);

  useEffect(() => {
  Store.init();

  const handler = () => setTick((t) => t + 1);

  window.addEventListener('storage', handler);
  (window as any).__storeUpdate = handler;

  return () => {
    window.removeEventListener('storage', handler);
    delete (window as any).__storeUpdate;
  };
}, []);

  return <>{children}</>;
}