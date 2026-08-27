'use client';

import { useEffect, useState } from 'react';
import { api, asArray } from '@/lib/api';
import { Spinner, EmptyState, Tag, Alert } from '@/components/ui';

type Msg = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string;
  createdAt?: string;
};

export default function ContactAdmin() {
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const [err, setErr] = useState('');

  const load = () => {
    api<Msg[]>('/api/contact').then((d) => setMsgs(asArray(d))).catch((e) => {
      setErr(e.message);
      setMsgs([]);
    });
  };

  useEffect(load, []);

  const setStatus = async (id: string, status: string) => {
    try {
      await api(`/api/contact/${id}`, { method: 'PATCH', body: { status } });
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (msgs === null) return <Spinner label="Loading inbox" />;

  return (
    <div>
      <h3 className="font-display text-lg font-bold mb-6" style={{ color: '#00f0ff' }}>
        Incoming transmissions ({msgs.length})
      </h3>
      {err && <div className="mb-4"><Alert kind="error">{err}</Alert></div>}

      {msgs.length === 0 ? (
        <EmptyState message="Inbox is empty" />
      ) : (
        <div className="space-y-4">
          {msgs.map((m) => (
            <div key={m._id} className="rounded-xl p-6" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="font-semibold">{m.subject}</h4>
                  <p className="text-xs mt-1" style={{ color: '#9beaff' }}>
                    {m.name} · {m.email}
                  </p>
                </div>
                <Tag>{m.status ?? 'new'}</Tag>
              </div>
              <p className="text-sm leading-relaxed my-3" style={{ color: 'rgba(226,232,240,0.75)' }}>
                {m.message}
              </p>
              <div className="flex flex-wrap gap-2">
                {['replied', 'archived', 'new'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(m._id, s)}
                    className="text-xs px-3 py-1.5 rounded capitalize"
                    style={{
                      border: `1px solid ${m.status === s ? 'rgba(0,240,255,0.5)' : 'rgba(0,240,255,0.15)'}`,
                      color: m.status === s ? '#00f0ff' : 'rgba(226,232,240,0.6)',
                      background: m.status === s ? 'rgba(0,240,255,0.08)' : 'transparent',
                    }}
                  >
                    mark {s}
                  </button>
                ))}
                <a
                  href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                  className="text-xs px-3 py-1.5 rounded"
                  style={{ background: 'linear-gradient(90deg,#00f0ff,#a200ff)', color: '#050816' }}
                >
                  Reply by email
                </a>
                <button
                  onClick={() => confirm('Delete message?') && api(`/api/contact/${m._id}`, { method: 'DELETE' }).then(load)}
                  className="text-xs px-3 py-1.5 rounded"
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
