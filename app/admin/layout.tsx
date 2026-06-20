'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'Дашборд' },
    { href: '/admin/products', label: 'Товары' },
    { href: '/admin/orders', label: 'Заказы' },
    { href: '/admin/categories', label: 'Категории' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f0' }}>
      {/* Сайдбар */}
      <aside style={{
        width: '260px',
        background: '#1a1a1a',
        color: '#fff',
        padding: '24px 0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid #333' }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '24px',
            margin: 0,
          }}>
            HERMITAGE<span style={{ color: '#b89968' }}>DECOR</span>
          </h2>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
            Админ-панель
          </p>
        </div>

        <nav style={{ padding: '24px 0' }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '12px 24px',
                color: pathname === item.href ? '#b89968' : '#ccc',
                textDecoration: 'none',
                fontSize: '14px',
                background: pathname === item.href ? 'rgba(184, 153, 104, 0.1)' : 'transparent',
                borderLeft: pathname === item.href ? '3px solid #b89968' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '0',
          right: '0',
          padding: '0 24px',
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: '1px solid #555',
              color: '#ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Выйти
          </button>
        </div>
      </aside>

      {/* Основной контент */}
      <main style={{
        marginLeft: '260px',
        flex: 1,
        padding: '32px',
      }}>
        {children}
      </main>
    </div>
  );
}