'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, asArray, imageUrl } from '@/lib/api';
import { SectionHeading, EmptyState, Spinner } from '@/components/ui';

type GalleryItem = { _id: string; title: string; image: string };

export default function GalleryPreview() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    api<GalleryItem[]>('/api/gallery')
      .then((d) => setItems(asArray<GalleryItem>(d).slice(0, 6)))
      .catch(() => setItems([]));
  }, []);

  return (
    <section id="gallery" className="relative z-10 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Captured Light" title="From The Gallery" />

        {items === null ? (
          <Spinner label="Loading gallery" />
        ) : items.length === 0 ? (
          <EmptyState message="Gallery coming soon" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((g) => (
              <div
                key={g._id}
                className="relative rounded-xl overflow-hidden group aspect-[4/3]"
                style={{ border: '1px solid rgba(0,240,255,0.12)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl(g.image)}
                  alt={g.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-x-0 bottom-0 p-3 text-xs font-semibold tracking-wider"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(5,8,22,0.9), transparent)',
                    color: '#e2e8f0',
                  }}
                >
                  {g.title}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/gallery"
            className="inline-block rounded-full px-8 py-3 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105"
            style={{
              border: '1px solid rgba(162,0,255,0.45)',
              color: '#c98cff',
              background: 'rgba(162,0,255,0.08)',
            }}
          >
            Open Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
