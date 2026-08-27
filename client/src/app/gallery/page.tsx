'use client';

import { useEffect, useState } from 'react';
import PageShell, { PageTitle } from '@/components/PageShell';
import { api, asArray, imageUrl } from '@/lib/api';
import { Spinner, EmptyState } from '@/components/ui';

type GalleryItem = { _id: string; title: string; description?: string; image: string };

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [active, setActive] = useState<GalleryItem | null>(null);

  useEffect(() => {
    api<GalleryItem[]>('/api/gallery')
      .then((d) => setItems(asArray<GalleryItem>(d)))
      .catch(() => setItems([]));
  }, []);

  return (
    <PageShell>
      <PageTitle eyebrow="Captured Light" title="Photo Gallery" />

      {items === null ? (
        <Spinner label="Loading gallery" />
      ) : items.length === 0 ? (
        <EmptyState message="Gallery is empty — images coming soon" />
      ) : (
        <>
          <div className="max-w-6xl mx-auto columns-2 md:columns-3 gap-4 space-y-4">
            {items.map((g) => (
              <button
                key={g._id}
                onClick={() => setActive(g)}
                className="relative w-full rounded-xl overflow-hidden group block break-inside-avoid"
                style={{ border: '1px solid rgba(0,240,255,0.12)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl(g.image)}
                  alt={g.title}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-x-0 bottom-0 p-3 text-left text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(to top, rgba(5,8,22,0.9), transparent)',
                    color: '#e2e8f0',
                  }}
                >
                  {g.title}
                </div>
              </button>
            ))}
          </div>

          {active && (
            <div
              onClick={() => setActive(null)}
              className="fixed inset-0 z-[60] flex items-center justify-center p-6 cursor-pointer"
              style={{ background: 'rgba(5,8,22,0.92)', backdropFilter: 'blur(8px)' }}
            >
              <div className="max-w-4xl w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl(active.image)}
                  alt={active.title}
                  className="w-full max-h-[75vh] object-contain rounded-xl"
                  style={{ border: '1px solid rgba(0,240,255,0.25)' }}
                />
                <p className="text-center mt-4 font-display font-bold">{active.title}</p>
                {active.description && (
                  <p className="text-center text-sm mt-1" style={{ color: 'rgba(226,232,240,0.55)' }}>
                    {active.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
