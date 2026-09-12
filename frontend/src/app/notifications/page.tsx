'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Bell, Heart, MessageCircle, UserPlus, FileText, Lock, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notifs, setNotifs] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (user) loadNotifs();
  }, [user, loading]);

  const loadNotifs = async () => {
    setFetching(true);
    try {
      const data = await api.getNotifications();
      setNotifs(data);
      await api.markAllRead();
    } catch {}
    setFetching(false);
  };

  const handleClick = (n: any) => {
    if (n.post_id) router.push(`/post/${n.post_id}`);
    else if (n.actor?.username) router.push(`/profile/${n.actor.username}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-400" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-violet-400" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const timeAgo = (ts: string) => {
    if (!ts) return '';
    const diff = (Date.now() - new Date(ts).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
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
              <Bell className="w-5 h-5 text-violet-400" />
              <span>Activity In The Dark</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live updates for events regarding posts you will never get to read.
            </p>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono uppercase bg-white/5 px-2.5 py-1 rounded-full border border-white/5 flex items-center gap-1">
            <CheckCheck className="w-3 h-3 text-emerald-400" />
            <span>Marked Read</span>
          </span>
        </div>

        {/* Notifications List */}
        {fetching ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-panel p-4 flex gap-3 items-center">
                <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
                  <div className="h-2.5 w-20 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : notifs.length === 0 ? (
          <div className="glass-panel p-10 text-center border border-dashed border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 mx-auto mb-3">
              <Bell className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="font-bold text-sm text-zinc-200 mb-1">Peace & Quiet</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Nobody has interacted with your invisible posts yet. Go broadcast something to start the mystery.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifs.map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className="glass-panel p-3.5 flex items-center gap-3.5 cursor-pointer hover:border-violet-500/40 hover:bg-white/[0.04] transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-[1.5px] flex-shrink-0">
                  <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {n.actor?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-200">
                    <span className="p-1 rounded-md bg-white/5">{getIcon(n.type)}</span>
                    <span className="font-medium truncate">{n.message}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{timeAgo(n.timestamp)}</div>
                </div>

                {n.post_id && (
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-violet-300 transition-colors flex-shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
