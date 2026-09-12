'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import confetti from 'canvas-confetti';
import { Check, X, Sparkles, ShieldCheck, CreditCard, Lock, ArrowRight, Zap, Crown } from 'lucide-react';

type PremiumState = 'idle' | 'paying' | 'paid';

export default function PremiumPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<PremiumState>('idle');

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading]);

  const handleSubscribe = async () => {
    setState('paying');
    // Dramatic simulated banking delay
    await new Promise((r) => setTimeout(r, 2000));
    try {
      await api.subscribe();
      await refreshUser();
      setState('paid');
      // Fire celebratory confetti for the useless upgrade!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#ec4899', '#fbbf24'],
        });
      } catch {}
    } catch {
      setState('idle');
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#07070b]">
      <Navbar />
      <main className="max-w-xl mx-auto pt-24 pb-16 px-4">
        {/* Already Premium or Just Paid */}
        {(user?.is_premium || state === 'paid') && state !== 'paying' ? (
          <div className="glass-panel p-8 text-center border border-amber-500/30 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-violet-600" />

            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 shadow-lg shadow-amber-500/20">
              <Crown className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Anti-Social VIP Pro</span>
            </div>

            <h1 className="text-2xl font-extrabold text-white mb-2">
              {state === 'paid' ? 'Transaction Settled.' : "You're a Valued Member."}
            </h1>
            <p className="text-sm text-zinc-400 mb-6">
              Your account now has highest-tier status across the entire network.
            </p>

            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 mb-6 text-left space-y-3">
              {[
                { title: 'Golden PRO Badge on your name', active: true },
                { title: 'Full access to comment counters', active: true },
                { title: 'Ability to see like tallies in real-time', active: true },
                { title: 'Readable post content', active: false },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  {f.active ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3" />
                    </div>
                  )}
                  <span className={f.active ? 'text-zinc-200' : 'text-rose-300 font-semibold'}>
                    {f.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-6 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>You still cannot see a single post. Thank you for your support.</span>
            </div>

            <button
              onClick={() => router.push('/feed')}
              className="btn-gradient w-full py-3 text-xs"
            >
              <span>Return to Feeding the Void</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : state === 'paying' ? (
          /* Payment in progress simulation */
          <div className="glass-panel p-10 text-center border border-violet-500/30">
            <div className="w-16 h-16 mx-auto rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 mb-5 animate-spin">
              <CreditCard className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Simulating Secure Payment...</h2>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
              Charging ₹99.00 INR to your imaginary wallet and provisioning zero additional visibility permissions.
            </p>
          </div>
        ) : (
          /* Pricing Card */
          <div className="glass-panel p-8 text-center border border-white/10 relative overflow-hidden shadow-2xl">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Unlock Premium Experience</span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">₹99</span>
                <span className="text-xs text-zinc-400 font-medium">/ lifetime</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                Pay once. Experience the psychological luxury of seeing absolutely nothing.
              </p>
            </div>

            {/* Feature comparison table */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 mb-6 text-left space-y-3.5">
              {[
                { title: 'Exclusive PRO badge next to your handle', highlight: false },
                { title: 'View who liked posts that cannot be read', highlight: false },
                { title: 'Follow unlimited accounts into silence', highlight: false },
                { title: 'Encrypted null payload guarantee', highlight: true },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className={feature.highlight ? 'text-violet-300 font-medium' : 'text-zinc-300'}>
                    {feature.title}
                  </span>
                </div>
              ))}

              <div className="pt-2 border-t border-white/5 flex items-center gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
                  <X className="w-3 h-3" />
                </div>
                <span className="text-rose-300 font-medium">Seeing post contents</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleSubscribe}
              className="btn-gradient w-full py-3.5 text-sm font-bold shadow-lg shadow-violet-500/30"
            >
              <span>Upgrade Now for ₹99</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>Simulated payment • 100% money back guarantee of dissatisfaction</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
