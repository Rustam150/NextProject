'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import ProductCard from '../components/ProductCard';
import { HERMITAGE } from '../../lib/data';
import { Store } from '../../lib/store';

export default function FavoritesPage() {
  const [favIds, setFavIds] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const ids = Store.favorites();
    setFavIds(ids);

    const foundProducts = ids
      .map((id) => {
        return HERMITAGE.products.find((p) => String(p.id) === String(id));
      })
      .filter(Boolean);

    setProducts(foundProducts);
  }, []);

  const removeFromFavorites = (id: string) => {
    Store.toggleFavorite(id);
    setFavIds(favIds.filter((fid) => fid !== id));
    setProducts(products.filter((p) => String(p.id) !== id));
  };

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
            {products.map((p) => (
              <div key={p.id} style={{ position: 'relative' }}>
                <ProductCard product={p} />
                <button
                  onClick={() => removeFromFavorites(String(p.id))}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
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