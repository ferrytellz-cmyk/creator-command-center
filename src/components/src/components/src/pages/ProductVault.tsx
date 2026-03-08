// src/pages/ProductVault.tsx
import React, { useState } from 'react';
import type { Product } from '../types';
import { CATEGORIES, STATUSES, TAGS } from '../lib/constants';
import { generateId, now } from '../lib/db';
import {
  Badge, TagBadge, FieldGroup, Input, Textarea, Select, MultiSelect,
  Modal, SaveButton, CancelButton, IconButton,
} from '../components/ui';

function empty(): Product {
  return {
    id: generateId(), name: '', category: '', status: 'Idea', price: '',
    description: '', targetAudience: '', fileLocation: '', tags: [],
    notes: '', dateCreated: new Date().toISOString().split('T')[0],
    createdAt: now(), updatedAt: now(),
  };
}

function ProductForm({ initial, onSave, onClose }: {
  initial?: Product; onSave: (p: Product) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<Product>(initial ?? empty());
  const set = <K extends keyof Product>(k: K) => (v: Product[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <FieldGroup label="Product Name *">
        <Input value={form.name} onChange={e => set('name')(e.target.value)} placeholder="e.g. Notion Business Planner 2025" />
      </FieldGroup>

      <div className="form-grid-2">
        <FieldGroup label="Category">
          <Select value={form.category} onChange={e => set('category')(e.target.value as any)} options={CATEGORIES} />
        </FieldGroup>
        <FieldGroup label="Status">
          <Select value={form.status} onChange={e => set('status')(e.target.value as any)} options={STATUSES} />
        </FieldGroup>
      </div>

      <div className="form-grid-2">
        <FieldGroup label="Price (USD)">
          <Input type="number" value={form.price} onChange={e => set('price')(e.target.value)} placeholder="17" />
        </FieldGroup>
        <FieldGroup label="Date Created">
          <Input type="date" value={form.dateCreated} onChange={e => set('dateCreated')(e.target.value)} />
        </FieldGroup>
      </div>

      <FieldGroup label="Description" hint="Can be copy-pasted to your Gumroad listing">
        <Textarea value={form.description} onChange={e => set('description')(e.target.value)} placeholder="Describe your template and what problem it solves..." rows={3} />
      </FieldGroup>

      <FieldGroup label="Target Audience">
        <Input value={form.targetAudience} onChange={e => set('targetAudience')(e.target.value)} placeholder="e.g. solopreneurs who want to manage projects" />
      </FieldGroup>

      <FieldGroup label="File Location (URL)" hint="Link to your Google Drive or Dropbox folder">
        <Input value={form.fileLocation} onChange={e => set('fileLocation')(e.target.value)} placeholder="https://drive.google.com/..." />
      </FieldGroup>

      <FieldGroup label="Tags">
        <MultiSelect selected={form.tags} onChange={set('tags')} options={TAGS} placeholder="Select relevant tags..." />
      </FieldGroup>

      <FieldGroup label="Notes">
        <Textarea value={form.notes} onChange={e => set('notes')(e.target.value)} placeholder="Private notes, v2 ideas, buyer feedback..." rows={2} />
      </FieldGroup>

      <div className="form-actions">
        <CancelButton onClick={onClose} />
        <SaveButton onClick={() => { if (form.name.trim()) { onSave(form); onClose(); } }} />
      </div>
    </>
  );
}

function ProductCard({ product, onEdit, onDelete }: {
  product: Product; onEdit: (p: Product) => void; onDelete: (id: string) => void;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{product.name}</div>
        <div className="card-actions">
          <IconButton onClick={() => onEdit(product)}>Edit</IconButton>
          <IconButton onClick={() => onDelete(product.id)} variant="danger">Del</IconButton>
        </div>
      </div>

      <div className="badge-row">
        <Badge label={product.status} />
        {product.category && <Badge label={product.category} />}
        {product.price && <span className="price-badge">${product.price}</span>}
      </div>

      {product.description && (
        <p className="card-description">{product.description.slice(0, 120)}{product.description.length > 120 ? '…' : ''}</p>
      )}

      {product.tags.length > 0 && (
        <div className="tag-row">{product.tags.map(t => <TagBadge key={t} tag={t} />)}</div>
      )}

      {product.fileLocation && (
        <a href={product.fileLocation} target="_blank" rel="noreferrer" className="card-link">📁 View Files →</a>
      )}
    </div>
  );
}

export function ProductVault({ products, onSave, onDelete }: {
  products: Product[];
  onSave: (p: Product) => void;
  onDelete: (id: string) => void;
}) {
  const [modal, setModal] = useState<{ item?: Product } | null>(null);

  return (
    <>
      <button className="btn btn-primary btn-add" onClick={() => setModal({})}>+ Add Product</button>

      {products.length === 0
        ? <div className="empty-state"><span>📦</span><p>No products yet. Click + Add Product to get started.</p></div>
        : <div className="card-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p}
                onEdit={item => setModal({ item })}
                onDelete={onDelete}
              />
            ))}
          </div>
      }

      {modal && (
        <Modal title={modal.item ? 'Edit Product' : 'Add New Product'} onClose={() => setModal(null)}>
          <ProductForm initial={modal.item} onSave={onSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </>
  );
}
