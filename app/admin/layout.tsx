'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    { href: '/admin/brands', label: 'Бренды' },
    { href: '/admin/categories', label: 'Категории' },
    { href: '/admin/orders', label: 'Заказы' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f0' }}>
      {/* Мобильная кнопка меню */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 1001,
            padding: '12px',
            background: '#1a1a1a',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          {sidebarOpen ? '×' : '☰'}
        </button>
      )}

      {/* Оверлей для мобильной версии */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}

      {/* Сайдбар */}
      <aside style={{
        width: isMobile ? '260px' : '260px',
        background: '#1a1a1a',
        color: '#fff',
        padding: '24px 0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.3s ease',
        zIndex: 1000,
        left: 0,
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
              onClick={() => isMobile && setSidebarOpen(false)}
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
        marginLeft: isMobile ? '0' : '260px',
        flex: 1,
        padding: isMobile ? '16px' : '32px',
        paddingTop: isMobile ? '70px' : '32px',
        width: '100%',
      }}>
        {children}
      </main>
    </div>
  );
}