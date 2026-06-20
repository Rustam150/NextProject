'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Моковая авторизация (позже заменим на API)
    if (email === 'admin@hermitage.ru' && password === 'admin123') {
      localStorage.setItem('admin_auth', 'true');
      localStorage.setItem('admin_email', email);
      router.push('/admin');
    } else {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f0',
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '32px',
          marginBottom: '8px',
          textAlign: 'center',
          color: '#1a1a1a',
        }}>
          HERMITAGE DECOR
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '32px',
          fontSize: '14px',
        }}>
          Админ-панель
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#333',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#333',
            }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#b89968',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#a88958')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#b89968')}
          >
            Войти
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#f9f9f9',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666',
        }}>
          <strong>Тестовые данные:</strong><br />
          Email: admin@hermitage.ru<br />
          Пароль: admin123
        </div>
      </div>
    </div>
  );
}