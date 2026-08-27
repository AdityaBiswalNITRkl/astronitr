'use client';

import PageShell, { PageTitle } from '@/components/PageShell';
import Link from 'next/link';

const TIMELINE = [
  { year: 'Genesis', text: 'A handful of students pointed a telescope at the sky and never looked back. ASTRONITR was born.' },
  { year: 'Growth', text: 'Regular observation nights, workshops and inter-college astro fests put the club on the map.' },
  { year: 'Today', text: 'A full crew of observers, builders and storytellers running events, research projects and outreach.' },
  { year: 'Tomorrow', text: 'Radio astronomy, high-altitude ballooning and satellite projects — the journey has just begun.' },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageTitle eyebrow="Who We Are" title="About ASTRONITR" />

      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(226,232,240,0.75)' }}>
          ASTRONITR is the official Astronomy &amp; Space Club of NIT Rourkela.
          We are students, dreamers and builders united by curiosity about the
          cosmos — from backyard stargazing to cutting-edge space technology.
          Our mission is simple: explore, learn, build and share the universe
          with everyone.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {TIMELINE.map((t, i) => (
          <div
            key={t.year}
            className="flex gap-6 items-start rounded-2xl p-7"
            style={{
              background: 'rgba(13,17,38,0.55)',
              border: '1px solid rgba(0,240,255,0.12)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="font-display font-bold text-sm tracking-[0.2em] uppercase rounded-full px-4 py-2 whitespace-nowrap"
              style={{
                background: i % 2 === 0 ? 'linear-gradient(90deg,#00f0ff,#a200ff)' : 'rgba(0,240,255,0.08)',
                color: i % 2 === 0 ? '#050816' : '#00f0ff',
                border: i % 2 === 0 ? 'none' : '1px solid rgba(0,240,255,0.35)',
              }}
            >
              {t.year}
            </div>
            <p className="text-sm leading-relaxed pt-1" style={{ color: 'rgba(226,232,240,0.7)' }}>
              {t.text}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-14">
        <Link
          href="/register"
          className="inline-block rounded-full px-10 py-3.5 text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105"
          style={{ background: 'linear-gradient(90deg,#00f0ff,#a200ff)', color: '#050816' }}
        >
          Join The Crew
        </Link>
      </div>
    </PageShell>
  );
}
