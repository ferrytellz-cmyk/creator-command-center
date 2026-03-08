// src/hooks/useStore.ts

import { useState, useEffect, useCallback } from 'react';
import type { AppData, Product, Listing, RevenueEntry, Launch } from '../types';
import { loadData, saveData, generateId, now } from '../lib/db';

type AnyRecord = Product | Listing | RevenueEntry | Launch;
type CollectionKey = keyof AppData;

export function useStore() {
  const [data, setData] = useState<AppData>(loadData);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Persist on every change
  useEffect(() => {
    saveData(data);
    setSavedAt(Date.now());
  }, [data]);

  const upsert = useCallback(<T extends AnyRecord>(key: CollectionKey, item: T) => {
    setData(prev => {
      const list = prev[key] as T[];
      const idx  = list.findIndex(x => x.id === item.id);
      const updated = { ...item, updatedAt: now() };
      return {
        ...prev,
        [key]: idx >= 0
          ? list.map(x => x.id === item.id ? updated : x)
          : [...list, updated],
      };
    });
  }, []);

  const remove = useCallback((key: CollectionKey, id: string) => {
    setData(prev => ({ ...prev, [key]: (prev[key] as AnyRecord[]).filter(x => x.id !== id) }));
  }, []);

  const create = useCallback(<T extends Omit<AnyRecord, 'id' | 'createdAt' | 'updatedAt'>>(
    key: CollectionKey,
    item: T
  ) => {
    const full = { ...item, id: generateId(), createdAt: now(), updatedAt: now() } as AnyRecord;
    setData(prev => ({ ...prev, [key]: [...(prev[key] as AnyRecord[]), full] }));
    return full;
  }, []);

  // Derived stats
  const stats = {
    liveProducts:    data.products.filter(p => p.status === 'Live').length,
    totalProducts:   data.products.length,
    publishedListings: data.listings.filter(l => l.status === 'Published').length,
    totalRevenue:    data.revenue.reduce((s, r) => s + (parseFloat(r.revenue) || 0), 0),
    netRevenue:      data.revenue.reduce((s, r) => s + ((parseFloat(r.revenue) || 0) - (parseFloat(r.platformFee) || 0)), 0),
    activeLaunches:  data.launches.filter(l => l.status === 'Active').length,
    totalLaunches:   data.launches.length,
  };

  return { data, upsert, remove, create, stats, savedAt };
}
