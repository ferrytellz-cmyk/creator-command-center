// src/components/StatsBar.tsx
import React from 'react';

interface Stats {
  totalProducts: number;
  liveProducts: number;
  publishedListings: number;
  totalRevenue: number;
  netRevenue: number;
  activeLaunches: number;
  totalLaunches: number;
}

export function StatsBar({ stats }: { stats: Stats }) {
  const items = [
    { icon: '📦', label: 'Products',  value: stats.totalProducts,              sub: `${stats.liveProducts} live` },
    { icon: '🛒', label: 'Listings',  value: stats.publishedListings,           sub: 'published' },
    { icon: '💰', label: 'Revenue',   value: `$${stats.totalRevenue.toFixed(0)}`, sub: `$${stats.netRevenue.toFixed(0)} net` },
    { icon: '🚀', label: 'Launches',  value: stats.totalLaunches,              sub: `${stats.activeLaunches} active` },
  ];

  return (
    <div className="stats-bar">
      {items.map(s => (
        <div key={s.label} className="stat-card">
          <span className="stat-icon">{s.icon}</span>
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
          <span className="stat-sub">{s.sub}</span>
        </div>
      ))}
    </div>
  );
}
