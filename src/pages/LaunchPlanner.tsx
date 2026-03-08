// src/pages/LaunchPlanner.tsx
import React, { useState } from 'react';
import type { Launch, Product } from '../types';
import { LAUNCH_STATUSES, PLATFORMS } from '../lib/constants';
import { generateId, now } from '../lib/db';
import {
  Badge, TagBadge, FieldGroup, Input, Textarea, Select, MultiSelect, Checkbox,
  Modal, SaveButton, CancelButton, IconButton,
} from '../components/ui';

function empty(): Launch {
  return {
    id: generateId(), name: '', productId: '', launchDate: '', endDate: '',
    status: 'Planning', platforms: [], teaserDone: false, launchPostDone: false,
    followUpDone: false, goalUnits: '', actualUnits: '', promoCode: '',
    contentNotes: '', notes: '', createdAt: now(), updatedAt: now(),
  };
}

function LaunchForm({ initial, products, onSave, onClose }: {
  initial?: Launch; products: Product[];
  onSave: (l: Launch) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<Launch>(initial ?? empty());
  const set = <K extends keyof Launch>(k: K) => (v: Launch[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <FieldGroup label="Campaign Name *" hint='e.g. "Notion Planner Jan Launch"'>
        <Input value={form.name} onChange={e => set('name')(e.target.value)} placeholder="Product – Month Launch" />
      </FieldGroup>

      <div className="form-grid-2">
        <FieldGroup label="Linked Product">
          <Select value={form.productId} onChange={e => set('productId')(e.target.value)} options={products.map(p => p.name)} placeholder="Link to product..." />
        </FieldGroup>
        <FieldGroup label="Campaign Status">
          <Select value={form.status} onChange={e => set('status')(e.target.value as any)} options={LAUNCH_STATUSES} />
        </FieldGroup>
      </div>

      <div className="form-grid-2">
        <FieldGroup label="Launch Date">
          <Input type="date" value={form.launchDate} onChange={e => set('launchDate')(e.target.value)} />
        </FieldGroup>
        <FieldGroup label="End Date">
          <Input type="date" value={form.endDate} onChange={e => set('endDate')(e.target.value)} />
        </FieldGroup>
      </div>

      <FieldGroup label="Platforms to Post On">
        <MultiSelect selected={form.platforms} onChange={set('platforms')} options={PLATFORMS} placeholder="Select platforms..." />
      </FieldGroup>

      <div className="form-grid-3">
        <FieldGroup label="Goal (Units)">
          <Input type="number" value={form.goalUnits} onChange={e => set('goalUnits')(e.target.value)} placeholder="30" />
        </FieldGroup>
        <FieldGroup label="Actual Units Sold">
          <Input type="number" value={form.actualUnits} onChange={e => set('actualUnits')(e.target.value)} placeholder="Fill after campaign" />
        </FieldGroup>
        <FieldGroup label="Promo Code">
          <Input value={form.promoCode} onChange={e => set('promoCode')(e.target.value)} placeholder="LAUNCH20" />
        </FieldGroup>
      </div>

      <FieldGroup label="Post Checklist">
        <div className="checklist">
          <Checkbox checked={form.teaserDone} onChange={set('teaserDone')} label="Teaser / Coming Soon post published" />
          <Checkbox checked={form.launchPostDone} onChange={set('launchPostDone')} label="Main launch post is live" />
          <Checkbox checked={form.followUpDone} onChange={set('followUpDone')} label="Follow-up / reminder post published" />
        </div>
      </FieldGroup>

      <FieldGroup label="Content Notes" hint="Captions, hooks, hashtag ideas">
        <Textarea value={form.contentNotes} onChange={e => set('contentNotes')(e.target.value)} placeholder="Content braindump — captions, hooks, hashtags..." rows={3} />
      </FieldGroup>

      <FieldGroup label="Notes">
        <Textarea value={form.notes} onChange={e => set('notes')(e.target.value)} placeholder="Lessons learned, what worked, what to change..." rows={2} />
      </FieldGroup>

      <div className="form-actions">
        <CancelButton onClick={onClose} />
        <SaveButton onClick={() => { if (form.name.trim()) { onSave(form); onClose(); } }} />
      </div>
    </>
  );
}

function LaunchCard({ launch, onEdit, onDelete }: {
  launch: Launch; onEdit: (l: Launch) => void; onDelete: (id: string) => void;
}) {
  const checks = [launch.teaserDone, launch.launchPostDone, launch.followUpDone].filter(Boolean).length;
  return (
    <div className="card card-launch">
      <div className="card-header">
        <div className="card-title">{launch.name}</div>
        <div className="card-actions">
          <IconButton onClick={() => onEdit(launch)}>Edit</IconButton>
          <IconButton onClick={() => onDelete(launch.id)} variant="danger">Del</IconButton>
        </div>
      </div>

      <div className="badge-row">
        <Badge label={launch.status} />
        {launch.launchDate && <Badge label={`🗓 ${launch.launchDate}`} />}
        <Badge label={`Posts: ${checks}/3`} />
      </div>

      {launch.platforms.length > 0 && (
        <div className="tag-row">{launch.platforms.map(p => <TagBadge key={p} tag={p} />)}</div>
      )}

      {(launch.goalUnits || launch.actualUnits) && (
        <div className="card-meta">
          {launch.goalUnits   && <span>🎯 Goal: {launch.goalUnits} units</span>}
          {launch.actualUnits && <span className="actual-units">✓ Actual: {launch.actualUnits}</span>}
        </div>
      )}

      {launch.promoCode && <div className="promo-code">🏷 {launch.promoCode}</div>}
    </div>
  );
}

export function LaunchPlanner({ launches, products, onSave, onDelete }: {
  launches: Launch[]; products: Product[];
  onSave: (l: Launch) => void; onDelete: (id: string) => void;
}) {
  const [modal, setModal] = useState<{ item?: Launch } | null>(null);

  return (
    <>
      <button className="btn btn-primary btn-add" onClick={() => setModal({})}>+ New Campaign</button>

      {launches.length === 0
        ? <div className="empty-state"><span>🚀</span><p>No campaigns yet. Plan your first product launch!</p></div>
        : <div className="card-grid">
            {launches.map(l => (
              <LaunchCard key={l.id} launch={l}
                onEdit={item => setModal({ item })}
                onDelete={onDelete}
              />
            ))}
          </div>
      }

      {modal && (
        <Modal title={modal.item ? 'Edit Campaign' : 'New Launch Campaign'} onClose={() => setModal(null)}>
          <LaunchForm initial={modal.item} products={products} onSave={onSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </>
  );
}
