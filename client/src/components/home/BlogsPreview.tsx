'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, asArray, imageUrl } from '@/lib/api';
import { SectionHeading, EmptyState, Spinner, Tag } from '@/components/ui';

type BlogItem = {
  _id: string;
  title: string;
  excerpt?: string;
  slug?: string;
  coverImage?: string;
  tags?: string[];
  readingTime?: number;
  publishedAt?: string;
  author?: { name?: string };
};

export default function BlogsPreview() {
  const [blogs, setBlogs] = useState<BlogItem[] | null>(null);

  useEffect(() => {
    api<BlogItem[]>('/api/blogs')
      .then((d) => setBlogs(asArray<BlogItem>(d).slice(0, 3)))
      .catch(() => setBlogs([]));
  }, []);

  return (
    <section id="blog" className="relative z-10 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Signal Transmissions" title="Latest From The Blog" />

        {blogs === null ? (
          <Spinner label="Loading stories" />
        ) : blogs.length === 0 ? (
          <EmptyState message="No stories published yet" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <Link
                key={b._id}
                href={`/blogs/${b._id}`}
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(13,17,38,0.55)',
                  border: '1px solid rgba(0,240,255,0.12)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="relative h-40 overflow-hidden">
                  {b.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(b.coverImage)}
                      alt={b.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-5xl"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(162,0,255,0.15), rgba(0,240,255,0.12))',
                      }}
                    >
                      🛰️
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-base mb-2 group-hover:text-[#00f0ff] transition-colors line-clamp-2" style={{ color: '#e2e8f0' }}>
                    {b.title}
                  </h3>
                  {b.excerpt && (
                    <p
                      className="text-sm line-clamp-2 mb-4"
                      style={{ color: 'rgba(226,232,240,0.6)' }}
                    >
                      {b.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs" style={{ color: 'rgba(226,232,240,0.45)' }}>
                    <span>{b.author?.name ?? 'ASTRONITR Crew'}</span>
                    {b.readingTime ? <span>{b.readingTime} min read</span> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/blogs"
            className="inline-block rounded-full px-8 py-3 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105"
            style={{
              border: '1px solid rgba(0,240,255,0.35)',
              color: '#00f0ff',
              background: 'rgba(0,240,255,0.06)',
            }}
          >
            Read All Stories
          </Link>
        </div>
      </div>
    </section>
  );
}
