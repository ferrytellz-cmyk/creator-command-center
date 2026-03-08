// src/pages/RevenueTracker.tsx
import React, { useState } from 'react';
import type { RevenueEntry, Product } from '../types';
import { PERIODS } from '../lib/constants';
import { generateId, now } from '../lib/db';
import {
  FieldGroup, Input, Textarea, Select,
  Modal, SaveButton, CancelButton, IconButton,
} from '../components/ui';

function empty(): RevenueEntry {
  return {
    id: generateId(), name: '', productId: '',
    date: new Date().toISOString().split('T')[0],
    unitsSold: '', revenue: '', platformFee: '',
    period: 'Weekly', notes: '', createdAt: now(), updatedAt: now(),
  };
}

function calcNet(revenue: string, fee: string): string | null {
  const r = parseFloat(revenue);
  const f = parseFloat(fee);
  if (isNaN(r)) return null;
  return (r - (isNaN(f) ? 0 : f)).toFixed(2);
}

function RevenueForm({ initial, products, onSave, onClose }: {
  initial?: RevenueEntry; products: Product[];
  onSave: (r: RevenueEntry) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<RevenueEntry>(initial ?? empty());
  const set = <K extends keyof RevenueEntry>(k: K) => (v: RevenueEntry[K]) => setForm(f => ({ ...f, [k]: v }));
  const net = calcNet(form.revenue, form.platformFee);

  return (
    <>
      <FieldGroup label="Entry Name *" hint='e.g. "Notion Planner – Jan Week 1"'>
        <Input value={form.name} onChange={e => set('name')(e.target.value)} placeholder="Product – Month Week" />
      </FieldGroup>

      <div className="form-grid-2">
        <FieldGroup label="Linked Product">
          <Select value={form.productId} onChange={e => set('productId')(e.target.value)} options={products.map(p => p.name)} placeholder="Link to product..." />
        </FieldGroup>
        <FieldGroup label="Period">
          <Select value={form.period} onChange={e => set('period')(e.target.value as any)} options={PERIODS} />
        </FieldGroup>
      </div>

      <div className="form-grid-3">
        <FieldGroup label="Date">
          <Input type="date" value={form.date} onChange={e => set('date')(e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Units Sold">
          <Input type="number" value={form.unitsSold} onChange={e => set('unitsSold')(e.target.value)} placeholder="12" />
        </FieldGroup>
        <FieldGroup label="Revenue (USD)">
          <Input type="number" value={form.revenue} onChange={e => set('revenue')(e.target.value)} placeholder="204.00" />
        </FieldGroup>
      </div>

      <div className="form-grid-2">
        <FieldGroup label="Platform Fee (~10%)" hint="Gumroad's cut">
          <Input type="number" value={form.platformFee} onChange={e => set('platformFee')(e.target.value)} placeholder="20.40" />
        </FieldGroup>
        <FieldGroup label="Net Revenue (auto-calculated)">
          <div className="net-revenue-display">{net ? `$${net}` : '—'}</div>
        </FieldGroup>
      </div>

      <FieldGroup label="Notes">
        <Textarea value={form.notes} onChange={e => set('notes')(e.target.value)} placeholder="Promo code used, traffic spike, sale event..." rows={2} />
      </FieldGroup>

      <div className="form-actions">
        <CancelButton onClick={onClose} />
        <SaveButton onClick={() => { if (form.name.trim()) { onSave(form); onClose(); } }} />
      </div>
    </>
  );
}

function RevenueCard({ entry, onEdit, onDelete }: {
  entry: RevenueEntry; onEdit: (e: RevenueEntry) => void; onDelete: (id: string) => void;
}) {
  const net = calcNet(entry.revenue, entry.platformFee);
  return (
    <div className="card card-revenue">
      <div className="card-header">
        <div className="card-title">{entry.name}</div>
        <div className="card-actions">
          <IconButton onClick={() => onEdit(entry)}>Edit</IconButton>
          <IconButton onClick={() => onDelete(entry.id)} variant="danger">Del</IconButton>
        </div>
      </div>
      <div className="revenue-stats">
        {entry.unitsSold && <span className="rev-meta">🛒 {entry.unitsSold} units</span>}
        {entry.revenue   && <span className="rev-gross">${entry.revenue}</span>}
        {net             && <span className="rev-net">net ${net}</span>}
        {entry.date      && <span className="rev-meta">{entry.date}</span>}
      </div>
      {entry.notes && <p className="card-description">{entry.notes}</p>}
    </div>
  );
}

export function RevenueTracker({ revenue, products, onSave, onDelete }: {
  revenue: RevenueEntry[]; products: Product[];
  onSave: (r: RevenueEntry) => void; onDelete: (id: string) => void;
}) {
  const [modal, setModal] = useState<{ item?: RevenueEntry } | null>(null);
  const total = revenue.reduce((s, r) => s + (parseFloat(r.revenue) || 0), 0);

  return (
    <>
      <div className="toolbar">
        <button className="btn btn-primary btn-add" onClick={() => setModal({})}>+ Log Revenue</button>
        {revenue.length > 0 && (
          <div className="total-revenue-pill">Total logged: <strong>${total.toFixed(2)}</strong></div>
        )}
      </div>

      {revenue.length === 0
        ? <div className="empty-state"><span>💰</span><p>No revenue entries yet. Log your first sale to start tracking.</p></div>
        : <div className="card-grid">
            {revenue.map(r => (
              <RevenueCard key={r.id} entry={r}
                onEdit={item => setModal({ item })}
                onDelete={onDelete}
              />
            ))}
          </div>
      }

      {modal && (
        <Modal title={modal.item ? 'Edit Revenue Entry' : 'Log Revenue Entry'} onClose={() => setModal(null)}>
          <RevenueForm initial={modal.item} products={products} onSave={onSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </>
  );
}
