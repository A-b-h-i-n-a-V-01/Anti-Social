'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Share2, Lock, Sparkles, Check } from 'lucide-react';

export default function PostCard({ post, onLikeToggle }: { post: any; onLikeToggle?: () => void }) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [liking, setLiking] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(window.location.origin + `/post/${post.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      onClick={() => router.push(`/post/${post.id}`)}
      className="glass-card p-5 mb-4 cursor-pointer group hover:border-violet-500/40 transition-all duration-300 relative overflow-hidden"
    >
      <div className="card-glow-overlay" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <div className="flex items-center gap-3">
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${post.author.username}`);
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-rose-400 p-[1.5px] cursor-pointer shadow-md hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-[#111119] rounded-full flex items-center justify-center font-bold text-white text-sm">
              {post.author.username[0].toUpperCase()}
            </div>
          </div>
          <div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/profile/${post.author.username}`);
              }}
              className="font-semibold text-sm text-zinc-100 hover:text-violet-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>@{post.author.username}</span>
              {post.author.is_premium && <span className="pro-pill text-[9px] py-0 px-1.5">PRO</span>}
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1">
              <span>{timeAgo(post.timestamp)}</span>
              <span>•</span>
              <span className="text-zinc-400">Encrypted in the Void</span>
            </div>
          </div>
        </div>

        {/* Locked Status Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-medium">
          <Lock className="w-3 h-3 text-rose-400" />
          <span>Restricted</span>
        </div>
      </div>

      {/* Locked Content Box */}
      <div className="locked-box mb-4 relative z-10 group/box">
        <div className="w-11 h-11 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-300 shadow-inner flex-shrink-0 group-hover/box:scale-110 transition-transform">
          <Lock className="w-5 h-5 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-xs uppercase tracking-wider text-violet-300 flex items-center gap-1.5 mb-1">
            <span>Hidden Content Stream</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed truncate">
            @{post.author.username} posted high-value thoughts. Guaranteed to never be revealed.
          </p>
        </div>
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs text-zinc-400 relative z-10">
        <div className="flex items-center gap-5">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              liked ? 'text-rose-500 font-semibold scale-105' : 'hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform ${liking ? 'scale-125' : ''} ${liked ? 'fill-current text-rose-500' : ''}`} />
            <span>{likeCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/post/${post.id}`);
            }}
            className="flex items-center gap-1.5 hover:text-violet-400 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments}</span>
          </button>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors cursor-pointer px-2.5 py-1 rounded-full hover:bg-white/5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied' : 'Share'}</span>
        </button>
      </div>
    </article>
  );
}
