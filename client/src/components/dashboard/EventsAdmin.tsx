'use client';

import { useEffect, useState } from 'react';
import { api, imageUrl } from '@/lib/api';
import { Spinner, EmptyState, Tag, Alert, inputStyle, neonButton } from '@/components/ui';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  banner?: string;
  isApproved?: boolean;
};

const empty = { title: '', description: '', date: '', venue: '', category: 'Workshop' };

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [form, setForm] = useState(empty);
  const [banner, setBanner] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api<Event[]>('/api/events/all?includePending=true')
      .then(setEvents)
      .catch(() => api<Event[]>('/api/events').then(setEvents).catch(() => setEvents([])));
  };

  useEffect(load, []);

  const reset = () => {
    setForm(empty);
    setBanner(null);
    setEditingId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (banner) fd.append('banner', banner);

      if (editingId) {
        await api(`/api/events/${editingId}`, { method: 'PUT', body: fd });
        setMsg('Event updated.');
      } else {
        await api('/api/events', { method: 'POST', body: fd });
        setMsg('Event created (pending approval).');
      }
      reset();
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const act = async (fn: () => Promise<any>, okMsg: string) => {
    setErr('');
    try {
      await fn();
      setMsg(okMsg);
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (events === null) return <Spinner label="Loading events" />;

  return (
    <div>
      <form
        onSubmit={submit}
        className="rounded-2xl p-7 mb-10 space-y-4"
        style={{
          background: 'rgba(13,17,38,0.55)',
          border: '1px solid rgba(0,240,255,0.12)',
        }}
      >
        <h3 className="font-display text-lg font-bold" style={{ color: '#00f0ff' }}>
          {editingId ? '✎ Edit Event' : '+ Create Event'}
        </h3>
        {msg && <Alert kind="success">{msg}</Alert>}
        {err && <Alert kind="error">{err}</Alert>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <input required type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <input required placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none" style={inputStyle}>
            {['Workshop', 'Observation', 'Competition', 'Talk', 'Other'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <textarea required rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(226,232,240,0.5)' }}>
            Banner image
          </label>
          <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files?.[0] ?? null)} className="w-full rounded-lg px-4 py-3 text-sm" style={{ ...inputStyle, color: '#9beaff' }} />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="rounded-lg px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase" style={neonButton(true)}>
            {editingId ? 'Save Changes' : 'Create Event'}
          </button>
          {editingId && (
            <button type="button" onClick={reset} className="rounded-lg px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase" style={neonButton(false)}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {events.length === 0 ? (
        <EmptyState message="No events yet" />
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <div key={ev._id} className="rounded-xl p-5 flex flex-wrap items-center gap-5" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                {ev.banner ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl(ev.banner)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">🌠</span>
                )}
              </div>
              <div className="flex-1 min-w-[180px]">
                <h4 className="font-display font-bold">{ev.title}</h4>
                <p className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>
                  {new Date(ev.date).toLocaleString()} · 📍 {ev.venue}
                </p>
              </div>
              <Tag>{ev.isApproved ? 'approved' : 'pending'}</Tag>
              {!ev.isApproved && (
                <button onClick={() => act(() => api(`/api/events/${ev._id}/approve`, { method: 'PATCH' }), 'Event approved.')} className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase" style={neonButton(false)}>
                  Approve
                </button>
              )}
              <button
                onClick={() => {
                  setEditingId(ev._id);
                  setForm({
                    title: ev.title,
                    description: ev.description,
                    date: new Date(ev.date).toISOString().slice(0, 16),
                    venue: ev.venue,
                    category: ev.category,
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase"
                style={neonButton(false)}
              >
                Edit
              </button>
              <button
                onClick={() => confirm(`Delete "${ev.title}"?`) && act(() => api(`/api/events/${ev._id}`, { method: 'DELETE' }), 'Event deleted.')}
                className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase"
                style={{ border: '1px solid rgba(255,90,90,0.4)', color: '#ff8c8c', background: 'rgba(255,60,60,0.06)' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
