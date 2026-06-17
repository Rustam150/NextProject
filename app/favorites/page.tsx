'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import ProductCard from '../components/ProductCard';
import { getProduct } from '../../lib/data';
import { Store } from '../../lib/store';

export default function FavoritesPage() {
  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    setFavIds(Store.favorites());
  }, []);

  const products = favIds.map(getProduct).filter(Boolean);

  return (
    <>
      <Header />

      <div className="container" style={{ paddingTop: 16 }}>
        <BackButton fallback="/catalog" />
      </div>

      <header className="page-header">
        <div className="container">
          <h1>Избранное</h1>
        </div>
      </header>

      <div className="container section" style={{ paddingTop: 0 }}>
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((p) => p && <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Список пуст</h2>
            <p>Сохраняйте понравившиеся товары</p>
            <Link href="/catalog" className="btn btn--primary" style={{ marginTop: 20 }}>
              В каталог
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}