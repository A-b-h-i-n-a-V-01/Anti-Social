'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import ExitPopup from '@/components/ExitPopup';
import { Send, EyeOff, Sparkles, Inbox, RefreshCw, AlertCircle } from 'lucide-react';

export default function FeedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [postMsg, setPostMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (user) loadFeed();
  }, [user, loading]);

  const loadFeed = async () => {
    setFetching(true);
    try {
      const data = await api.getFeed();
      setPosts(data);
    } catch {}
    setFetching(false);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    setPosting(true);
    try {
      await api.createPost({ content: postContent });
      setPostContent('');
      setPostMsg("Post stored in database and permanently encrypted away from everyone.");
      setTimeout(() => setPostMsg(''), 5000);
      loadFeed();
    } catch {}
    setPosting(false);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#07070b]">
      <Navbar />
      <ExitPopup />
      <main className="max-w-2xl mx-auto pt-24 pb-16 px-4">
        {/* Creator Composer Box */}
        <div className="glass-panel p-5 mb-6 border border-white/10 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <EyeOff className="w-4 h-4 text-violet-400" />
              <span>Broadcast Into The Abyss</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono uppercase bg-white/5 px-2 py-0.5 rounded-full">
              Never Readable
            </span>
          </div>

          <form onSubmit={handlePost}>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-[1.5px] flex-shrink-0">
                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center font-bold text-white text-sm">
                  {user?.username[0].toUpperCase()}
                </div>
              </div>

              <div className="flex-1">
                <textarea
                  className="input-modern w-full resize-none text-sm placeholder:text-zinc-500"
                  placeholder="Share a secret, a profound thought, or your life story. It will be hidden immediately..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={3}
                />

                <div className="flex items-center justify-between mt-3">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Real likes & notifications active</span>
                  </div>

                  <button
                    type="submit"
                    disabled={posting || !postContent.trim()}
                    className={`btn-gradient py-2 px-5 text-xs ${
                      posting || !postContent.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{posting ? 'Obscuring...' : 'Post to Void'}</span>
                  </button>
                </div>
              </div>
            </div>

            {postMsg && (
              <div className="mt-3 p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-200 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>{postMsg}</span>
              </div>
            )}
          </form>
        </div>

        {/* Section Title & Refresh */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <span>Global Stream</span>
            <span className="text-[10px] text-zinc-400 font-normal">({posts.length} hidden)</span>
          </h2>
          <button
            onClick={loadFeed}
            disabled={fetching}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Refresh feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin text-violet-400' : ''}`} />
          </button>
        </div>

        {/* Feed Cards List */}
        {fetching ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-panel p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 w-28 bg-white/5 rounded animate-pulse" />
                    <div className="h-2.5 w-16 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />
                <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-panel p-12 text-center border border-dashed border-white/10">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 mb-4">
              <Inbox className="w-7 h-7 text-violet-400" />
            </div>
            <h3 className="font-bold text-base text-zinc-200 mb-1">Total Silence</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Follow users to populate your stream. Don't worry, you still won't be able to read what they post.
            </p>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLikeToggle={loadFeed} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
