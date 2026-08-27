'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { SectionHeading, inputStyle, neonButton, Alert } from '@/components/ui';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('sending');
    try {
      await api('/api/contact', { method: 'POST', body: form });
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      setStatus('idle');
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="contact" className="relative z-10 py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="Establish Contact" title="Send A Transmission" />

        {status === 'sent' ? (
          <Alert kind="success">
            🛰️ Transmission received! Our crew will get back to you soon.
          </Alert>
        ) : (
          <form
            onSubmit={submit}
            className="rounded-2xl p-8 space-y-5"
            style={{
              background: 'rgba(13,17,38,0.55)',
              border: '1px solid rgba(0,240,255,0.12)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {error && <Alert kind="error">{error}</Alert>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                required
                placeholder="Your name"
                value={form.name}
                onChange={set('name')}
                className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
                style={inputStyle}
              />
              <input
                required
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={set('email')}
                className="rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
                style={inputStyle}
              />
            </div>
            <input
              required
              placeholder="Subject"
              value={form.subject}
              onChange={set('subject')}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
              style={inputStyle}
            />
            <textarea
              required
              rows={5}
              placeholder="Your message across the cosmos..."
              value={form.message}
              onChange={set('message')}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff] resize-none"
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-lg py-3.5 text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
              style={neonButton(true)}
            >
              {status === 'sending' ? 'Transmitting…' : 'Transmit Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
