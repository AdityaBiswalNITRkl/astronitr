'use client';

import { useEffect, useState } from 'react';
import { api, asArray, imageUrl } from '@/lib/api';
import { Spinner, EmptyState, Tag, Alert, inputStyle, neonButton } from '@/components/ui';

type Item = { _id: string; title: string; description?: string; image: string; isApproved?: boolean };

export default function GalleryAdmin() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [image, setImage] = useState<File | null>(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api<Item[]>('/api/gallery/all')
      .then((d) => setItems(asArray(d)))
      .catch(() => api<Item[]>('/api/gallery').then((d) => setItems(asArray(d))).catch(() => setItems([])));
  };

  useEffect(load, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    setErr('');
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('image', image);
      await api('/api/gallery', { method: 'POST', body: fd });
      setMsg('Image uploaded.');
      setForm({ title: '', description: '' });
      setImage(null);
      (e.target as HTMLFormElement).reset();
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const act = async (fn: () => Promise<any>, ok: string) => {
    setErr('');
    try {
      await fn();
      setMsg(ok);
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (items === null) return <Spinner label="Loading gallery" />;

  return (
    <div>
      <form onSubmit={submit} className="rounded-2xl p-7 mb-10 space-y-4" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(0,240,255,0.12)' }}>
        <h3 className="font-display text-lg font-bold" style={{ color: '#00f0ff' }}>+ Upload Image</h3>
        {msg && <Alert kind="success">{msg}</Alert>}
        {err && <Alert kind="error">{err}</Alert>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
        </div>
        <input required type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="w-full rounded-lg px-4 py-3 text-sm" style={{ ...inputStyle, color: '#9beaff' }} />
        <button type="submit" className="rounded-lg px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase" style={neonButton(true)}>
          Upload
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState message="No images yet" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((g) => (
            <div key={g._id} className="rounded-xl overflow-hidden relative group" style={{ border: '1px solid rgba(0,240,255,0.1)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(g.image)} alt={g.title} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold truncate">{g.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <Tag>{g.isApproved ? 'approved' : 'pending'}</Tag>
                  <div className="flex gap-1">
                    {!g.isApproved && (
                      <button onClick={() => act(() => api(`/api/gallery/${g._id}/approve`, { method: 'PATCH' }), 'Approved.')} className="text-xs px-2 py-1 rounded" style={{ color: '#00f0ff', background: 'rgba(0,240,255,0.08)' }}>
                        ✓
                      </button>
                    )}
                    <button onClick={() => confirm('Delete this image?') && act(() => api(`/api/gallery/${g._id}`, { method: 'DELETE' }), 'Deleted.')} className="text-xs px-2 py-1 rounded" style={{ color: '#ff8c8c', background: 'rgba(255,60,60,0.06)' }}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
