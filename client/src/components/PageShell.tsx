'use client';

import Galaxy from '@/components/Galaxy';
import { ReactNode } from 'react';

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-[-1] bg-[#050816]">
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1}
          glowIntensity={0.6}
          saturation={1}
          hueShift={-40}
          twinkleIntensity={0.4}
          rotationSpeed={0.05}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
          transparent={true}
        />
      </div>
      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6">{children}</main>
    </div>
  );
}

export function PageTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center mb-12">
      <p
        className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
        style={{ color: '#00f0ff', textShadow: '0 0 18px rgba(0,240,255,0.6)' }}
      >
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
        <span
          style={{
            background: 'linear-gradient(90deg, #00f0ff, #a200ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </span>
      </h1>
    </div>
  );
}
