'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageShell from '@/components/PageShell';
import { api, asArray, imageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Spinner, Tag, Alert, inputStyle, neonButton } from '@/components/ui';

type Comment = { _id: string; text: string; date?: string; user?: { _id: string; name: string } };
type Blog = {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  views?: number;
  likes?: string[];
  comments?: Comment[];
  readingTime?: number;
  publishedAt?: string;
  author?: { _id: string; name?: string };
};

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const { user } = useAuth();

  const load = () => {
    api<Blog>(`/api/blogs/${id}`)
      .then((d: any) => setBlog(d && typeof d === 'object' && d._id ? d : null))
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleLike = async () => {
    if (!user) return;
    try {
      await api(`/api/blogs/${id}/like`, { method: 'POST' });
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      await api(`/api/blogs/${id}/comments`, { method: 'POST', body: { text: comment } });
      setComment('');
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await api(`/api/blogs/${id}/comments/${commentId}`, { method: 'DELETE' });
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (loading) return <PageShell><Spinner label="Loading story" /></PageShell>;
  if (!blog)
    return (
      <PageShell>
        <p className="text-center py-20" style={{ color: 'rgba(226,232,240,0.6)' }}>
          This transmission could not be found.
        </p>
      </PageShell>
    );

  const likes = asArray<string>(blog.likes);
  const comments = asArray<Comment>(blog.comments);
  const tags = asArray<string>(blog.tags);
  const liked = !!user && likes.includes(user._id);

  return (
    <PageShell>
      <article className="max-w-3xl mx-auto">
        {blog.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl(blog.coverImage)}
            alt={blog.title}
            className="w-full h-72 sm:h-96 object-cover rounded-2xl mb-8"
            style={{ border: '1px solid rgba(0,240,255,0.15)' }}
          />
        )}

        <div className="flex gap-2 flex-wrap mb-4">
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <h1
          className="font-display text-2xl sm:text-4xl font-bold mb-4"
          style={{
            background: 'linear-gradient(90deg, #00f0ff, #a200ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-10" style={{ color: 'rgba(226,232,240,0.5)' }}>
          <span>✍️ {blog.author?.name ?? 'ASTRONITR Crew'}</span>
          {blog.publishedAt && <span>🗓 {new Date(blog.publishedAt).toLocaleDateString()}</span>}
          {blog.readingTime ? <span>⏱ {blog.readingTime} min read</span> : null}
          <span>👁 {blog.views ?? 0} views</span>
        </div>

        <div
          className="prose-blog leading-relaxed space-y-4"
          style={{ color: 'rgba(226,232,240,0.8)' }}
          dangerouslySetInnerHTML={{ __html: blog.content ?? '' }}
        />

        {/* Likes */}
        <div className="mt-12 flex items-center gap-4">
          <button
            onClick={toggleLike}
            disabled={!user}
            className="rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
            style={{
              border: `1px solid ${liked ? '#a200ff' : 'rgba(0,240,255,0.35)'}`,
              color: liked ? '#c98cff' : '#00f0ff',
              background: liked ? 'rgba(162,0,255,0.1)' : 'rgba(0,240,255,0.06)',
            }}
          >
            {liked ? '💖' : '🤍'} {likes.length} likes
          </button>
          {!user && (
            <Link href="/login" className="text-xs tracking-widest uppercase" style={{ color: '#00f0ff' }}>
              Login to interact →
            </Link>
          )}
        </div>

        {/* Comments */}
        <section className="mt-14">
          <h2 className="font-display text-xl font-bold mb-6" style={{ color: '#00f0ff' }}>
            Transmission Log ({comments.length})
          </h2>

          {err && <div className="mb-4"><Alert kind="error">{err}</Alert></div>}

          {user && (
            <form onSubmit={addComment} className="flex gap-3 mb-8">
              <input
                required
                placeholder="Add a comment…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
                style={inputStyle}
              />
              <button type="submit" className="rounded-lg px-6 text-xs font-semibold tracking-[0.15em] uppercase" style={neonButton(true)}>
                Send
              </button>
            </form>
          )}

          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-sm" style={{ color: 'rgba(226,232,240,0.45)' }}>
                No comments yet — be the first signal.
              </p>
            )}
            {comments.map((c) => (
              <div
                key={c._id}
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(13,17,38,0.55)',
                  border: '1px solid rgba(0,240,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: '#9beaff' }}>
                    {c.user?.name ?? 'Anonymous'}
                  </span>
                  <div className="flex items-center gap-3">
                    {c.date && (
                      <span className="text-xs" style={{ color: 'rgba(226,232,240,0.35)' }}>
                        {new Date(c.date).toLocaleDateString()}
                      </span>
                    )}
                    {user && (user._id === c.user?._id || user.role === 'admin' || user.role === 'eb') && (
                      <button
                        onClick={() => deleteComment(c._id)}
                        className="text-xs hover:text-red-400"
                        style={{ color: 'rgba(255,120,120,0.7)' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'rgba(226,232,240,0.75)' }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 text-center">
          <Link
            href="/blogs"
            className="inline-block rounded-full px-8 py-3 text-sm font-semibold tracking-[0.15em] uppercase"
            style={neonButton(false)}
          >
            ← Back to all stories
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
