'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageShell, { PageTitle } from '@/components/PageShell';
import { api, imageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  SectionHeading,
  Spinner,
  EmptyState,
  Tag,
  Alert,
  inputStyle,
  neonButton,
} from '@/components/ui';

type EventItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  banner?: string;
};

const CATEGORIES = ['All', 'Workshop', 'Observation', 'Competition', 'Talk', 'Other'];

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [category, setCategory] = useState('All');
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const { user } = useAuth();

  const load = () => {
    api<EventItem[]>('/api/events')
      .then(setEvents)
      .catch(() => setEvents([]));
  };

  useEffect(() => {
    load();
    if (user) {
      api<any[]>('/api/registrations/me')
        .then((regs) =>
          setRegisteredIds(
            (regs ?? []).map((r: any) => String(r?.event?._id ?? r?.event ?? r?._id))
          )
        )
        .catch(() => {});
    }
  }, [user]);

  const toggleRegister = async (eventId: string) => {
    if (!user) return;
    setMsg('');
    try {
      if (registeredIds.includes(eventId)) {
        await api(`/api/registrations/${eventId}`, { method: 'DELETE' });
        setRegisteredIds((ids) => ids.filter((id) => id !== eventId));
        setMsg('Registration cancelled.');
      } else {
        await api('/api/registrations', { method: 'POST', body: { eventId } });
        setRegisteredIds((ids) => [...ids, eventId]);
        setMsg('You are registered! See you among the stars. 🚀');
      }
    } catch (err: any) {
      setMsg(err.message || 'Something went wrong');
    }
  };

  const filtered = (events ?? []).filter(
    (e) => category === 'All' || e.category === category
  );

  return (
    <PageShell>
      <PageTitle eyebrow="Mission Calendar" title="Club Events" />

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="rounded-full px-5 py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300"
            style={
              category === c
                ? { background: 'linear-gradient(90deg,#00f0ff,#a200ff)', color: '#050816' }
                : {
                    border: '1px solid rgba(0,240,255,0.25)',
                    color: 'rgba(226,232,240,0.7)',
                    background: 'rgba(0,240,255,0.04)',
                  }
            }
          >
            {c}
          </button>
        ))}
      </div>

      {msg && (
        <div className="max-w-2xl mx-auto mb-8">
          <Alert kind="success">{msg}</Alert>
        </div>
      )}

      {events === null ? (
        <Spinner label="Loading events" />
      ) : filtered.length === 0 ? (
        <EmptyState message="No events found in this category" />
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e) => {
            const isReg = registeredIds.includes(e._id);
            return (
              <div
                key={e._id}
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
                style={{
                  background: 'rgba(13,17,38,0.55)',
                  border: '1px solid rgba(0,240,255,0.12)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Link href={`/events/${e._id}`} className="relative h-44 overflow-hidden block">
                  {e.banner ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(e.banner)}
                      alt={e.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-5xl"
                      style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(162,0,255,0.18))' }}
                    >
                      🌠
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Tag>{e.category}</Tag>
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#e2e8f0' }}>
                    {e.title}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: '#9beaff' }}>
                    🗓{' '}
                    {new Date(e.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm mb-4" style={{ color: 'rgba(226,232,240,0.55)' }}>
                    📍 {e.venue}
                  </p>
                  <div className="mt-auto flex gap-3">
                    {user && (
                      <button
                        onClick={() => toggleRegister(e._id)}
                        className="flex-1 rounded-lg py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-300 hover:scale-[1.02]"
                        style={isReg ? neonButton(false) : neonButton(true)}
                      >
                        {isReg ? 'Cancel RSVP' : 'Register'}
                      </button>
                    )}
                    <Link
                      href={`/events/${e._id}`}
                      className="flex-1 text-center rounded-lg py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-300 hover:scale-[1.02]"
                      style={user ? neonButton(false) : neonButton(true)}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
