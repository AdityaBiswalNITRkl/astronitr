'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageShell, { PageTitle } from '@/components/PageShell';
import { useAuth } from '@/context/AuthContext';
import { Alert, inputStyle, neonButton } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setBusy(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      router.push('/login?registered=1');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <PageTitle eyebrow="Join The Mission" title="Become A Crew Member" />

      <form
        onSubmit={submit}
        className="max-w-md mx-auto rounded-2xl p-8 space-y-5"
        style={{
          background: 'rgba(13,17,38,0.55)',
          border: '1px solid rgba(162,0,255,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {error && <Alert kind="error">{error}</Alert>}
        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
          style={inputStyle}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
          style={inputStyle}
        />
        <input
          required
          type="password"
          minLength={6}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
          style={inputStyle}
        />
        <input
          required
          type="password"
          placeholder="Confirm password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg py-3.5 text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
          style={neonButton(true)}
        >
          {busy ? 'Transmitting application…' : 'Request Boarding Pass'}
        </button>
        <p className="text-xs text-center leading-relaxed" style={{ color: 'rgba(226,232,240,0.45)' }}>
          New accounts need admin approval before their first login.
        </p>
        <p className="text-sm text-center" style={{ color: 'rgba(226,232,240,0.55)' }}>
          Already aboard?{' '}
          <Link href="/login" className="font-semibold" style={{ color: '#00f0ff' }}>
            Login
          </Link>
        </p>
      </form>
    </PageShell>
  );
}
