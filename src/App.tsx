// src/App.tsx
import React, { useState } from 'react';
import { useStore } from './hooks/useStore';
import { StatsBar } from './components/StatsBar';
import { ProductVault } from './pages/ProductVault';
import { GumroadListings } from './pages/GumroadListings';
import { RevenueTracker } from './pages/RevenueTracker';
import { LaunchPlanner } from './pages/LaunchPlanner';
import { TABS } from './lib/constants';
import type { TabId } from './types';
import './styles.css';

export default function App() {
  const { data, upsert, remove, stats, savedAt } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>('products');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filterData = <T extends { name: string; status?: string }>(items: T[]) =>
    items.filter(item => {
      const matchSearch = !search || JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || item.status === filterStatus;
      return matchSearch && matchStatus;
    });

  const tabStatusOptions: Record<TabId, string[]> = {
    products: ['Idea', 'In Progress', 'Ready', 'Live', 'Archived'],
    listings: ['Draft', 'Published', 'Unpublished', 'Deleted'],
    revenue:  ['Daily', 'Weekly', 'Monthly'],
    launches: ['Planning', 'Active', 'Complete', 'Paused'],
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <span className="header-eyebrow">Gumroad Business Hub</span>
          <h1 className="header-title">Digital Template Shop</h1>
        </div>
        <div className="header-right">
          {savedAt && <span className="saved-indicator">✓ Saved</span>}
          <div className="header-pill">100+ Products Ready</div>
        </div>
      </header>

      <main className="main">
        <StatsBar stats={stats} />

        {/* Tab Navigation */}
        <nav className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.id); setFilterStatus(''); setSearch(''); }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="tab-count">{data[tab.id].length}</span>
            </button>
          ))}
        </nav>

        {/* Search + Filter Toolbar */}
        <div className="search-bar">
          <input
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search all fields…"
          />
          <select
            className="filter-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {tabStatusOptions[activeTab].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="record-count">
            {filterData(data[activeTab] as any[]).length} record{filterData(data[activeTab] as any[]).length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Active Tab Content */}
        <div className="tab-content">
          {activeTab === 'products' && (
            <ProductVault
              products={filterData(data.products)}
              onSave={p => upsert('products', p)}
              onDelete={id => remove('products', id)}
            />
          )}
          {activeTab === 'listings' && (
            <GumroadListings
              listings={filterData(data.listings)}
              products={data.products}
              onSave={l => upsert('listings', l)}
              onDelete={id => remove('listings', id)}
            />
          )}
          {activeTab === 'revenue' && (
            <RevenueTracker
              revenue={filterData(data.revenue)}
              products={data.products}
              onSave={r => upsert('revenue', r)}
              onDelete={id => remove('revenue', id)}
            />
          )}
          {activeTab === 'launches' && (
            <LaunchPlanner
              launches={filterData(data.launches)}
              products={data.products}
              onSave={l => upsert('launches', l)}
              onDelete={id => remove('launches', id)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
