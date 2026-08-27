'use client';

import { useEffect, useState } from 'react';
import { api, asArray } from '@/lib/api';
import { Spinner, EmptyState, Tag, Alert, inputStyle } from '@/components/ui';

type Event = { _id: string; title: string; date: string };
type Reg = {
  _id: string;
  attendanceStatus?: string;
  user?: { name?: string; email?: string };
  registeredAt?: string;
};

export default function RegistrationsAdmin() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [eventId, setEventId] = useState('');
  const [regs, setRegs] = useState<Reg[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api<Event[]>('/api/events/all?includePending=true')
      .then((d) => setEvents(asArray(d)))
      .catch(() => api<Event[]>('/api/events').then((d) => setEvents(asArray(d))).catch(() => setEvents([])));
  }, []);

  const loadRegs = (id: string) => {
    setEventId(id);
    if (!id) {
      setRegs(null);
      return;
    }
    api<Reg[]>(`/api/registrations/event/${id}`)
      .then((d) => setRegs(asArray(d)))
      .catch((e) => {
        setErr(e.message);
        setRegs([]);
      });
  };

  const mark = async (registrationId: string, status: string) => {
    try {
      await api(`/api/registrations/${registrationId}/attendance`, {
        method: 'PATCH',
        body: { attendanceStatus: status },
      });
      loadRegs(eventId);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <h3 className="font-display text-lg font-bold mb-2" style={{ color: '#00f0ff' }}>
        Attendance Console
      </h3>
      <p className="text-sm mb-6" style={{ color: 'rgba(226,232,240,0.5)' }}>
        Pick an event, then mark who showed up among the stars.
      </p>

      <select
        value={eventId}
        onChange={(e) => loadRegs(e.target.value)}
        className="w-full max-w-md rounded-lg px-4 py-3 text-sm outline-none mb-8"
        style={inputStyle}
      >
        <option value="">— Select an event —</option>
        {asArray(events).map((ev) => (
          <option key={ev._id} value={ev._id}>
            {ev.title} ({new Date(ev.date).toLocaleDateString()})
          </option>
        ))}
      </select>

      {err && <div className="mb-4"><Alert kind="error">{err}</Alert></div>}

      {!eventId || regs === null ? null : regs.length === 0 ? (
        <EmptyState message="No registrations for this event yet" />
      ) : (
        <div className="space-y-3">
          {regs.map((r) => (
            <div key={r._id} className="rounded-xl p-5 flex flex-wrap items-center justify-between gap-4" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div>
                <span className="font-semibold">{r.user?.name ?? 'Unknown'}</span>
                <span className="text-sm ml-3" style={{ color: 'rgba(226,232,240,0.5)' }}>
                  {r.user?.email}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Tag>{r.attendanceStatus ?? 'registered'}</Tag>
                {['present', 'absent', 'registered'].map((s) => (
                  <button
                    key={s}
                    onClick={() => mark(r._id, s)}
                    className="text-xs px-3 py-1.5 rounded capitalize"
                    style={{
                      border: `1px solid ${r.attendanceStatus === s ? 'rgba(0,240,255,0.5)' : 'rgba(0,240,255,0.15)'}`,
                      color: r.attendanceStatus === s ? '#00f0ff' : 'rgba(226,232,240,0.6)',
                      background: r.attendanceStatus === s ? 'rgba(0,240,255,0.08)' : 'transparent',
                    }}
                  >
                    {s === 'present' ? '✓ present' : s === 'absent' ? '✕ absent' : '↺ registered'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
