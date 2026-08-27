'use client';

import { useEffect, useState } from 'react';
import PageShell, { PageTitle } from '@/components/PageShell';
import { api, asArray, imageUrl } from '@/lib/api';
import { Spinner, EmptyState, Tag } from '@/components/ui';

type Newsletter = {
  _id: string;
  title: string;
  summary?: string;
  coverImage?: string;
  editionDate?: string;
  tags?: string[];
};

export default function NewslettersPage() {
  const [items, setItems] = useState<Newsletter[] | null>(null);
  const [active, setActive] = useState<any | null>(null);

  useEffect(() => {
    api<Newsletter[]>('/api/newsletters')
      .then((d) => setItems(asArray<Newsletter>(d)))
      .catch(() => setItems([]));
  }, []);

  return (
    <PageShell>
      <PageTitle eyebrow="Periodic Signals" title="Newsletters" />

      {items === null ? (
        <Spinner label="Loading newsletters" />
      ) : items.length === 0 ? (
        <EmptyState message="No newsletters published yet" />
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((n) => (
            <button
              key={n._id}
              onClick={() =>
                api(`/api/newsletters/${n._id}`).then(setActive).catch(() => {})
              }
              className="text-left group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(13,17,38,0.55)',
                border: '1px solid rgba(162,0,255,0.18)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="relative h-44 overflow-hidden">
                {n.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl(n.coverImage)}
                    alt={n.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-5xl"
                    style={{ background: 'linear-gradient(135deg, rgba(162,0,255,0.15), rgba(0,240,255,0.12))' }}
                  >
                    📮
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-base mb-2 group-hover:text-[#c98cff] transition-colors">
                  {n.title}
                </h3>
                {n.summary && (
                  <p className="text-sm line-clamp-2 mb-4" style={{ color: 'rgba(226,232,240,0.6)' }}>
                    {n.summary}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {n.editionDate && (
                    <span className="text-xs" style={{ color: 'rgba(226,232,240,0.45)' }}>
                      🗓 {new Date(n.editionDate).toLocaleDateString()}
                    </span>
                  )}
                  <Tag>Edition</Tag>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[60] overflow-y-auto p-6 cursor-pointer"
          style={{ background: 'rgba(5,8,22,0.94)', backdropFilter: 'blur(10px)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl mx-auto my-10 rounded-2xl p-8 sm:p-12"
            style={{
              background: 'rgba(13,17,38,0.9)',
              border: '1px solid rgba(0,240,255,0.2)',
            }}
          >
            <h2
              className="font-display text-2xl sm:text-3xl font-bold mb-6 text-center"
              style={{
                background: 'linear-gradient(90deg, #00f0ff, #a200ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {active.title}
            </h2>
            <div
              className="leading-relaxed space-y-4"
              style={{ color: 'rgba(226,232,240,0.8)' }}
              dangerouslySetInnerHTML={{ __html: active.content ?? '' }}
            />
          </div>
        </div>
      )}
    </PageShell>
  );
}
