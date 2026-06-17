'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { getProduct, formatPrice, type Product } from '../../lib/data';
import { Store } from '../../lib/store';

export default function ComparePage() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(Store.compare());
  }, []);

  const products: Product[] = ids
    .map(getProduct)
    .filter((p): p is Product => p !== undefined);

  const removeFromCompare = (id: string) => {
    Store.toggleCompare(id);
    setIds(Store.compare());
  };

  if (products.length === 0) {
    return (
      <>
        <Header />

        <div className="container" style={{ paddingTop: 16 }}>
          <BackButton fallback="/catalog" />
        </div>

        <header className="page-header">
          <div className="container">
            <h1>Сравнение товаров</h1>
          </div>
        </header>

        <div className="container section" style={{ paddingTop: 0 }}>
          <div className="empty-state">
            <h2>Нет товаров для сравнения</h2>
            <Link href="/catalog" className="btn btn--outline" style={{ marginTop: 16 }}>
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
          <h1>Сравнение товаров</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
            До 4 товаров. Добавляйте из карточки товара.
          </p>
        </div>
      </header>

      <div className="container section" style={{ paddingTop: 0 }}>
        <p className="scroll-hint">Прокрутите таблицу влево →</p>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                {products.map((p) => (
                  <th key={p.id}>
                    <img className="compare-product-img" src={p.image} alt={p.name} />
                    <Link href={`/product?id=${p.id}`}>{p.name}</Link>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(p.id)}
                      style={{
                        display: 'block',
                        margin: '8px auto 0',
                        fontSize: 11,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Убрать
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Цена</td>
                {products.map((p) => (
                  <td key={p.id}>{formatPrice(p.price)}</td>
                ))}
              </tr>
              <tr>
                <td>Страна</td>
                {products.map((p) => (
                  <td key={p.id}>{p.country}</td>
                ))}
              </tr>
              <tr>
                <td>Фабрика</td>
                {products.map((p) => (
                  <td key={p.id}>{p.factory}</td>
                ))}
              </tr>
              <tr>
                <td>Артикул</td>
                {products.map((p) => (
                  <td key={p.id}>{p.sku}</td>
                ))}
              </tr>
              <tr>
                <td>Размеры</td>
                {products.map((p) => (
                  <td key={p.id}>{p.sizes}</td>
                ))}
              </tr>
              <tr>
                <td>Материал</td>
                {products.map((p) => (
                  <td key={p.id}>{p.material}</td>
                ))}
              </tr>
              <tr>
                <td>Цвет</td>
                {products.map((p) => (
                  <td key={p.id}>{p.color}</td>
                ))}
              </tr>
              <tr>
                <td>Наличие</td>
                {products.map((p) => (
                  <td key={p.id}>{p.inStock ? 'В наличии' : 'Под заказ'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
}