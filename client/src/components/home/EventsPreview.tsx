'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, asArray, imageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { SectionHeading, EmptyState, Tag, Spinner } from '@/components/ui';

type EventItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  banner?: string;
};

export default function EventsPreview() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    api<EventItem[]>('/api/events')
      .then((d) => setEvents(asArray<EventItem>(d)))
      .catch(() => setEvents([]));
  }, []);

  const upcoming = asArray<EventItem>(events)
    .filter((e) => new Date(e.date).getTime() >= Date.now() - 86400000)
    .slice(0, 3);

  return (
    <section id="events" className="relative z-10 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="What&apos;s Next" title="Upcoming Events" />

        {events === null ? (
          <Spinner label="Loading events" />
        ) : upcoming.length === 0 ? (
          <EmptyState message="No upcoming events yet — stay tuned" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcoming.map((e) => (
              <Link
                key={e._id}
                href={`/events/${e._id}`}
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(13, 17, 38, 0.55)',
                  border: '1px solid rgba(0,240,255,0.12)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="relative h-44 overflow-hidden">
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
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(162,0,255,0.18))',
                      }}
                    >
                      🌠
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Tag>{e.category}</Tag>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="font-display font-bold text-lg mb-2 group-hover:text-[#00f0ff] transition-colors"
                    style={{ color: '#e2e8f0' }}
                  >
                    {e.title}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: '#9beaff' }}>
                    🗓 {' '}
                    {new Date(e.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(226,232,240,0.55)' }}>
                    📍 {e.venue}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/events"
            className="inline-block rounded-full px-8 py-3 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105"
            style={{
              border: '1px solid rgba(0,240,255,0.35)',
              color: '#00f0ff',
              background: 'rgba(0,240,255,0.06)',
            }}
          >
            View All Events{user ? '' : ''}
          </Link>
        </div>
      </div>
    </section>
  );
}
