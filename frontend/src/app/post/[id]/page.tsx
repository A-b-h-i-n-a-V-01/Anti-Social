'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Lock, Heart, MessageCircle, ArrowLeft, Send, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';

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
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading || !post) return null;

  return (
    <div className="min-h-screen bg-[#07070b]">
      <Navbar />
      <main className="max-w-2xl mx-auto pt-24 pb-16 px-4">
        {/* Navigation back */}
        <button
          onClick={() => router.back()}
          className="btn-subtle mb-5 text-xs py-1.5 px-3.5 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to stream</span>
        </button>

        {/* The Centerpiece Locked Post Card */}
        <div className="glass-panel p-6 mb-6 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-violet-500 to-rose-400 p-[1.5px]">
              <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center font-bold text-white text-sm">
                {post.author.username[0].toUpperCase()}
              </div>
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>@{post.author.username}</span>
                {post.author.is_premium && <span className="pro-pill">PRO</span>}
              </div>
              <div className="text-[11px] text-zinc-400">
                Shared {timeAgo(post.timestamp)} • Zero visibility protocol
              </div>
            </div>
          </div>

          {/* The High-Stakes Unavailable Box */}
          <div className="bg-gradient-to-b from-violet-950/20 to-black/40 border border-violet-500/30 rounded-2xl p-8 text-center mb-6 relative overflow-hidden">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 shadow-lg shadow-violet-500/20">
              <Lock className="w-7 h-7" />
            </div>

            <h2 className="text-lg font-bold text-white mb-2">
              This content is permanently unavailable.
            </h2>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed mb-5">
              The author poured their heart and soul into this transmission.
              We intercepted it, stored it in SQLite, and deliberately refused to serialize it.
            </p>

            <button
              onClick={() => router.push('/premium')}
              className="btn-subtle text-xs py-2 px-4 inline-flex items-center gap-2 hover:border-amber-400/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Upgrade to VIP (will not unlock this)</span>
            </button>
          </div>

          {/* Post Metrics & Like */}
          <div className="flex items-center gap-6 pt-3 border-t border-white/5 text-xs text-zinc-400">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-all cursor-pointer ${
                liked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount} likes</span>
            </button>

            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-violet-400" />
              <span>{comments.length} comments</span>
            </div>
          </div>
        </div>

        {/* Discussion Section */}
        <div className="glass-panel p-6 border border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4 flex items-center gap-2">
            <span>Blind Responses</span>
            <span className="text-[10px] text-zinc-400 font-normal">({comments.length})</span>
          </h3>

          {/* Comment composer */}
          <form onSubmit={handleComment} className="flex gap-2.5 mb-6">
            <input
              className="input-modern text-xs"
              placeholder="React to what you think this post said..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="btn-gradient px-4 py-2 text-xs flex items-center gap-1.5 flex-shrink-0"
            >
              <Send className="w-3 h-3" />
              <span>{submitting ? '...' : 'Send'}</span>
            </button>
          </form>

          {/* Comments list */}
          {comments.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400 italic">
              No reactions yet. Join in and react blindly.
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((c: any) => (
                <div key={c.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {c.author.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-200">@{c.author.username}</span>
                      <span className="text-[10px] text-zinc-400">{timeAgo(c.timestamp)}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center gap-2 text-[11px] text-zinc-400">
                      <Lock className="w-3 h-3 text-rose-400" />
                      <span>This comment has been hidden from public scrutiny.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
