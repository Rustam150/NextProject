'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import ProductCard from '../components/ProductCard';
import { getProduct } from '../../lib/data';
import { Store } from '../../lib/store';
import Toast from '../components/Toast';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile' | 'favorites' | 'orders'>('login');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const u = Store.user();
    setUser(u);
    setActiveTab(u ? 'profile' : 'login');
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;
    const users = JSON.parse(localStorage.getItem('hd_users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      Store.setUser(found);
      setUser(found);
      setActiveTab('profile');
      setToast({ message: 'Вы успешно вошли', type: 'success' });
    } else {
      setToast({ message: 'Неверный email или пароль', type: 'error' });
    }
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email') as string;
    
    const users = JSON.parse(localStorage.getItem('hd_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      setToast({ message: 'Пользователь с таким email уже существует', type: 'error' });
      return;
    }
    
    const newUser = {
      email,
      password: fd.get('password') as string,
      firstName: fd.get('firstName') as string,
      lastName: fd.get('lastName') as string,
      phone: fd.get('phone') as string,
    };
    
    users.push(newUser);
    localStorage.setItem('hd_users', JSON.stringify(users));
    Store.setUser(newUser);
    setUser(newUser);
    setActiveTab('profile');
    setToast({ message: 'Регистрация успешна!', type: 'success' });
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updated = {
      ...user,
      firstName: fd.get('firstName') as string,
      lastName: fd.get('lastName') as string,
      phone: fd.get('phone') as string,
    };
    Store.setUser(updated);
    setUser(updated);
    const users = JSON.parse(localStorage.getItem('hd_users') || '[]');
    const i = users.findIndex((u: any) => u.email === user.email);
    if (i >= 0) {
      users[i] = { ...users[i], ...updated };
      localStorage.setItem('hd_users', JSON.stringify(users));
    }
    setToast({ message: 'Данные сохранены', type: 'success' });
  };

  const handleLogout = () => {
    Store.setUser(null);
    setUser(null);
    setActiveTab('login');
    setToast({ message: 'Вы вышли из системы', type: 'info' });
  };

  const favProducts = Store.favorites().map(getProduct).filter(Boolean);
  const orders = Store.orders();

  return (
    <>
      <Header />

      <div className="container" style={{ paddingTop: 16 }}>
        <BackButton fallback="/" />
      </div>

      <header className="page-header">
        <div className="container">
          <h1>Личный кабинет</h1>
        </div>
      </header>

      <div className="container section" style={{ paddingTop: 0 }}>
        {!user ? (
          <>
            <div className="account-tabs">
              <button
                type="button"
                className={activeTab === 'login' ? 'is-active' : ''}
                onClick={() => setActiveTab('login')}
              >
                Вход
              </button>
              <button
                type="button"
                className={activeTab === 'register' ? 'is-active' : ''}
                onClick={() => setActiveTab('register')}
              >
                Регистрация
              </button>
            </div>

            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="checkout-form" style={{ maxWidth: 400 }}>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" required />
                </div>
                <div className="form-group">
                  <label>Пароль</label>
                  <input type="password" name="password" required />
                </div>
                <button type="submit" className="btn btn--primary btn--block">
                  Войти
                </button>
              </form>
            )}

            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="checkout-form" style={{ maxWidth: 400 }}>
                <div className="form-group">
                  <label>Имя</label>
                  <input type="text" name="firstName" required />
                </div>
                <div className="form-group">
                  <label>Фамилия</label>
                  <input type="text" name="lastName" required />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input type="tel" name="phone" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" required />
                </div>
                <div className="form-group">
                  <label>Пароль</label>
                  <input type="password" name="password" required minLength={6} />
                </div>
                <button type="submit" className="btn btn--primary btn--block">
                  Зарегистрироваться
                </button>
              </form>
            )}
          </>
        ) : (
          <>
            <p style={{ marginBottom: 24 }}>
              Здравствуйте, <strong>{user.firstName}</strong>
            </p>

            <div className="account-tabs">
              <button
                type="button"
                className={activeTab === 'profile' ? 'is-active' : ''}
                onClick={() => setActiveTab('profile')}
              >
                Личные данные
              </button>
              <button
                type="button"
                className={activeTab === 'favorites' ? 'is-active' : ''}
                onClick={() => setActiveTab('favorites')}
              >
                Избранное
              </button>
              <button
                type="button"
                className={activeTab === 'orders' ? 'is-active' : ''}
                onClick={() => setActiveTab('orders')}
              >
                История заявок
              </button>
            </div>

            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="checkout-form" style={{ maxWidth: 480 }}>
                <div className="form-group">
                  <label>Имя</label>
                  <input type="text" name="firstName" defaultValue={user?.firstName || ''} required />
                </div>
                <div className="form-group">
                  <label>Фамилия</label>
                  <input type="text" name="lastName" defaultValue={user?.lastName || ''} required />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input type="tel" name="phone" defaultValue={user?.phone || ''} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    readOnly 
                    style={{ opacity: 0.6 }} 
                  />
                </div>
                <button type="submit" className="btn btn--primary btn--block">
                  Сохранить
                </button>
                <button type="button" className="btn btn--outline btn--block mt-2" onClick={handleLogout}>
                  Выйти
                </button>
              </form>
            )}

            {activeTab === 'favorites' && (
              <div>
                {favProducts.length > 0 ? (
                  <div className="products-grid">
                    {favProducts.map((p) => p && <ProductCard key={p.id} product={p} />)}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Избранное пусто</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                {orders.length > 0 ? (
                  orders.map((o) => (
                    <div key={o.id} className="order-card">
                      <p className="order-card__date">{new Date(o.date).toLocaleString('ru-RU')}</p>
                      <p>
                        <strong>
                          {o.firstName} {o.lastName}
                        </strong>{' '}
                        · {o.phone}
                      </p>
                      <ul style={{ marginTop: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                        {o.items.map((i, idx) => (
                          <li key={idx}>
                            {i.name}
                            {i.qty > 1 ? ` ×${i.qty}` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>Заявок пока нет</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}