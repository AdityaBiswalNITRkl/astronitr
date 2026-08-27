'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api, imageUrl } from '@/lib/api';
import { Alert, inputStyle } from '@/components/ui';

export default function ProfileTab() {
  const { user, refresh } = useAuth();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  if (!user) return null;

  const uploadImage = async (file: File) => {
    setMsg('');
    setErr('');
    try {
      const fd = new FormData();
      fd.append('profileImage', file);
      await api('/api/users/profile-image', { method: 'POST', body: fd });
      await refresh();
      setMsg('Profile image updated.');
    } catch (e: any) {
      setErr(e.message || 'Upload endpoint not available on the server.');
    }
  };

  return (
    <div
      className="rounded-2xl p-8 sm:p-10 max-w-2xl mx-auto"
      style={{
        background: 'rgba(13,17,38,0.55)',
        border: '1px solid rgba(0,240,255,0.12)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-6 mb-8">
        <div
          className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl"
          style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(162,0,255,0.2))' }}
        >
          {user.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl(user.profileImage)} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            '🧑‍🚀'
          )}
        </div>
        <div>
          <h3 className="font-display text-xl font-bold">{user.name}</h3>
          <p className="text-sm" style={{ color: '#00f0ff' }}>
            {user.role.toUpperCase()} · {user.email}
          </p>
        </div>
      </div>

      {msg && <div className="mb-4"><Alert kind="success">{msg}</Alert></div>}
      {err && <div className="mb-4"><Alert kind="error">{err}</Alert></div>}

      <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(226,232,240,0.5)' }}>
        Update profile picture
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
        className="w-full rounded-lg px-4 py-3 text-sm"
        style={{ ...inputStyle, color: '#9beaff' }}
      />
    </div>
  );
}
