'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Lock, EyeOff, ShieldCheck, ArrowRight, Zap, Ghost } from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!loading && user) router.push('/feed');
  }, [user, loading]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 40 - 20,
        y: (e.clientY / window.innerHeight) * 40 - 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Dynamic Floating Glow Orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          top: '10%',
          left: '15%',
          transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`,
        }}
      />
      <div
        className="absolute w-[450px] h-[450px] rounded-full bg-rose-500/15 blur-[120px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          bottom: '10%',
          right: '15%',
          transform: `translate(${-mousePos.x * 1.2}px, ${-mousePos.y * 1.2}px)`,
        }}
      />

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-md mb-8 shadow-lg shadow-violet-500/10 animate-float-slow">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          The World's Most Private Network
        </span>
        <span className="text-[11px] text-zinc-400">• 100% Inaccessible</span>
      </div>

      {/* Main Hero Header */}
      <div className="text-center max-w-2xl z-10">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-rose-400 p-[2px] shadow-2xl shadow-violet-500/30">
            <div className="w-full h-full bg-[#0a0a12] rounded-[22px] flex items-center justify-center text-4xl">
              🫥
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
          <span className="text-holo">Anti</span>
          <span className="text-white">Social</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-300 font-medium mb-3">
          Connect with everyone. Read absolutely nothing.
        </p>
        <p className="text-sm text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed">
          The next-generation social network engineered from the ground up to hide posts from everyone — including the people who wrote them.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 text-left">
          {[
            { icon: ShieldCheck, title: 'Real Auth', desc: 'Secure JWT accounts' },
            { icon: Zap, title: 'Real Likes', desc: 'Active notifications' },
            { icon: EyeOff, title: 'Zero Feed', desc: 'Content permanently null' },
            { icon: Lock, title: 'Fake Premium', desc: '₹99 to still see nothing' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="glass-panel p-3.5 flex flex-col gap-2 rounded-2xl hover:border-violet-500/40 transition-all duration-300"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-violet-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-200">{item.title}</div>
                  <div className="text-[11px] text-zinc-400 leading-tight mt-0.5">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/auth/register">
            <button className="btn-gradient w-full sm:w-auto px-8 py-3.5 text-sm">
              <span>Join Anti-Social</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/auth/login">
            <button className="btn-subtle w-full sm:w-auto px-7 py-3 text-sm">
              <span>Sign In</span>
            </button>
          </Link>
        </div>

        {/* Footer subtle punchline */}
        <div className="mt-14 flex items-center justify-center gap-2 text-xs text-zinc-400">
          <Ghost className="w-4 h-4 text-violet-400/80" />
          <span>Join thousands of people who have never read a single post.</span>
        </div>
      </div>
    </main>
  );
}
