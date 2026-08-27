'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, asArray } from '@/lib/api';
import { Spinner, EmptyState, Tag, Alert, inputStyle, neonButton } from '@/components/ui';

type Blog = {
  _id: string;
  title: string;
  excerpt?: string;
  status?: string;
  reviewComment?: string;
  views?: number;
  likes?: string[];
  comments?: unknown[];
};

export default function MyBlogsTab() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '' });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api<Blog[]>('/api/blogs/my/blogs')
      .then((d) => setBlogs(asArray(d)))
      .catch(() => setBlogs([]));
  };

  useEffect(load, []);

  const startEdit = (b: Blog) => {
    setEditing(b);
    setMsg('');
    setErr('');
    setForm({ title: b.title, excerpt: b.excerpt ?? '', content: '' });
  };

  const save = async () => {
    if (!editing) return;
    setErr('');
    try {
      const body: Record<string, string> = { title: form.title, excerpt: form.excerpt };
      if (form.content.trim()) {
        body.content = `<p>${form.content
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br/>')}</p>`;
      }
      await api(`/api/blogs/${editing._id}`, { method: 'PUT', body });
      setMsg('Story updated — back in the review queue.');
      setEditing(null);
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const remove = async (id: string) => {
    try {
      await api(`/api/blogs/${id}`, { method: 'DELETE' });
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (blogs === null) return <Spinner label="Loading your stories" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm" style={{ color: 'rgba(226,232,240,0.55)' }}>
          Stories you have transmitted to the club.
        </p>
        <Link
          href="/blogs/create"
          className="rounded-full px-5 py-2 text-xs font-semibold tracking-[0.15em] uppercase"
          style={{ background: 'linear-gradient(90deg,#00f0ff,#a200ff)', color: '#050816' }}
        >
          + New Story
        </Link>
      </div>

      {msg && <div className="mb-4"><Alert kind="success">{msg}</Alert></div>}
      {err && <div className="mb-4"><Alert kind="error">{err}</Alert></div>}

      {blogs.length === 0 ? (
        <EmptyState message="You haven't written any stories yet" />
      ) : (
        <div className="space-y-4">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="rounded-xl p-6"
              style={{
                background: 'rgba(13,17,38,0.55)',
                border: '1px solid rgba(0,240,255,0.12)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <h3 className="font-display font-bold">{b.title}</h3>
                <div className="flex items-center gap-2">
                  <Tag>{b.status ?? 'pending'}</Tag>
                  <span className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>
                    👁 {b.views ?? 0} · 💖 {asArray(b.likes).length}
                  </span>
                </div>
              </div>
              {b.reviewComment && (
                <p className="text-xs mb-2" style={{ color: '#ffb36b' }}>
                  Reviewer note: {b.reviewComment}
                </p>
              )}
              <div className="flex gap-3 mt-3">
                <Link href={`/blogs/${b._id}`} className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase" style={neonButton(false)}>
                  View
                </Link>
                <button onClick={() => startEdit(b)} className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase" style={neonButton(false)}>
                  Edit
                </button>
                <button
                  onClick={() => remove(b._id)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase"
                  style={{ border: '1px solid rgba(255,90,90,0.4)', color: '#ff8c8c', background: 'rgba(255,60,60,0.06)' }}
                >
                  Delete
                </button>
              </div>

              {editing?._id === b._id && (
                <div className="mt-5 space-y-3 rounded-xl p-5" style={{ background: 'rgba(5,8,22,0.6)', border: '1px solid rgba(0,240,255,0.15)' }}>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
                  <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Excerpt" className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
                  <textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="New content (leave empty to keep existing)" className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#00f0ff]" style={inputStyle} />
                  <div className="flex gap-3">
                    <button onClick={save} className="rounded-lg px-5 py-2 text-xs font-semibold tracking-widest uppercase" style={neonButton(true)}>
                      Save
                    </button>
                    <button onClick={() => setEditing(null)} className="rounded-lg px-5 py-2 text-xs font-semibold tracking-widest uppercase" style={neonButton(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
