'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store } from '../../lib/store';
import BurgerMenu from './BurgerMenu';

export default function Header({ variant = 'solid' }: { variant?: 'solid' | 'hero' }) {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const heroMode = variant === 'hero' && isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
  const update = () => {
    setCartCount(Store.cart().length);
    setFavCount(Store.favorites().length);
  };
  
  update();
  
  const prev = (window as any).__storeUpdate;
  (window as any).__storeUpdate = () => {
    update();
    if (prev) prev();
  };

  // Добавляем слушатель события storage
  window.addEventListener('storage', update);

  return () => {
    (window as any).__storeUpdate = prev;
    window.removeEventListener('storage', update);
  };
}, []);

  useEffect(() => {
    if (searchOpen) {
      document.body.classList.add('search-open');
    } else {
      document.body.classList.remove('search-open');
    }
  }, [searchOpen]);

  const headerClass = `site-header ${heroMode ? 'site-header--hero' : 'site-header--solid'} ${heroMode && scrolled ? 'is-scrolled' : ''}`;

  return (
    <>
      <header className={headerClass}>
        <div className="site-header__inner">
          <BurgerMenu />
          <Link href="/" className="logo">HERMITAGE</Link>
          <div className="header-actions">
            <button
              className="icon-btn"
              aria-label="Поиск"
              onClick={() => setSearchOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" />
              </svg>
            </button>
            <Link href="/favorites" className="icon-btn" aria-label="Избранное">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {favCount > 0 && <span className="badge-count">{favCount}</span>}
            </Link>
            <Link href="/account" className="icon-btn" aria-label="Кабинет">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM3 21v-1a9 9 0 0118 0v1" />
              </svg>
            </Link>
            <Link href="/cart" className="icon-btn" aria-label="Корзина">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      <div className={`search-panel ${searchOpen ? 'is-open' : ''}`}>
        <div className="search-panel__box">
          <input
            type="search"
            placeholder="Поиск..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const q = (e.target as HTMLInputElement).value.trim();
                if (q) {
                  window.location.href = `/catalog?search=${encodeURIComponent(q)}`;
                }
              }
            }}
          />
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => setSearchOpen(false)}
          >
            Закрыть
          </button>
        </div>
      </div>
    </>
  );
}