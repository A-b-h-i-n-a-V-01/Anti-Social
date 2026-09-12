'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { TrendingUp, Lock, EyeOff, Hash, Sparkles, UserPlus } from 'lucide-react';

const FAKE_TRENDING = [
  { tag: 'HackathonDrama', interactions: '48.2K', desc: 'Nobody knows what happened.' },
  { tag: 'BreakingSecret', interactions: '32.1K', desc: 'Confidential and permanently hidden.' },
  { tag: 'UnpopularOpinion', interactions: '19.4K', desc: 'You will never hear it.' },
  { tag: 'MajorAnnouncement', interactions: '14.8K', desc: 'Post content scrubbed.' },
  { tag: 'CatVideoLeak', interactions: '11.0K', desc: 'Audio and video blocked.' },
];

export default function ExplorePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (user) loadExplore();
  }, [user, loading]);

  const loadExplore = async () => {
    setFetching(true);
    try {
      const data = await api.getExplore();
      setPosts(data);
    } catch {}
    setFetching(false);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#07070b]">
      <Navbar />
      <main className="max-w-2xl mx-auto pt-24 pb-16 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>Explore The Unknown</span>
              <Sparkles className="w-4 h-4 text-violet-400" />
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Discover what the world is buzzing about without having any way to see it.
            </p>
          </div>
        </div>

        {/* Trending Hashtags Section */}
        <div className="glass-panel p-5 mb-6 border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Trending Obscurities
            </h2>
          </div>

          <div className="space-y-3">
            {FAKE_TRENDING.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-violet-300 group-hover:bg-violet-500/10 transition-colors">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-violet-300 transition-colors">
                      #{item.tag}
                    </div>
                    <div className="text-[11px] text-zinc-400">{item.desc}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400">{item.interactions}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/5">
                    Redacted
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discovery Feed Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <EyeOff className="w-3.5 h-3.5 text-violet-400" />
            <span>Encrypted Grid Feed</span>
          </h2>
          <span className="text-[10px] text-zinc-400">Tap to inspect unavailable post</span>
        </div>

        {fetching ? (
          <div className="grid grid-cols-3 gap-2.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-panel p-8 text-center border border-dashed border-white/10">
            <Lock className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">No public posts found. Start posting to silence the network.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {posts.map((p: any) => (
              <div
                key={p.id}
                onClick={() => router.push(`/post/${p.id}`)}
                className="aspect-square glass-panel p-2 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-violet-500/50 hover:scale-[1.03] transition-all duration-200 group relative overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-violet-600/10 group-hover:bg-violet-600/25 border border-violet-500/20 flex items-center justify-center text-violet-300 transition-colors">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-zinc-300">@{p.author?.username}</span>
                <span className="text-[9px] font-mono text-zinc-400">
                  ❤️ {p.likes} • 💬 {p.comments}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
