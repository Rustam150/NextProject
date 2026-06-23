'use client';

import { useEffect, useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    if (product) {
      setIsFav(Store.isFavorite(String(product.id)));
      setIsInCompare(Store.isInCompare(String(product.id)));
      document.title = `${product.name} — HERMITAGE DECOR`;
    }
  }, [product]);

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
          <div className="product-gallery__main">
            <img
              id="main-image"
              src={product.images?.[activeImage] || product.image}
              alt={product.name}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="product-gallery__thumbs">
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
            <button type="button" className="btn btn--outline btn--block" onClick={() => {
              const orderItems = [{ name: product.name, qty: 1, price: product.price }];
              Store.addOrder({
                firstName: '',
                lastName: '',
                phone: '',
                items: orderItems,
              });
              alert('Заявка отправлена! Менеджер свяжется с вами в ближайшее время.');
            }}>
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