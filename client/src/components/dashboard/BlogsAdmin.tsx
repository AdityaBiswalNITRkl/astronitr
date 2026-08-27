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
  author?: { name?: string };
};

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [rejecting, setRejecting] = useState<Blog | null>(null);
  const [comment, setComment] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api<Blog[]>('/api/blogs/pending/all')
      .then((d) => setBlogs(asArray(d)))
      .catch(() => setBlogs([]));
  };

  useEffect(load, []);

  const act = async (fn: () => Promise<any>, okMsg: string) => {
    setErr('');
    try {
      await fn();
      setMsg(okMsg);
      setRejecting(null);
      setComment('');
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (blogs === null) return <Spinner label="Loading review queue" />;

  return (
    <div>
      <h3 className="font-display text-lg font-bold mb-6" style={{ color: '#c98cff' }}>
        Stories awaiting review ({blogs.length})
      </h3>

      {msg && <div className="mb-4"><Alert kind="success">{msg}</Alert></div>}
      {err && <div className="mb-4"><Alert kind="error">{err}</Alert></div>}

      {blogs.length === 0 ? (
        <EmptyState message="Review queue is clear 🎉" />
      ) : (
        <div className="space-y-4">
          {blogs.map((b) => (
            <div key={b._id} className="rounded-xl p-6" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(162,0,255,0.2)' }}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/blogs/${b._id}`} className="font-display font-bold hover:text-[#00f0ff]">
                    {b.title}
                  </Link>
                  <p className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>
                    by {b.author?.name ?? 'unknown'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => act(() => api(`/api/blogs/${b._id}/approve`, { method: 'PATCH' }), 'Story approved & published.')} className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase" style={neonButton(true)}>
                    Approve
                  </button>
                  <button onClick={() => setRejecting(rejecting?._id === b._id ? null : b)} className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase" style={neonButton(false)}>
                    Reject
                  </button>
                </div>
              </div>

              {rejecting?._id === b._id && (
                <div className="mt-5 space-y-3 rounded-xl p-5" style={{ background: 'rgba(5,8,22,0.6)', border: '1px solid rgba(255,150,80,0.25)' }}>
                  <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Reason for rejection (sent to author)" className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#ffb36b]" style={inputStyle} />
                  <button
                    onClick={() =>
                      act(
                        () => api(`/api/blogs/${b._id}/reject`, { method: 'PATCH', body: { reviewComment: comment } }),
                        'Story rejected with feedback.'
                      )
                    }
                    className="rounded-lg px-5 py-2 text-xs font-semibold tracking-widest uppercase"
                    style={{ border: '1px solid rgba(255,90,90,0.4)', color: '#ff8c8c', background: 'rgba(255,60,60,0.06)' }}
                  >
                    Confirm Rejection
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
