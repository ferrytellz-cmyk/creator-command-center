// src/pages/GumroadListings.tsx
import React, { useState } from 'react';
import type { Listing, Product } from '../types';
import { LISTING_STATUSES } from '../lib/constants';
import { generateId, now } from '../lib/db';
import {
  Badge, FieldGroup, Input, Textarea, Select, Checkbox,
  Modal, SaveButton, CancelButton, IconButton,
} from '../components/ui';

function empty(): Listing {
  return {
    id: generateId(), name: '', productId: '', gumroadUrl: '', status: 'Draft',
    price: '', thumbnailReady: false, seoTitle: '', seoDescription: '',
    datePublished: '', totalSales: '', lastUpdated: new Date().toISOString().split('T')[0],
    notes: '', createdAt: now(), updatedAt: now(),
  };
}

function ListingForm({ initial, products, onSave, onClose }: {
  initial?: Listing; products: Product[]; onSave: (l: Listing) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<Listing>(initial ?? empty());
  const set = <K extends keyof Listing>(k: K) => (v: Listing[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <FieldGroup label="Listing Name *">
        <Input value={form.name} onChange={e => set('name')(e.target.value)} placeholder="e.g. Notion Business Planner" />
      </FieldGroup>

      <div className="form-grid-2">
        <FieldGroup label="Linked Product" hint="From your Product Vault">
          <Select
            value={form.productId}
            onChange={e => set('productId')(e.target.value)}
            options={products.map(p => p.name)}
            placeholder="Link to product..."
          />
        </FieldGroup>
        <FieldGroup label="Listing Status">
          <Select value={form.status} onChange={e => set('status')(e.target.value as any)} options={LISTING_STATUSES} />
        </FieldGroup>
      </div>

      <FieldGroup label="Gumroad URL" hint="The public link to this product on Gumroad">
        <Input value={form.gumroadUrl} onChange={e => set('gumroadUrl')(e.target.value)} placeholder="https://gumroad.com/l/..." />
      </FieldGroup>

      <div className="form-grid-2">
        <FieldGroup label="Price (USD)">
          <Input type="number" value={form.price} onChange={e => set('price')(e.target.value)} placeholder="17" />
        </FieldGroup>
        <FieldGroup label="Date Published">
          <Input type="date" value={form.datePublished} onChange={e => set('datePublished')(e.target.value)} />
        </FieldGroup>
      </div>

      <FieldGroup label="SEO Title" hint="Keyword-optimised title for Gumroad search">
        <Input value={form.seoTitle} onChange={e => set('seoTitle')(e.target.value)} placeholder="Best Notion Business Planner for Entrepreneurs 2025" />
      </FieldGroup>

      <FieldGroup label="SEO Description">
        <Textarea value={form.seoDescription} onChange={e => set('seoDescription')(e.target.value)} placeholder="Short blurb buyers see in search results..." rows={2} />
      </FieldGroup>

      <div className="form-grid-2">
        <FieldGroup label="Total Sales" hint="Update from Gumroad analytics">
          <Input type="number" value={form.totalSales} onChange={e => set('totalSales')(e.target.value)} placeholder="0" />
        </FieldGroup>
        <FieldGroup label="Last Updated">
          <Input type="date" value={form.lastUpdated} onChange={e => set('lastUpdated')(e.target.value)} />
        </FieldGroup>
      </div>

      <FieldGroup label="Thumbnail Ready?">
        <Checkbox
          checked={form.thumbnailReady}
          onChange={set('thumbnailReady')}
          label="Cover image is uploaded and looks great on Gumroad"
        />
      </FieldGroup>

      <FieldGroup label="Notes">
        <Textarea value={form.notes} onChange={e => set('notes')(e.target.value)} placeholder="Things to improve, buyer questions to address..." rows={2} />
      </FieldGroup>

      <div className="form-actions">
        <CancelButton onClick={onClose} />
        <SaveButton onClick={() => { if (form.name.trim()) { onSave(form); onClose(); } }} />
      </div>
    </>
  );
}

function ListingCard({ listing, onEdit, onDelete }: {
  listing: Listing; onEdit: (l: Listing) => void; onDelete: (id: string) => void;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{listing.name}</div>
        <div className="card-actions">
          <IconButton onClick={() => onEdit(listing)}>Edit</IconButton>
          <IconButton onClick={() => onDelete(listing.id)} variant="danger">Del</IconButton>
        </div>
      </div>

      <div className="badge-row">
        <Badge label={listing.status} />
        {listing.price && <span className="price-badge">${listing.price}</span>}
        <Badge label={listing.thumbnailReady ? '✓ Thumbnail' : '⚠ No Thumbnail'} />
      </div>

      <div className="card-meta">
        {listing.totalSales && <span>🛒 {listing.totalSales} sales</span>}
        {listing.datePublished && <span>📅 {listing.datePublished}</span>}
      </div>

      {listing.gumroadUrl && (
        <a href={listing.gumroadUrl} target="_blank" rel="noreferrer" className="card-link">🔗 View on Gumroad →</a>
      )}
    </div>
  );
}

export function GumroadListings({ listings, products, onSave, onDelete }: {
  listings: Listing[]; products: Product[];
  onSave: (l: Listing) => void; onDelete: (id: string) => void;
}) {
  const [modal, setModal] = useState<{ item?: Listing } | null>(null);

  return (
    <>
      <button className="btn btn-primary btn-add" onClick={() => setModal({})}>+ Add Listing</button>

      {listings.length === 0
        ? <div className="empty-state"><span>🛒</span><p>No listings yet. Click + Add Listing to track your Gumroad products.</p></div>
        : <div className="card-grid">
            {listings.map(l => (
              <ListingCard key={l.id} listing={l}
                onEdit={item => setModal({ item })}
                onDelete={onDelete}
              />
            ))}
          </div>
      }

      {modal && (
        <Modal title={modal.item ? 'Edit Listing' : 'Add New Gumroad Listing'} onClose={() => setModal(null)}>
          <ListingForm initial={modal.item} products={products} onSave={onSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </>
  );
}
