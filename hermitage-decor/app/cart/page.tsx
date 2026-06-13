'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { getProduct, formatPrice, HERMITAGE, type Product } from '../../lib/data';
import { Store } from '../../lib/store';

interface CartItem extends Product {
  qty: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Array<{ id: string; qty: number }>>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  useEffect(() => {
    setCart(Store.cart());
    const user = Store.user();
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
      });
    }
  }, []);

  const items: CartItem[] = cart
    .map((c) => {
      const p = getProduct(c.id);
      return p ? { ...p, qty: c.qty } : null;
    })
    .filter((item): item is CartItem => item !== null);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const updateQty = (id: string, delta: number) => {
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      Store.removeFromCart(id);
    } else {
      Store.updateCartQty(id, newQty);
    }
    setCart(Store.cart());
  };

  const removeFromCart = (id: string) => {
    Store.removeFromCart(id);
    setCart(Store.cart());
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderItems = items.map((i) => ({ name: i.name, qty: i.qty }));
    Store.addOrder({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      items: orderItems,
    });

    const lines = orderItems.map((p) => `- ${p.name}${p.qty > 1 ? ` (×${p.qty})` : ''}`);
    const text = `Здравствуйте.

Меня зовут: ${formData.firstName} ${formData.lastName}
Телефон: ${formData.phone}

Меня интересуют следующие товары:

${lines.join('\n')}

Прошу связаться со мной.`;

    const url = `https://wa.me/${HERMITAGE.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    Store.setCart([]);
    setCart([]);
  };

  if (items.length === 0) {
    return (
      <>
        <Header />

        <div className="container" style={{ paddingTop: 16 }}>
          <BackButton fallback="/catalog" />
        </div>

        <header className="page-header">
          <div className="container">
            <h1>Оформление заявки</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
              Онлайн-оплаты нет. После оформления откроется WhatsApp с готовым сообщением для менеджера.
            </p>
          </div>
        </header>

        <div className="container section" style={{ paddingTop: 0 }}>
          <div className="empty-state">
            <h2>Корзина пуста</h2>
            <p>Добавьте товары для формирования заявки</p>
            <Link href="/catalog" className="btn btn--primary" style={{ marginTop: 20 }}>
              В каталог
            </Link>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="container" style={{ paddingTop: 16 }}>
        <BackButton fallback="/catalog" />
      </div>

      <header className="page-header">
        <div className="container">
          <h1>Оформление заявки</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
            Онлайн-оплаты нет. После оформления откроется WhatsApp с готовым сообщением для менеджера.
          </p>
        </div>
      </header>

      <div className="container section" style={{ paddingTop: 0 }}>
        <div className="cart-layout">
          <div>
            <div className="cart-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <Link href={`/product?id=${item.id}`} className="cart-item__img">
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div className="cart-item__info">
                    <h3>
                      <Link href={`/product?id=${item.id}`}>{item.name}</Link>
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {item.country} · {item.factory}
                    </p>
                    <p className="product-card__price">{formatPrice(item.price)}</p>
                    <div className="qty-control">
                      <button type="button" onClick={() => updateQty(item.id, -1)}>
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, 1)}>
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 18, marginTop: 16 }}>
              Итого: <strong>{formatPrice(total)}</strong>
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
              Окончательная стоимость уточняется менеджером
            </p>
          </div>

          <form className="checkout-form" onSubmit={submitOrder}>
            <h2 style={{ fontSize: 24, marginBottom: 24, fontFamily: 'var(--font-display)' }}>
              Ваши данные
            </h2>
            <div className="form-group">
              <label htmlFor="firstName">Имя</label>
              <input
                type="text"
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Фамилия</label>
              <input
                type="text"
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Телефон</label>
              <input
                type="tel"
                id="phone"
                required
                placeholder="+7 (___) ___-__-__"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn--primary btn--block">
              Оформить заказ
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 16, textAlign: 'center' }}>
              Нажимая кнопку, вы перейдёте в WhatsApp для отправки заявки менеджеру
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}