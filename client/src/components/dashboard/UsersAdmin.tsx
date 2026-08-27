'use client';

import { useEffect, useState } from 'react';
import { api, asArray } from '@/lib/api';
import { Spinner, EmptyState, Tag, Alert, inputStyle, neonButton } from '@/components/ui';

type U = { _id: string; name: string; email: string; role: string; isApproved?: boolean };

export default function UsersAdmin() {
  const [users, setUsers] = useState<U[] | null>(null);
  const [pending, setPending] = useState<U[]>([]);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api<U[]>('/api/users').then((d) => setUsers(asArray(d))).catch((e) => { setErr(e.message); setUsers([]); });
    api<U[]>('/api/admin/pending-members')
      .then((d) => setPending(asArray(d)))
      .catch(() => {});
  };

  useEffect(load, []);

  const act = async (fn: () => Promise<any>, okMsg: string) => {
    setErr('');
    setMsg('');
    try {
      await fn();
      setMsg(okMsg);
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (users === null) return <Spinner label="Loading users" />;

  const roleColor = (r: string) =>
    r === 'admin' ? '#ff9de2' : r === 'eb' ? '#c98cff' : '#00f0ff';

  return (
    <div>
      <h3 className="font-display text-lg font-bold mb-1" style={{ color: '#00f0ff' }}>
        Pending Approvals
      </h3>
      <p className="text-sm mb-4" style={{ color: 'rgba(226,232,240,0.5)' }}>
        New recruits waiting for boarding clearance.
      </p>

      {msg && <div className="mb-4"><Alert kind="success">{msg}</Alert></div>}
      {err && <div className="mb-4"><Alert kind="error">{err}</Alert></div>}

      {pending.length === 0 ? (
        <p className="text-sm mb-10" style={{ color: 'rgba(226,232,240,0.4)' }}>
          No pending members 🎉
        </p>
      ) : (
        <div className="space-y-3 mb-12">
          {pending.map((u) => (
            <div key={u._id} className="rounded-xl p-5 flex flex-wrap items-center justify-between gap-4" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(162,0,255,0.25)' }}>
              <div>
                <span className="font-semibold">{u.name}</span>
                <span className="text-sm ml-3" style={{ color: 'rgba(226,232,240,0.5)' }}>{u.email}</span>
              </div>
              <button
                onClick={() => act(() => api(`/api/users/approve/${u._id}`, { method: 'PATCH' }), `${u.name} approved.`)}
                className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase"
                style={neonButton(true)}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-display text-lg font-bold mb-6" style={{ color: '#c98cff' }}>
        All Users ({users.length})
      </h3>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u._id} className="rounded-xl p-5 flex flex-wrap items-center justify-between gap-4" style={{ background: 'rgba(13,17,38,0.55)', border: '1px solid rgba(0,240,255,0.1)' }}>
            <div className="min-w-[200px]">
              <span className="font-semibold">{u.name}</span>{' '}
              {!u.isApproved && <Tag>unapproved</Tag>}
              <div className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>{u.email}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={u.role}
                onChange={(e) =>
                  act(
                    () => api(`/api/users/role/${u._id}`, { method: 'PATCH', body: { role: e.target.value } }),
                    `${u.name}'s role updated.`
                  )
                }
                className="rounded-lg px-3 py-2 text-xs outline-none"
                style={{
                  ...inputStyle,
                  color: roleColor(u.role),
                  borderColor: `${roleColor(u.role)}55`,
                }}
              >
                <option value="member">member</option>
                <option value="eb">eb</option>
                <option value="admin">admin</option>
              </select>
              <button
                onClick={() => {
                  if (confirm(`Delete ${u.name}? This cannot be undone.`)) {
                    act(() => api(`/api/users/${u._id}`, { method: 'DELETE' }), 'User deleted.');
                  }
                }}
                className="rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase"
                style={{ border: '1px solid rgba(255,90,90,0.4)', color: '#ff8c8c', background: 'rgba(255,60,60,0.06)' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
