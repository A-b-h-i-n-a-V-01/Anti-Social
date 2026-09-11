'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function PostDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showUnavailable, setShowUnavailable] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (user) loadPost();
  }, [user, loading]);

  const loadPost = async () => {
    try {
      const data = await api.getPost(Number(params.id));
      setPost(data);
      setLiked(data.liked_by_me);
      setLikeCount(data.likes);
      const cData = await api.getComments(Number(params.id));
      setComments(cData);
    } catch {}
  };

  const handleLike = async () => {
    try {
      const data = await api.toggleLike(Number(params.id));
      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch {}
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await api.addComment(Number(params.id), commentText);
      setCommentText('');
      await loadPost();
    } catch {}
    setSubmitting(false);
  };

  const timeAgo = (ts: string) => {
    if (!ts) return '';
    const diff = (Date.now() - new Date(ts).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  if (loading || !post) return null;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', maxWidth: '600px', margin: '0 auto', padding: '80px 16px 40px' }}>

        {/* Back */}
        <button onClick={() => router.back()} className="btn-ghost" style={{ marginBottom: '20px', fontSize: '0.85rem' }}>
          ← Back
        </button>

        {/* Post card */}
        <div className="glass" style={{ padding: '28px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div className="avatar">{post.author.username[0].toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{post.author.username}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{timeAgo(post.timestamp)}</div>
            </div>
          </div>

          {/* The main bit */}
          <div style={{
            padding: '32px 24px', textAlign: 'center',
            background: 'var(--surface-2)', borderRadius: '12px',
            border: '1px dashed rgba(124,92,252,0.3)',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>This content is unavailable.</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
              We know you want to see it.<br/>
              <strong style={{ color: 'var(--text)' }}>That's the problem.</strong>
            </p>
            <button
              className="btn-ghost"
              style={{ fontSize: '0.8rem' }}
              onClick={() => router.push('/premium')}
            >
              ⭐ Upgrade to Premium — still won't work
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={handleLike}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                color: liked ? 'var(--danger)' : 'var(--text-muted)',
                fontWeight: liked ? 600 : 400, fontSize: '0.9rem'
              }}
            >
              {liked ? '❤️' : '🤍'} {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              💬 {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Comments section */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '16px', fontSize: '0.95rem' }}>Comments</h3>

          {/* Add comment */}
          <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div className="avatar avatar-sm">{user?.username[0].toUpperCase()}</div>
            <input
              className="input"
              placeholder="Add a comment... (also hidden)"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <button className="btn-primary" type="submit" disabled={submitting || !commentText.trim()} style={{ whiteSpace: 'nowrap', padding: '8px 16px', fontSize: '0.85rem' }}>
              {submitting ? '...' : 'Post'}
            </button>
          </form>

          {/* Comments list */}
          {comments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>
              No comments yet. Be the first to react to something you can't see.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments.map((c: any) => (
                <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div className="avatar avatar-sm">{c.author.username[0].toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.author.username}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{timeAgo(c.timestamp)}</span>
                    </div>
                    <div className="locked-content" style={{ padding: '8px 12px' }}>
                      <span style={{ fontSize: '0.9rem' }}>🔒</span>
                      <span style={{ fontSize: '0.82rem' }}>This comment is unavailable.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
