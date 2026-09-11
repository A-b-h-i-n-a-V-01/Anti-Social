'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { href: '/feed', icon: '🏠', label: 'Feed' },
    { href: '/explore', icon: '🔥', label: 'Explore' },
    { href: '/notifications', icon: '🔔', label: 'Alerts' },
    { href: '/premium', icon: '⭐', label: 'Premium' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      height: '60px',
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      justifyContent: 'space-between'
    }}>
      {/* Logo */}
      <Link href="/feed" style={{ textDecoration: 'none' }}>
        <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>
          <span className="gradient-text">Anti</span>
          <span style={{ color: 'var(--text-muted)' }}>Social</span>
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} style={{
            padding: '6px 14px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            color: pathname === item.href ? 'var(--text)' : 'var(--text-muted)',
            background: pathname === item.href ? 'var(--surface-2)' : 'transparent',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <span>{item.icon}</span>
            <span style={{ display: 'none' }} className="md:inline">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User menu */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <div className="avatar avatar-sm" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
            {user.username[0].toUpperCase()}
          </div>
          {user.is_premium && <span className="premium-badge">PRO</span>}
        </button>

        {menuOpen && (
          <div className="glass-sm" style={{
            position: 'absolute', right: 0, top: '44px',
            minWidth: '180px', padding: '8px', zIndex: 200
          }}>
            <Link href={`/profile/${user.username}`}
              style={{ display: 'block', padding: '8px 12px', color: 'var(--text)', textDecoration: 'none', borderRadius: '8px', fontSize: '0.9rem' }}
              onClick={() => setMenuOpen(false)}>
              👤 Profile
            </Link>
            <button
              onClick={() => { logout(); router.push('/'); setMenuOpen(false); }}
              style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', borderRadius: '8px', fontSize: '0.9rem' }}
            >
              🚪 Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
