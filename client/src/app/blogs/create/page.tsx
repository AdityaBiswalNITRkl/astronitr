'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageShell, { PageTitle } from '@/components/PageShell';
import { api } from '@/lib/api';
import { Alert, inputStyle, neonButton } from '@/components/ui';

export default function CreateBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', excerpt: '', tags: '', content: '' });
  const [cover, setCover] = useState<File | null>(null);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('excerpt', form.excerpt);
      fd.append(
        'content',
        `<p>${form.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
      );
      form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => fd.append('tags', t));
      if (cover) fd.append('coverImage', cover);

      await api('/api/blogs', { method: 'POST', body: fd });
      router.push('/dashboard?tab=my-blogs');
    } catch (e: any) {
      setErr(e.message || 'Failed to publish');
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <PageTitle eyebrow="New Transmission" title="Write A Story" />

      <form
        onSubmit={submit}
        className="max-w-3xl mx-auto rounded-2xl p-8 space-y-5"
        style={{
          background: 'rgba(13,17,38,0.55)',
          border: '1px solid rgba(0,240,255,0.12)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {err && <Alert kind="error">{err}</Alert>}

        <input
          required
          placeholder="Story title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
          style={inputStyle}
        />
        <textarea
          required
          rows={2}
          placeholder="Short excerpt / summary"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff] resize-none"
          style={inputStyle}
        />
        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
          style={inputStyle}
        />
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(226,232,240,0.5)' }}>
            Cover image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-xs file:font-semibold"
            style={{ ...inputStyle, color: '#9beaff' }}
          />
        </div>
        <textarea
          required
          rows={12}
          placeholder="Write your story… (blank line starts a new paragraph)"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full rounded-lg px-4 py-3 text-sm leading-relaxed outline-none focus:border-[#00f0ff]"
          style={{ ...inputStyle, background: '#05081c' }}
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg py-3.5 text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
          style={neonButton(true)}
        >
          {saving ? 'Transmitting…' : 'Submit For Review'}
        </button>
        <p className="text-xs text-center" style={{ color: 'rgba(226,232,240,0.4)' }}>
          Stories are reviewed by the EB before going live.
        </p>
      </form>
    </PageShell>
  );
}
