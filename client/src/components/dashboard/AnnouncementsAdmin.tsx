'use client';

import { useEffect, useState } from 'react';
import { api, asArray } from '@/lib/api';
import { Spinner, EmptyState, Tag, Alert, inputStyle, neonButton } from '@/components/ui';

type A = { _id: string; title: string; description: string; pinned?: boolean; expiryDate?: string };
const empty = { title: '', description: '', pinned: false, expiryDate: '' };

export default function AnnouncementsAdmin() {
  const [items, setItems] = useState<A[] | null>(null);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api<A[]>('/api/announcements').then((d) => setItems(asArray(d))).catch(() => setItems([]));
  };

  useEffect(load, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      const body: any = {
        title: form.title,
        description: form.description,
        pinned: form.pinned,
      };
      if (form.expiryDate) body.expiryDate = form.expiryDate;

      if (editingId) {
        await api(`/api/announcements/${editingId}`, { method: 'PUT', body });
        setMsg('Announcement updated.');
      } else {
        await api('/api/announcements', { method: 'POST', body });
        setMsg('Announcement broadcast.');
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (items === null) return <Spinner label="Loading announcements" />;

  return (
    <div>
      <form onSubmit={submit} className="rounded-2xl p-7 mb-10 space-y-4" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(0,240,255,0.12)' }}>
        <h3 className="font-display text-lg font-bold" style={{ color: '#00f0ff' }}>
          {editingId ? '✎ Edit Announcement' : '+ Broadcast Announcement'}
        </h3>
        {msg && <Alert kind="success">{msg}</Alert>}
        {err && <Alert kind="error">{err}</Alert>}
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
        <textarea required rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 text-sm" style={{ color: 'rgba(226,232,240,0.7)' }}>
            <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
            📌 Pin
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: 'rgba(226,232,240,0.5)' }}>Expires:</span>
            <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
          </div>
          <button type="submit" className="rounded-lg px-8 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase ml-auto" style={neonButton(true)}>
            {editingId ? 'Save' : 'Broadcast'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(empty); setEditingId(null); }} className="rounded-lg px-6 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase" style={neonButton(false)}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <EmptyState message="No announcements yet" />
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div key={a._id} className="rounded-xl p-6 flex flex-wrap items-start justify-between gap-4" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div>
                <h4 className="font-display font-bold mb-1">
                  {a.pinned ? '📌 ' : ''}
                  {a.title}
                </h4>
                <p className="text-sm" style={{ color: 'rgba(226,232,240,0.6)' }}>{a.description}</p>
                {a.expiryDate && (
                  <p className="text-xs mt-2" style={{ color: 'rgba(255,179,107,0.8)' }}>
                    ⏳ expires {new Date(a.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingId(a._id);
                    setForm({
                      title: a.title,
                      description: a.description,
                      pinned: !!a.pinned,
                      expiryDate: a.expiryDate ? new Date(a.expiryDate).toISOString().slice(0, 10) : '',
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase"
                  style={neonButton(false)}
                >
                  Edit
                </button>
                <button
                  onClick={() => confirm('Delete announcement?') && api(`/api/announcements/${a._id}`, { method: 'DELETE' }).then(load)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase"
                  style={{ border: '1px solid rgba(255,90,90,0.4)', color: '#ff8c8c', background: 'rgba(255,60,60,0.06)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
