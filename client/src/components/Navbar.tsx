'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import GooeyNav from '@/components/GooeyNav';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const activeIndex = NAV_ITEMS.findIndex(
    (i) => i.href === '/' ? pathname === '/' : pathname.startsWith(i.href)
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled || menuOpen ? 'rgba(5, 8, 22, 0.75)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled || menuOpen ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid rgba(0,240,255,0.08)' : '1px solid transparent',
        boxShadow: scrolled || menuOpen ? '0 4px 40px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/logo.png"
              alt="ASTRONITR Logo"
              fill
              sizes="36px"
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
              priority
            />
          </div>
          <span
            className="font-bold text-base tracking-[0.15em] uppercase hidden sm:block"
            style={{
              color: '#e2e8f0',
              textShadow: '0 0 20px rgba(0,240,255,0.3)',
            }}
          >
            ASTRONITR
          </span>
        </Link>

        
        <div className="hidden md:flex items-center">
          <GooeyNav
            items={NAV_ITEMS}
            particleCount={12}
            particleDistances={[80, 8]}
            particleR={80}
            initialActiveIndex={activeIndex >= 0 ? activeIndex : 0}
            animationTime={500}
            timeVariance={250}
            colors={[1, 2, 3, 1, 2, 3, 1, 2]}
          />
        </div>

        
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-xs font-semibold tracking-[0.15em] uppercase rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(90deg, #00f0ff, #a200ff)',
                  color: '#050816',
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="text-xs font-semibold tracking-[0.15em] uppercase rounded-full px-4 py-2 transition-colors"
                style={{
                  border: '1px solid rgba(0,240,255,0.35)',
                  color: '#00f0ff',
                  background: 'rgba(0,240,255,0.06)',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold tracking-[0.15em] uppercase rounded-full px-5 py-2 transition-all duration-300 hover:scale-105"
              style={{
                border: '1px solid rgba(0,240,255,0.35)',
                color: '#00f0ff',
                background: 'rgba(0,240,255,0.06)',
                textShadow: '0 0 12px rgba(0,240,255,0.5)',
              }}
            >
              Join / Login
            </Link>
          )}
        </div>

        
        <button
          className="md:hidden p-2 rounded-lg transition-colors duration-200"
          style={{ color: '#e2e8f0', background: 'rgba(0,240,255,0.06)' }}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      
      {menuOpen && (
        <nav className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-sm font-semibold tracking-[0.2em] uppercase rounded-lg px-3"
              style={{
                color: pathname === item.href ? '#00f0ff' : '#e2e8f0',
                background:
                  pathname === item.href ? 'rgba(0,240,255,0.08)' : 'transparent',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex-1 text-center text-xs font-semibold tracking-[0.15em] uppercase rounded-full px-4 py-3"
                  style={{ background: 'linear-gradient(90deg, #00f0ff, #a200ff)', color: '#050816' }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="flex-1 text-xs font-semibold tracking-[0.15em] uppercase rounded-full px-4 py-3"
                  style={{ border: '1px solid rgba(0,240,255,0.35)', color: '#00f0ff' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex-1 text-center text-xs font-semibold tracking-[0.15em] uppercase rounded-full px-4 py-3"
                style={{ background: 'linear-gradient(90deg, #00f0ff, #a200ff)', color: '#050816' }}
              >
                Join / Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
