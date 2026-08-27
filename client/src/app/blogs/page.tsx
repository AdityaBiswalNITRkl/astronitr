'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageShell, { PageTitle } from '@/components/PageShell';
import { api, imageUrl } from '@/lib/api';
import { Spinner, EmptyState, Tag } from '@/components/ui';

type BlogItem = {
  _id: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  readingTime?: number;
  views?: number;
  featured?: boolean;
  publishedAt?: string;
  author?: { name?: string };
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[] | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api<BlogItem[]>('/api/blogs')
      .then(setBlogs)
      .catch(() => setBlogs([]));
  }, []);

  const filtered = (blogs ?? []).filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell>
      <PageTitle eyebrow="Signal Transmissions" title="Club Blog" />

      <div className="max-w-2xl mx-auto mb-10 flex gap-3">
        <input
          placeholder="Search stories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
          style={{
            background: 'rgba(5,8,22,0.6)',
            border: '1px solid rgba(0,240,255,0.2)',
            color: '#e2e8f0',
          }}
        />
        <Link
          href="/dashboard?tab=my-blogs"
          className="rounded-lg px-5 py-3 text-xs font-semibold tracking-[0.12em] uppercase whitespace-nowrap flex items-center"
          style={{ background: 'linear-gradient(90deg,#00f0ff,#a200ff)', color: '#050816' }}
        >
          Write
        </Link>
      </div>

      {blogs === null ? (
        <Spinner label="Loading stories" />
      ) : filtered.length === 0 ? (
        <EmptyState message="No stories found" />
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
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
              <div className="relative h-44 overflow-hidden">
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
                    style={{ background: 'linear-gradient(135deg, rgba(162,0,255,0.15), rgba(0,240,255,0.12))' }}
                  >
                    🛰️
                  </div>
                )}
                {b.featured && (
                  <span
                    className="absolute top-3 right-3 text-[11px] font-bold tracking-[0.15em] uppercase rounded-full px-3 py-1"
                    style={{ background: 'linear-gradient(90deg,#00f0ff,#a200ff)', color: '#050816' }}
                  >
                    ★ Featured
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-base mb-2 group-hover:text-[#00f0ff] transition-colors line-clamp-2">
                  {b.title}
                </h3>
                {b.excerpt && (
                  <p className="text-sm line-clamp-2 mb-4" style={{ color: 'rgba(226,232,240,0.6)' }}>
                    {b.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'rgba(226,232,240,0.45)' }}>
                  <span>{b.author?.name ?? 'ASTRONITR Crew'}</span>
                  <span>
                    {b.readingTime ? `${b.readingTime} min` : ''}
                    {b.views !== undefined ? ` · ${b.views} views` : ''}
                  </span>
                </div>
                {b.tags && b.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {b.tags.slice(0, 3).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
