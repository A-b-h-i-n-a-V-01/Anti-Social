'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function PostCard({ post, onLikeToggle }: { post: any; onLikeToggle?: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [liking, setLiking] = useState(false);

  const timeAgo = (ts: string) => {
    const diff = (Date.now() - new Date(ts).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liking) return;
    setLiking(true);
    try {
      const token = localStorage.getItem('as_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/${post.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likes);
      onLikeToggle?.();
    } catch {}
    setLiking(false);
  };

  return (
    <div
      className="glass"
      style={{ padding: '20px', marginBottom: '12px', cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(124,92,252,0.15)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
      onClick={() => router.push(`/post/${post.id}`)}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div
          className="avatar"
          onClick={e => { e.stopPropagation(); router.push(`/profile/${post.author.username}`); }}
          style={{ cursor: 'pointer' }}
        >
          {post.author.username[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
            {post.author.username}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {timeAgo(post.timestamp)}
          </div>
        </div>
      </div>

      {/* Locked content */}
      <div className="locked-content" style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '1.3rem' }}>🔒</span>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '2px', color: 'var(--text)' }}>Content Unavailable</div>
          <div style={{ fontSize: '0.82rem' }}>{post.author.username} posted something.</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button
          onClick={handleLike}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            color: liked ? 'var(--danger)' : 'var(--text-muted)',
            fontSize: '0.88rem', fontWeight: liked ? 600 : 400,
            transition: 'all 0.2s ease',
            transform: liking ? 'scale(1.2)' : 'scale(1)'
          }}
        >
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>

        <button
          onClick={e => { e.stopPropagation(); router.push(`/post/${post.id}`); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.88rem' }}
        >
          💬 {post.comments}
        </button>

        <button
          onClick={e => { e.stopPropagation(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.88rem' }}
        >
          🔗 Share
        </button>
      </div>
    </div>
  );
}
