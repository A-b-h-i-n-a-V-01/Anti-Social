'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Home, Compass, Bell, Sparkles, User, LogOut, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { href: '/feed', icon: Home, label: 'Feed' },
    { href: '/explore', icon: Compass, label: 'Explore' },
    { href: '/notifications', icon: Bell, label: 'Alerts' },
    { href: '/premium', icon: Sparkles, label: 'Premium' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <nav className="max-w-5xl mx-auto glass-panel px-5 py-2.5 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-2xl">
        {/* Brand */}
        <Link href="/feed" className="flex items-center gap-2.5 group text-decoration-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-rose-400 p-[1.5px] shadow-lg shadow-violet-500/25 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#0a0a10] rounded-[10px] flex items-center justify-center text-lg">
              🫥
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight leading-none text-holo">
              AntiSocial
            </span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-semibold mt-0.5">
              Zero Visibility
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  active
                    ? 'text-white bg-white/10 shadow-inner border border-white/15'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-violet-400' : ''}`} />
                <span className="hidden sm:inline">{item.label}</span>
                {item.href === '/premium' && !user.is_premium && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right User Area */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all duration-200 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center text-xs font-bold text-white">
                {user.username[0].toUpperCase()}
              </div>
            </div>
            <span className="text-xs font-medium text-zinc-200 hidden md:inline">
              @{user.username}
            </span>
            {user.is_premium && (
              <span className="pro-pill">PRO</span>
            )}
          </button>

          {/* User dropdown popup */}
          {menuOpen && (
            <div className="absolute right-0 top-11 min-w-[200px] glass-panel p-2 z-50 border border-white/15 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-[11px] text-zinc-400 font-medium">Signed in as</p>
                <p className="text-xs font-bold text-white truncate">@{user.username}</p>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-rose-400/80">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Posts remain inaccessible</span>
                </div>
              </div>

              <Link
                href={`/profile/${user.username}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-violet-400" />
                <span>My Profile</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  router.push('/');
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
