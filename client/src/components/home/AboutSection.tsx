'use client';

import { SectionHeading } from '@/components/ui';

const PILLARS = [
  {
    title: 'Observe',
    desc: 'Telescope sessions, astrophotography nights and live sky-watch events under the darkest skies we can find.',
    icon: '🔭',
  },
  {
    title: 'Learn',
    desc: 'Workshops on astronomy, astrophysics, rocketry and data science — from beginner stargazing to research-grade analysis.',
    icon: '🧠',
  },
  {
    title: 'Build',
    desc: 'Hands-on projects: radio telescopes, weather balloons, cube satellites and open-source space tech.',
    icon: '🚀',
  },
  {
    title: 'Share',
    desc: 'Outreach programs, blogs, newsletters and public talks that bring the cosmos closer to everyone.',
    icon: '🌌',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative z-10 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Who We Are" title="About The Mission" />
        <p
          className="max-w-3xl mx-auto text-center text-base sm:text-lg leading-relaxed mb-14"
          style={{ color: 'rgba(226,232,240,0.75)' }}
        >
          ASTRONITR is the official Astronomy &amp; Space Club of NIT Rourkela —
          a crew of students bound by one obsession: the universe. We observe,
          we learn, we build, and we share the cosmos with everyone around us.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="p-7 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(13, 17, 38, 0.55)',
                border: '1px solid rgba(0, 240, 255, 0.12)',
                backdropFilter: 'blur(12px)',
                borderRadius: '1rem',
              }}
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3
                className="font-display text-lg font-bold mb-2 tracking-wider uppercase"
                style={{ color: '#00f0ff', textShadow: '0 0 16px rgba(0,240,255,0.4)' }}
              >
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(226,232,240,0.65)' }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
