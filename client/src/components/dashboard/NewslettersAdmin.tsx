'use client';

import { useEffect, useState } from 'react';
import { api, imageUrl } from '@/lib/api';
import { Spinner, EmptyState, Tag, Alert, inputStyle, neonButton } from '@/components/ui';

type N = {
  _id: string;
  title: string;
  summary?: string;
  content?: string;
  coverImage?: string;
  editionDate?: string;
  published?: boolean;
};

const empty = { title: '', summary: '', content: '', editionDate: '', published: true };

export default function NewslettersAdmin() {
  const [items, setItems] = useState<N[] | null>(null);
  const [form, setForm] = useState(empty);
  const [cover, setCover] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api<N[]>('/api/newsletters').then(setItems).catch(() => setItems([]));
  };

  useEffect(load, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('summary', form.summary);
      fd.append(
        'content',
        `<p>${form.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
      );
      fd.append('published', String(form.published));
      if (form.editionDate) fd.append('editionDate', form.editionDate);
      if (cover) fd.append('coverImage', cover);

      if (editingId) {
        await api(`/api/newsletters/${editingId}`, { method: 'PUT', body: fd });
        setMsg('Newsletter updated.');
      } else {
        await api('/api/newsletters', { method: 'POST', body: fd });
        setMsg('Newsletter published.');
      }
      setForm(empty);
      setCover(null);
      setEditingId(null);
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (items === null) return <Spinner label="Loading newsletters" />;

  return (
    <div>
      <form onSubmit={submit} className="rounded-2xl p-7 mb-10 space-y-4" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(162,0,255,0.2)' }}>
        <h3 className="font-display text-lg font-bold" style={{ color: '#c98cff' }}>
          {editingId ? '✎ Edit Newsletter' : '+ New Newsletter'}
        </h3>
        {msg && <Alert kind="success">{msg}</Alert>}
        {err && <Alert kind="error">{err}</Alert>}
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
        <input placeholder="Summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="date" value={form.editionDate} onChange={(e) => setForm({ ...form, editionDate: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle} />
          <label className="flex items-center gap-2 text-sm px-2" style={{ color: 'rgba(226,232,240,0.7)' }}>
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
        </div>
        <textarea required rows={8} placeholder="Newsletter content…" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm leading-relaxed outline-none focus:border-[#00f0ff]" style={inputStyle} />
        <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} className="w-full rounded-lg px-4 py-3 text-sm" style={{ ...inputStyle, color: '#9beaff' }} />
        <div className="flex gap-3">
          <button type="submit" className="rounded-lg px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase" style={neonButton(true)}>
            {editingId ? 'Save Changes' : 'Publish'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(empty); setEditingId(null); }} className="rounded-lg px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase" style={neonButton(false)}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <EmptyState message="No newsletters yet" />
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n._id} className="rounded-xl p-5 flex flex-wrap items-center justify-between gap-4" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(162,0,255,0.15)' }}>
              <div>
                <h4 className="font-display font-bold">{n.title}</h4>
                <p className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>
                  {n.editionDate ? `🗓 ${new Date(n.editionDate).toLocaleDateString()} · ` : ''}
                  {(n.content ?? '').replace(/<[^>]+>/g, '').slice(0, 80)}…
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!n.published && <Tag>draft</Tag>}
                <button
                  onClick={() => {
                    setEditingId(n._id);
                    setForm({
                      title: n.title,
                      summary: n.summary ?? '',
                      content: (n.content ?? '').replace(/<br\s*\/?>/g, '\n').replace(/<\/p>\s*<p>/g, '\n\n').replace(/<[^>]+>/g, ''),
                      editionDate: n.editionDate ? new Date(n.editionDate).toISOString().slice(0, 10) : '',
                      published: n.published ?? false,
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase"
                  style={neonButton(false)}
                >
                  Edit
                </button>
                <button
                  onClick={() => confirm('Delete newsletter?') && api(`/api/newsletters/${n._id}`, { method: 'DELETE' }).then(load)}
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
