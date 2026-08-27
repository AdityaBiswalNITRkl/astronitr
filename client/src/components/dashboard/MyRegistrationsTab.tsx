'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Spinner, EmptyState, Tag } from '@/components/ui';

type Reg = {
  _id: string;
  attendanceStatus?: string;
  registeredAt?: string;
  event?: { _id: string; title: string; date: string; venue: string; category: string };
};

export default function MyRegistrationsTab() {
  const [regs, setRegs] = useState<Reg[] | null>(null);

  useEffect(() => {
    api<Reg[]>('/api/registrations/me')
      .then(setRegs)
      .catch(() => setRegs([]));
  }, []);

  if (regs === null) return <Spinner label="Loading your RSVPs" />;
  if (regs.length === 0)
    return (
      <EmptyState message="No event registrations yet — head to Events and sign up!" />
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {regs.map((r) => (
        <div
          key={r._id}
          className="rounded-xl p-6 flex items-center justify-between gap-4"
          style={{
            background: 'rgba(13,17,38,0.55)',
            border: '1px solid rgba(0,240,255,0.12)',
          }}
        >
          <div>
            <Link
              href={`/events/${r.event?._id}`}
              className="font-display font-bold hover:text-[#00f0ff]"
            >
              {r.event?.title ?? 'Event'}
            </Link>
            <p className="text-sm mt-1" style={{ color: '#9beaff' }}>
              🗓{' '}
              {r.event?.date &&
                new Date(r.event.date).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
            </p>
            <p className="text-xs" style={{ color: 'rgba(226,232,240,0.5)' }}>
              📍 {r.event?.venue}
            </p>
          </div>
          <Tag>{r.attendanceStatus ?? 'registered'}</Tag>
        </div>
      ))}
    </div>
  );
}
