'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import { formatPrice } from '../../lib/data';
import { Store } from '../../lib/store';
import { useStoreData } from '@/lib/use-store-data';

export default function ProductPage() {
  const { data: HERMITAGE_DATA, loaded } = useStoreData();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const product = id ? HERMITAGE_DATA.products.find((p: any) => String(p.id) === String(id)) : undefined;

  const [isFav, setIsFav] = useState(false);
  const [isInCompare, setIsInCompare] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('desc');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({
  firstName: '',
  lastName: '',
  phone: '',
  comment: '',
  deliveryType: 'pickup',
  address: '',
});

  useEffect(() => {
    if (product) {
      setIsFav(Store.isFavorite(String(product.id)));
      setIsInCompare(Store.isInCompare(String(product.id)));
      document.title = `${product.name} — HERMITAGE DECOR`;
    }
    const user = Store.user();
    setCurrentUser(user);
  }, [product]);

  useEffect(() => {
    const handleStorageChange = () => {
      const user = Store.user();
      setCurrentUser(user);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!loaded) return null;

  if (!product) {
    return (
      <>
        <Header />
        <div className="container" style={{ paddingTop: 16 }}>
          <BackButton fallback="/catalog" />
        </div>
        <div className="container section">
          <div className="empty-state">
            <h2>Товар не найден</h2>
            <Link href="/catalog" className="btn btn--outline">В каталог</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const toggleFav = () => {
    const next = Store.toggleFavorite(String(product.id));
    setIsFav(next);
  };

  const toggleCompare = () => {
    const next = Store.toggleCompare(String(product.id));
    setIsInCompare(next);
  };

  const addToCart = () => {
    Store.addToCart(String(product.id));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    Store.addOrder({
      firstName: orderForm.firstName || currentUser.firstName,
      lastName: orderForm.lastName || currentUser.lastName,
      phone: orderForm.phone || currentUser.phone,
    
      status: 'new',
    
      items: [{
        id: String(product.id),
        name: product.name,
        qty: 1,
        price: product.price
      }],
    
      comment: orderForm.comment,
    });

    alert('Заявка успешно отправлена! Менеджер свяжется с вами в ближайшее время.');
    setShowOrderModal(false);
    setOrderForm({
  firstName: '',
  lastName: '',
  phone: '',
  comment: '',
  deliveryType: 'pickup',
  address: '',
});
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Простая проверка (в реальности нужна база данных)
    const users = JSON.parse(localStorage.getItem('hd_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      Store.setUser(user);
      setCurrentUser(user);
      setShowLoginModal(false);
      setShowOrderModal(true);
    } else {
      alert('Неверный email или пароль');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newUser = {
      id: Date.now(),
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
    };

    const users = JSON.parse(localStorage.getItem('hd_users') || '[]');
    users.push(newUser);
    localStorage.setItem('hd_users', JSON.stringify(users));
    
    Store.setUser(newUser);
    setCurrentUser(newUser);
    setShowLoginModal(false);
    alert('Регистрация успешна!');
  };

  const similar = HERMITAGE_DATA.products
    .filter((p: any) => p.id !== product.id && (p.category === product.category || p.factory === product.factory))
    .slice(0, 4);

  const getAvailabilityText = () => {
    const p = product as any;
    if (p.inStock === 'both') return 'В наличии и под заказ';
    if (p.inStock === false) return 'Под заказ';
    if (p.stockQuantity != null) {
      if (p.stockQuantity === 0) return 'Нет в наличии';
      if (p.stockQuantity === 1) return 'Осталась 1 шт.';
      if (p.stockQuantity <= 5) return `Осталось ${p.stockQuantity} шт.`;
      return `В наличии (${p.stockQuantity} шт.)`;
    }
    return 'В наличии';
  };

  const getAvailabilityColor = () => {
    const p = product as any;
    if (p.inStock === false || p.stockQuantity === 0) return '#c62828';
    if (p.inStock === 'both') return '#e65100';
    if (p.stockQuantity != null && p.stockQuantity <= 5) return '#e65100';
    return '#2e7d32';
  };

  return (
    <>
      <Header />

      <div className="container" style={{ paddingTop: 16 }}>
        <BackButton fallback="/catalog" />
      </div>

      <div className="product-layout container" style={{ paddingTop: 0, paddingBottom: 32 }}>
        <div className="product-gallery">
        <div
  className="product-gallery__main"
  onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
  onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
  onTouchEnd={() => {
    if (!product.images || product.images.length < 2) return;

    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;

    if (distance > 50) {
      setActiveImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }

    if (distance < -50) {
      setActiveImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
  }}
>
  <img
    id="main-image"
    src={product.images?.[activeImage] || product.image}
    alt={product.name}
  />
</div>
          {product.images && product.images.length > 1 && (
  <div className="gallery-thumbs-wrapper">

    <button
      type="button"
      className="gallery-arrow gallery-arrow-left"
      onClick={() =>
        thumbsRef.current?.scrollBy({
          left: -300,
          behavior: 'smooth'
        })
      }
    >
      ‹
    </button>

    <div
      ref={thumbsRef}
      className="product-gallery__thumbs"
    >
      {product.images.map((img: any, i: number) => (
        <button
          key={i}
          type="button"
          className={i === activeImage ? 'is-active' : ''}
          onClick={() => setActiveImage(i)}
        >
          <img src={img} alt="" />
        </button>
      ))}
    </div>

    <button
      type="button"
      className="gallery-arrow gallery-arrow-right"
      onClick={() =>
        thumbsRef.current?.scrollBy({
          left: 300,
          behavior: 'smooth'
        })
      }
    >
      ›
    </button>

  </div>
)}
        </div>

        <div className="product-info">
          {product.isNew && (
            <span className="badge badge--new" style={{ display: 'inline-block', marginBottom: 12 }}>
              Новинка
            </span>
          )}
          {product.isSale && (
            <span className="badge badge--sale" style={{ display: 'inline-block', marginBottom: 12 }}>
              Акция
            </span>
          )}

          <h1>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <p className="product-info__price" style={{ margin: 0 }}>{formatPrice(product.price)}</p>
            <span style={{
              padding: '6px 14px',
              background: getAvailabilityColor() === '#2e7d32' ? '#e8f5e9' : (getAvailabilityColor() === '#e65100' ? '#fff3e0' : '#ffebee'),
              color: getAvailabilityColor(),
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 500,
            }}>
              {getAvailabilityText()}
            </span>
          </div>

          <div className="product-actions">
            <button type="button" className="btn btn--primary btn--block" onClick={addToCart}>
              Добавить в корзину
            </button>
            <button type="button" className="btn btn--outline btn--block" onClick={() => setShowOrderModal(true)}>
              Оформить заявку
            </button>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={toggleFav}
              >
                {isFav ? 'В избранном' : 'В избранное'}
              </button>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={toggleCompare}
              >
                {isInCompare ? 'В сравнении' : 'Сравнить'}
              </button>
            </div>
          </div>

          <div className="tabs">
            <div className="tabs__nav">
              <button
                type="button"
                className={activeTab === 'desc' ? 'is-active' : ''}
                onClick={() => setActiveTab('desc')}
              >
                Описание
              </button>
              <button
                type="button"
                className={activeTab === 'specs' ? 'is-active' : ''}
                onClick={() => setActiveTab('specs')}
              >
                Характеристики
              </button>
            </div>
            <div className="tabs__panel" style={{ display: activeTab === 'desc' ? 'block' : 'none' }}>
              <p>{product.description || 'Описание отсутствует'}</p>
            </div>
            <div className="tabs__panel" style={{ display: activeTab === 'specs' ? 'block' : 'none' }}>
              <table className="specs-table">
                <tbody>
                  <tr><td>Страна</td><td>{product.country}</td></tr>
                  <tr><td>Фабрика</td><td>{product.factory}</td></tr>
                  <tr><td>Артикул</td><td>{product.sku || '—'}</td></tr>
                  <tr><td>Размеры</td><td>{product.sizes || '—'}</td></tr>
                  <tr><td>Материал</td><td>{product.material || '—'}</td></tr>
                  <tr><td>Цвет</td><td>{product.color || '—'}</td></tr>
                  <tr><td>Наличие</td><td>{getAvailabilityText()}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно заявки */}
      {showOrderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '16px',
        }} onClick={() => setShowOrderModal(false)}>
          <div style={{
            background: '#fff',
            padding: '32px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', margin: '0 0 24px 0' }}>
              Оформить заявку
            </h2>

            {!currentUser ? (
              <>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Для оформления заявки необходимо войти в систему
                </p>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button onClick={() => setShowLoginModal(true)} className="btn btn--primary" style={{ flex: 1 }}>
                    Войти
                  </button>
                  <button onClick={() => alert('Обратитесь к администратору для регистрации')} className="btn btn--outline" style={{ flex: 1 }}>
                    Регистрация
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleOrderSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                    Имя 
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue={currentUser.firstName}
                    onChange={(e) => setOrderForm({ ...orderForm, firstName: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                    Фамилия
                  </label>
                  <input
                    type="text"
                    defaultValue={currentUser.lastName}
                    onChange={(e) => setOrderForm({ ...orderForm, lastName: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                    Телефон 
                  </label>
                  <input
                    type="tel"
                    required
                    defaultValue={currentUser.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
  <label
    style={{
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#333'
    }}
  >
    Способ получения
  </label>

  <select
    value={orderForm.deliveryType}
    onChange={(e) =>
      setOrderForm({
        ...orderForm,
        deliveryType: e.target.value
      })
    }
    style={{
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    }}
  >
    <option value="pickup">Самовывоз</option>
    <option value="delivery">Доставка</option>
  </select>
</div>

{orderForm.deliveryType === 'delivery' && (
  <div style={{ marginBottom: '16px' }}>
    <label
      style={{
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        color: '#333'
      }}
    >
      Адрес доставки
    </label>

    <input
      type="text"
      value={orderForm.address}
      onChange={(e) =>
        setOrderForm({
          ...orderForm,
          address: e.target.value
        })
      }
      style={{
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
    />
  </div>
)}

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                    Комментарий
                  </label>
                  <textarea
                    rows={3}
                    value={orderForm.comment}
                    onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>
                    Отправить заявку
                  </button>
                  <button type="button" onClick={() => setShowOrderModal(false)} className="btn btn--outline" style={{ flex: 1 }}>
                    Отмена
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Модальное окно входа */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '16px',
        }} onClick={() => setShowLoginModal(false)}>
          <div style={{
            background: '#fff',
            padding: '32px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '400px',
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', margin: '0 0 24px 0' }}>
              Вход
            </h2>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                  Пароль
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>
                  Войти
                </button>
                <button type="button" onClick={() => setShowLoginModal(false)} className="btn btn--outline" style={{ flex: 1 }}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <section className="section" style={{ background: 'var(--white)' }}>
          <div className="container">
            <p className="section__subtitle">Рекомендуем</p>
            <h2 className="section__title">Похожие товары</h2>
            <div className="products-grid">
              {similar.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}