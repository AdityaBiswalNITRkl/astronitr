'use client';

import { useEffect, useState } from 'react';
import { api, imageUrl } from '@/lib/api';
import { Spinner, EmptyState, Tag, Alert, inputStyle, neonButton } from '@/components/ui';

type M = {
  _id: string;
  name: string;
  designation: string;
  department?: string;
  year?: string;
  image?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  email?: string;
  displayOrder?: number;
  isApproved?: boolean;
};

const empty = {
  name: '',
  designation: '',
  department: '',
  year: '',
  linkedin: '',
  github: '',
  instagram: '',
  email: '',
};

export default function TeamAdmin() {
  const [team, setTeam] = useState<M[] | null>(null);
  const [form, setForm] = useState(empty);
  const [photo, setPhoto] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api<M[]>('/api/team/all')
      .then(setTeam)
      .catch(() => api<M[]>('/api/team').then(setTeam).catch(() => setTeam([])));
  };

  useEffect(load, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('image', photo);

      if (editingId) {
        await api(`/api/team/${editingId}`, { method: 'PUT', body: fd });
        setMsg('Member updated.');
      } else {
        await api('/api/team', { method: 'POST', body: fd });
        setMsg('Member added.');
      }
      setForm(empty);
      setPhoto(null);
      setEditingId(null);
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

  if (team === null) return <Spinner label="Loading team" />;

  return (
    <div>
      <form onSubmit={submit} className="rounded-2xl p-7 mb-10 space-y-4" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(0,240,255,0.12)' }}>
        <h3 className="font-display text-lg font-bold" style={{ color: '#00f0ff' }}>
          {editingId ? '✎ Edit Member' : '+ Add Team Member'}
        </h3>
        {msg && <Alert kind="success">{msg}</Alert>}
        {err && <Alert kind="error">{err}</Alert>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <input required placeholder="Designation (e.g. President)" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <input placeholder="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <input placeholder="GitHub URL" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <input placeholder="Instagram URL" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(226,232,240,0.5)' }}>
            Photo
          </label>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} className="w-full rounded-lg px-4 py-3 text-sm" style={{ ...inputStyle, color: '#9beaff' }} />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="rounded-lg px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase" style={neonButton(true)}>
            {editingId ? 'Save Changes' : 'Add Member'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(empty); setEditingId(null); }} className="rounded-lg px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase" style={neonButton(false)}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {team.length === 0 ? (
        <EmptyState message="No team members yet" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.map((m) => (
            <div key={m._id} className="rounded-xl p-5 flex items-center gap-5" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-black/40">
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl(m.image)} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  '🧑‍🚀'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{m.name}</h4>
                <p className="text-xs" style={{ color: '#00f0ff' }}>{m.designation}</p>
              </div>
              <Tag>{m.isApproved ? 'approved' : 'pending'}</Tag>
              <div className="flex flex-col gap-1.5">
                {!m.isApproved && (
                  <button onClick={() => act(() => api(`/api/team/${m._id}/approve`, { method: 'PATCH' }), 'Approved.')} className="text-xs px-3 py-1 rounded" style={{ color: '#00f0ff', background: 'rgba(0,240,255,0.08)' }}>
                    Approve
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingId(m._id);
                    setForm({
                      name: m.name,
                      designation: m.designation,
                      department: m.department ?? '',
                      year: m.year ?? '',
                      linkedin: m.linkedin ?? '',
                      github: m.github ?? '',
                      instagram: m.instagram ?? '',
                      email: m.email ?? '',
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs px-3 py-1 rounded"
                  style={{ color: '#c98cff', background: 'rgba(162,0,255,0.08)' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => confirm(`Remove ${m.name}?`) && act(() => api(`/api/team/${m._id}`, { method: 'DELETE' }), 'Removed.')}
                  className="text-xs px-3 py-1 rounded"
                  style={{ color: '#ff8c8c', background: 'rgba(255,60,60,0.06)' }}
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
