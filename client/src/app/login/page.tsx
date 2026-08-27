'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageShell, { PageTitle } from '@/components/PageShell';
import { useAuth } from '@/context/AuthContext';
import { Alert, inputStyle, neonButton } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email, password);
      router.push(user?.role === 'member' ? '/dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <PageTitle eyebrow="Access Granted?" title="Crew Login" />

      <form
        onSubmit={submit}
        className="max-w-md mx-auto rounded-2xl p-8 space-y-5"
        style={{
          background: 'rgba(13,17,38,0.55)',
          border: '1px solid rgba(0,240,255,0.12)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {error && <Alert kind="error">{error}</Alert>}
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
          style={inputStyle}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg py-3.5 text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
          style={neonButton(true)}
        >
          {busy ? 'Authenticating…' : 'Launch'}
        </button>
        <p className="text-sm text-center" style={{ color: 'rgba(226,232,240,0.55)' }}>
          New recruit?{' '}
          <Link href="/register" className="font-semibold" style={{ color: '#00f0ff' }}>
            Join the mission
          </Link>
        </p>
      </form>
    </PageShell>
  );
}
