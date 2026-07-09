'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { formatPrice, type Product } from '../../lib/data';
import { Store } from '../../lib/store';
import { useStoreData } from '@/lib/use-store-data';

export default function ComparePage() {
  const { data: HERMITAGE, loaded } = useStoreData();
  const [ids, setIds] = useState<string[]>([]);
  const [highlightDiff, setHighlightDiff] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    setIds(Store.compare());
  }, [loaded]);

  const products: any[] = ids
    .map((id) => HERMITAGE.products.find((p: any) => String(p.id) === String(id)))
    .filter(Boolean);

    useEffect(() => {
  if (!loaded) return;

  const validIds = ids.filter((id) =>
    HERMITAGE.products.some((p: any) => String(p.id) === String(id))
  );

  if (validIds.length !== ids.length) {
    Store.setCompare(validIds);
    setIds(validIds);
  }
}, [loaded, ids, HERMITAGE.products]);

  const removeFromCompare = (id: string) => {
  Store.toggleCompare(id);
  setIds(Store.compare());
};



const isUniqueValue = (key: keyof Product, value: any) => {
  const values = products.map((p) => String(p[key] ?? '').trim());

  return values.filter((v) => v === String(value).trim()).length === 1;
};

const cellStyle = (key: keyof Product, value: any) => {
  if (!highlightDiff) return {};

  const values = products.map((p) => String(p[key] ?? '').trim());
  const current = String(value ?? '').trim();

  const uniqueValues = [...new Set(values)];

  // Если все значения разные — ничего не подсвечиваем
  if (uniqueValues.length === products.length) {
    return {};
  }

  // Если все одинаковые — тоже ничего
  if (uniqueValues.length === 1) {
    return {};
  }

  // Подсвечиваем только редкое значение
  if (isUniqueValue(key, value)) {
    return {
      background: '#fff8e5',
      color: '#8b6a00',
      fontWeight: 600,
      transition: 'all .25s ease',
    };
  }

  return {};
};

  if (!loaded) {
    return (
      <>
        <Header />
        <div className="container section" style={{ paddingTop: 100, textAlign: 'center' }}>
          Загрузка...
        </div>
        <Footer />
      </>
    );
  }

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

      <div className="container" style={{ marginBottom: 24 }}>
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12,
      padding: '18px 22px',
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 8px 24px rgba(0,0,0,.06)',
      border: '1px solid rgba(0,0,0,.05)'
    }}
  >
    <div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--gold-dark)'
        }}
      >
        {products.length} из 4 товаров
      </div>

      <div
        style={{
          marginTop: 4,
          color: '#777',
          fontSize: 14
        }}
      >
        Выберите товары для удобного сравнения характеристик.
      </div>
    </div>

    <button
      onClick={() => {
        products.forEach((p) => Store.toggleCompare(String(p.id)));
        setIds([]);
      }}
      className="btn btn--outline"
    >
      Очистить сравнение
    </button>
  </div>
</div>



<div className="container" style={{ marginBottom: 16 }}>
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
    }}
  >
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#555',
      userSelect: 'none',
    }}
  >
    <input
      type="checkbox"
      checked={highlightDiff}
      onChange={(e) => setHighlightDiff(e.target.checked)}
    />
    Показать только различия
  </label>
</div>
</div>


      <div className="container section" style={{ paddingTop: 0 }}>
        <p className="scroll-hint">Прокрутите таблицу влево →</p>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                {products.map((p) => (
                  <th key={p.id}>
  <div className="compare-product-card">

    <button
      className="compare-remove"
      onClick={() => removeFromCompare(String(p.id))}
      title="Убрать из сравнения"
    >
      ✕
    </button>

    <img
      className="compare-product-img"
      src={p.images?.[0] || p.image}
      alt={p.name}
    />

    <Link
      href={`/product?id=${p.id}`}
      className="compare-product-title"
    >
      {p.name}
    </Link>

    <div className="compare-product-price">
      {formatPrice(p.price)}
    </div>

    <Link
      href={`/product?id=${p.id}`}
      className="btn btn--outline btn--sm"
      style={{ marginTop: 12 }}
    >
      Подробнее
    </Link>

  </div>
</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/*
              <tr>
                <td>Цена</td>
                {products.map((p) => (
                  <td key={p.id}>{formatPrice(p.price)}</td>
                ))}
              </tr>
              */}
              
        
<tr>

  <td>Страна</td>

  {products.map((p) => (
    <td
  key={p.id}
  style={cellStyle('country', p.country)}
>
  {p.country}
</td>
  ))}
</tr>

              
  <tr>
    <td>Фабрика</td>
    {products.map((p) => (
      <td
  key={p.id}
  style={cellStyle('factory', p.factory)}
>
  {p.factory}
</td>
    ))}
  </tr>

              
  <tr>
    <td>Артикул</td>
    {products.map((p) => (
      <td
  key={p.id}
  style={cellStyle('sku', p.sku)}
>
  {p.sku}
</td>
    ))}
  </tr>

             
  <tr>
    <td>Размеры</td>
    {products.map((p) => (
      <td
  key={p.id}
  style={cellStyle('sizes', p.sizes)}
>
  {p.sizes}
</td>
    ))}
  </tr>

            
  <tr>
    <td>Материал</td>
    {products.map((p) => (
      <td
  key={p.id}
  style={cellStyle('material', p.material)}
>
  {p.material}
</td>
    ))}
  </tr>

             
  <tr>
    <td>Цвет</td>
    {products.map((p) => (
      <td
  key={p.id}
  style={cellStyle('color', p.color)}
>
  {p.color}
</td>
    ))}
  </tr>

              
<tr>
  <td>Наличие</td>

  {products.map((p) => (
    <td
  key={p.id}
  style={cellStyle('inStock', p.inStock)}
>
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 14px',
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 600,

      background:
        p.inStock === true
          ? '#e8f5e9'
          : p.inStock === 'preorder'
          ? '#fff3e0'
          : '#ffebee',

      color:
        p.inStock === true
          ? '#2e7d32'
          : p.inStock === 'preorder'
          ? '#e65100'
          : '#c62828'
    }}
  >
        {p.inStock === true
          ? 'В наличии'
          : p.inStock === 'preorder'
          ? 'Под заказ'
          : 'Нет в наличии'}
      </span>
    </td>
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