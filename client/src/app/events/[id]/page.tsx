'use client';

import { use, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageShell from '@/components/PageShell';
import { api, imageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Spinner, Tag, Alert, neonButton } from '@/components/ui';

type EventItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  banner?: string;
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [msg, setMsg] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    api<EventItem>(`/api/events/${id}`)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));

    if (user) {
      api<any[]>('/api/registrations/me')
        .then((regs) =>
          setRegistered(
            (regs ?? []).some((r: any) => String(r?.event?._id ?? r?.event) === String(id))
          )
        )
        .catch(() => {});
    }
  }, [id, user]);

  const toggleRegister = async () => {
    setMsg('');
    try {
      if (registered) {
        await api(`/api/registrations/${id}`, { method: 'DELETE' });
        setRegistered(false);
        setMsg('Registration cancelled.');
      } else {
        await api('/api/registrations', { method: 'POST', body: { eventId: id } });
        setRegistered(true);
        setMsg('You are registered! See you among the stars. 🚀');
      }
    } catch (err: any) {
      setMsg(err.message || 'Something went wrong');
    }
  };

  if (loading) return <PageShell><Spinner label="Loading event" /></PageShell>;
  if (!event)
    return (
      <PageShell>
        <p className="text-center py-20" style={{ color: 'rgba(226,232,240,0.6)' }}>
          Event not found in this galaxy.
        </p>
      </PageShell>
    );

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(13,17,38,0.55)',
            border: '1px solid rgba(0,240,255,0.12)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="relative h-64 sm:h-80">
            {event.banner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl(event.banner)} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-7xl"
                style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(162,0,255,0.18))' }}
              >
                🌌
              </div>
            )}
          </div>

          <div className="p-8 sm:p-10">
            <Tag>{event.category}</Tag>
            <h1
              className="font-display text-2xl sm:text-4xl font-bold mt-4 mb-6"
              style={{
                background: 'linear-gradient(90deg, #00f0ff, #a200ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-x-10 gap-y-3 mb-8 text-sm" style={{ color: '#9beaff' }}>
              <span>
                🗓{' '}
                {new Date(event.date).toLocaleString(undefined, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>📍 {event.venue}</span>
            </div>

            <p
              className="leading-relaxed whitespace-pre-wrap"
              style={{ color: 'rgba(226,232,240,0.75)' }}
            >
              {event.description}
            </p>

            <div className="mt-10 space-y-4">
              {msg && <Alert kind="success">{msg}</Alert>}
              {user ? (
                <button
                  onClick={toggleRegister}
                  className="w-full rounded-lg py-3.5 text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
                  style={registered ? neonButton(false) : neonButton(true)}
                >
                  {registered ? 'Cancel Registration' : 'Register For This Event'}
                </button>
              ) : (
                <a
                  href="/login"
                  className="block text-center w-full rounded-lg py-3.5 text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
                  style={neonButton(false)}
                >
                  Login to register
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
