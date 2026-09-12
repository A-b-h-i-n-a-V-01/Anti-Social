'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { UserCheck, UserPlus, Lock, Sparkles, Grid3X3 } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (user) loadProfile();
  }, [user, loading, params.username]);

  const loadProfile = async () => {
    setFetching(true);
    try {
      const data = await api.getProfile(params.username as string);
      setProfile(data);
      setFollowing(data.is_following);
    } catch {}
    setFetching(false);
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (following) {
        await api.unfollow(profile.id);
        setFollowing(false);
        setProfile((p: any) => ({ ...p, followers: p.followers - 1 }));
      } else {
        await api.follow(profile.id);
        setFollowing(true);
        setProfile((p: any) => ({ ...p, followers: p.followers + 1 }));
      }
    } catch {}
    setFollowLoading(false);
  };

  if (loading || fetching) return null;
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07070b] flex items-center justify-center text-xs text-zinc-400">
        Account not located in the void.
      </div>
    );
  }

  const isOwnProfile = user?.username === profile.username;

  return (
    <div className="min-h-screen bg-[#07070b]">
      <Navbar />
      <main className="max-w-2xl mx-auto pt-24 pb-16 px-4">
        {/* Profile Card Header */}
        <div className="glass-panel p-6 mb-6 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-rose-400 p-[2px] shadow-xl shadow-violet-500/20">
                <div className="w-full h-full bg-[#0e0e16] rounded-[22px] flex items-center justify-center text-2xl font-black text-white">
                  {profile.username[0].toUpperCase()}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-black text-white tracking-tight">
                    @{profile.username}
                  </h1>
                  {profile.is_premium && <span className="pro-pill">PRO</span>}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {profile.bio || "Active participant in the silent collective."}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400 font-medium">
                  <span>
                    <strong className="text-white">{profile.post_count}</strong> transmissions
                  </span>
                  <span>
                    <strong className="text-white">{profile.followers}</strong> observers
                  </span>
                  <span>
                    <strong className="text-white">{profile.following}</strong> observing
                  </span>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={
                  following
                    ? 'btn-subtle text-xs py-2 px-4'
                    : 'btn-gradient text-xs py-2 px-5'
                }
              >
                {following ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Observing</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Observe</span>
                  </>
                )}
              </button>
            )}
          </div>

          {following && !isOwnProfile && (
            <div className="mt-4 p-3 rounded-xl bg-violet-950/40 border border-violet-500/25 text-violet-300 text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>You now observe @{profile.username}. Their transmissions remain 100% invisible to you.</span>
            </div>
          )}
        </div>

        {/* Transmissions Grid Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Grid3X3 className="w-4 h-4 text-violet-400" />
            <span>Encrypted Vault ({profile.post_count})</span>
          </div>
        </div>

        {/* Transmissions Grid */}
        {profile.posts.length === 0 ? (
          <div className="glass-panel p-10 text-center border border-dashed border-white/10">
            <Lock className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">
              {isOwnProfile
                ? "You haven't transmitted anything into the void yet."
                : `@${profile.username} hasn't transmitted anything yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {profile.posts.map((p: any) => (
              <div
                key={p.id}
                onClick={() => router.push(`/post/${p.id}`)}
                className="aspect-square glass-panel p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-violet-500/50 hover:scale-[1.03] transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-xl bg-violet-600/10 group-hover:bg-violet-600/25 border border-violet-500/20 flex items-center justify-center text-violet-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  ❤️ {p.likes} • 💬 {p.comments}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
