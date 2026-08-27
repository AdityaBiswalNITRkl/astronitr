'use client';

import { useEffect, useState } from 'react';
import PageShell, { PageTitle } from '@/components/PageShell';
import { api, asArray, imageUrl } from '@/lib/api';
import { Spinner, EmptyState } from '@/components/ui';

type Member = {
  _id: string;
  name: string;
  designation: string;
  department?: string;
  year?: string;
  image?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  email?: string;
};

const socialIcon = (m: Member) => [
  m.linkedin && { href: m.linkedin, label: 'in' },
  m.github && { href: m.github, label: 'gh' },
  m.instagram && { href: m.instagram, label: 'ig' },
  m.email && { href: `mailto:${m.email}`, label: '@' },
].filter(Boolean) as { href: string; label: string }[];

export default function TeamPage() {
  const [team, setTeam] = useState<Member[] | null>(null);

  useEffect(() => {
    api<Member[]>('/api/team')
      .then((d) => setTeam(asArray<Member>(d)))
      .catch(() => setTeam([]));
  }, []);

  return (
    <PageShell>
      <PageTitle eyebrow="The Crew" title="Meet The Team" />

      {team === null ? (
        <Spinner label="Loading crew manifest" />
      ) : team.length === 0 ? (
        <EmptyState message="Crew manifest coming soon" />
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <div
              key={m._id}
              className="group rounded-2xl overflow-hidden text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(13,17,38,0.55)',
                border: '1px solid rgba(0,240,255,0.12)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="relative h-56 overflow-hidden">
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl(m.image)}
                    alt={m.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-6xl"
                    style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(162,0,255,0.18))' }}
                  >
                    👩‍🚀
                  </div>
                )}
                <div
                  className="absolute inset-x-0 bottom-0 h-16"
                  style={{ background: 'linear-gradient(to top, rgba(5,8,22,0.9), transparent)' }}
                />
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-lg" style={{ color: '#e2e8f0' }}>
                  {m.name}
                </h3>
                <p className="text-sm mt-1 mb-1" style={{ color: '#00f0ff' }}>
                  {m.designation}
                </p>
                {(m.department || m.year) && (
                  <p className="text-xs mb-4" style={{ color: 'rgba(226,232,240,0.45)' }}>
                    {[m.department, m.year].filter(Boolean).join(' · ')}
                  </p>
                )}
                <div className="flex justify-center gap-3">
                  {socialIcon(m).map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 hover:scale-110"
                      style={{
                        border: '1px solid rgba(0,240,255,0.3)',
                        color: '#00f0ff',
                        background: 'rgba(0,240,255,0.05)',
                      }}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
