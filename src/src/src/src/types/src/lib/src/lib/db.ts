// src/lib/db.ts
// Bolt-compatible local persistence layer using localStorage.
// Swap the read/write functions below for Bolt Database calls
// (e.g. db.collection) when you enable it in your Bolt project.

import type { AppData } from '../types';
import { STORAGE_KEY } from './constants';

const DEFAULT_DATA: AppData = {
  products: [],
  listings: [],
  revenue: [],
  launches: [],
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      products: parsed.products ?? [],
      listings: parsed.listings ?? [],
      revenue:  parsed.revenue  ?? [],
      launches: parsed.launches ?? [],
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[GumroadHub] Failed to save data:', err);
  }
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function now(): number {
  return Date.now();
}
