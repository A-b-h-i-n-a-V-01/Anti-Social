'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LogIn, Lock, ArrowRight, ShieldCheck, Mail, Key } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/feed');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 bg-[#07070b] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none top-1/4 left-1/3" />

      <div className="glass-panel p-8 w-full max-w-md border border-white/10 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600 to-rose-500 p-[1.5px] mb-3 shadow-lg shadow-violet-500/25">
            <div className="w-full h-full bg-[#0c0c14] rounded-[14px] flex items-center justify-center text-2xl">
              🫥
            </div>
          </div>
          <h1 className="text-xl font-black text-white">Welcome Back</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Nothing has changed. All posts are still completely locked.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-violet-400" />
              <span>Email Address</span>
            </label>
            <input
              className="input-modern text-xs"
              type="email"
              placeholder="name@domain.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-violet-400" />
              <span>Password</span>
            </label>
            <input
              className="input-modern text-xs"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full py-3 text-xs font-bold mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          New to the silent network?{' '}
          <Link href="/auth/register" className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-4">
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
