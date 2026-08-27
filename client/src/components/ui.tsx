'use client';

import type { CSSProperties, ReactNode } from 'react';

export const neonButton = (primary = true): CSSProperties => ({
  background: primary
    ? 'linear-gradient(90deg, #00f0ff, #a200ff)'
    : 'rgba(0, 240, 255, 0.08)',
  border: primary ? 'none' : '1px solid rgba(0,240,255,0.35)',
  color: primary ? '#050816' : '#00f0ff',
  fontWeight: 600,
  letterSpacing: '0.05em',
});

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div
        className="w-10 h-10 rounded-full animate-spin"
        style={{
          border: '3px solid rgba(0,240,255,0.15)',
          borderTopColor: '#00f0ff',
        }}
      />
      {label && (
        <p className="text-sm tracking-[0.2em] uppercase" style={{ color: 'rgba(226,232,240,0.5)' }}>
          {label}
        </p>
      )}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="text-center mb-12">
      <p
        className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
        style={{ color: '#00f0ff', textShadow: '0 0 18px rgba(0,240,255,0.6)' }}
      >
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
        <span
          style={{
            background: 'linear-gradient(90deg, #00f0ff, #a200ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </span>
      </h2>
      <div
        className="mx-auto mt-5 h-px w-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(0,240,255,0.7), rgba(162,0,255,0.7), transparent)',
        }}
      />
    </div>
  );
}

export const glassCard: CSSProperties = {
  background: 'rgba(13, 17, 38, 0.55)',
  border: '1px solid rgba(0, 240, 255, 0.12)',
  backdropFilter: 'blur(12px)',
  borderRadius: '1rem',
};

export const inputStyle: CSSProperties = {
  background: 'rgba(5, 8, 22, 0.6)',
  border: '1px solid rgba(0, 240, 255, 0.2)',
  color: '#e2e8f0',
};

export function Alert({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  return (
    <div
      className="rounded-lg px-4 py-3 text-sm"
      style={{
        border: `1px solid ${kind === 'error' ? 'rgba(255,80,80,0.4)' : 'rgba(0,240,255,0.4)'}`,
        background: kind === 'error' ? 'rgba(255,60,60,0.08)' : 'rgba(0,240,255,0.06)',
        color: kind === 'error' ? '#ff9c9c' : '#9beaff',
      }}
    >
      {children}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="text-center py-16 rounded-2xl"
      style={{ ...glassCard, borderStyle: 'dashed' }}
    >
      <p className="tracking-[0.25em] uppercase text-sm" style={{ color: 'rgba(226,232,240,0.45)' }}>
        {message}
      </p>
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase rounded-full px-3 py-1"
      style={{
        border: '1px solid rgba(162,0,255,0.45)',
        color: '#c98cff',
        background: 'rgba(162,0,255,0.08)',
      }}
    >
      {children}
    </span>
  );
}
