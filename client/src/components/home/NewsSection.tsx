'use client';

import { useEffect, useState } from 'react';
import { api, asArray, imageUrl } from '@/lib/api';
import { SectionHeading, EmptyState, Spinner } from '@/components/ui';

type Article = {
  title: string;
  summary: string;
  image?: string;
  url?: string;
  source?: string;
  publishedAt?: string;
};

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    api<Article[] | { articles: Article[] }>('/api/news')
      .then((d: any) =>
        setArticles(Array.isArray(d) ? d : asArray<Article>(d?.articles))
      )
      .catch(() => setArticles([]));
  }, []);

  if (articles === null)
    return (
      <section className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Deep Space Wire" title="Astronomy News" />
          <Spinner label="Fetching headlines from Earth" />
        </div>
      </section>
    );

  return (
    <section id="news" className="relative z-10 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Deep Space Wire" title="Today In Space" />

        {articles.length === 0 ? (
          <EmptyState message="News feed offline — check back tomorrow" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a, i) => (
              <a
                key={i}
                href={a.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 block"
                style={{
                  background: 'rgba(13,17,38,0.55)',
                  border: '1px solid rgba(0,240,255,0.12)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {a.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl(a.image)} alt="" className="w-full h-36 object-cover" />
                )}
                <div className="p-6">
                  {a.source && (
                    <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: '#00f0ff' }}>
                      {a.source}
                    </p>
                  )}
                  <h3 className="font-display font-bold text-sm mb-2 line-clamp-2 group-hover:text-[#00f0ff] transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'rgba(226,232,240,0.6)' }}>
                    {a.summary}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
