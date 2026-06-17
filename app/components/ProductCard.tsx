'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Store } from '../../lib/store';
import { formatPrice, type Product } from '../../lib/data';

export default function ProductCard({ product }: { product: Product }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(Store.isFavorite(product.id));
  }, [product.id]);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = Store.toggleFavorite(product.id);
    setIsFav(next);
    if ((window as any).__storeUpdate) (window as any).__storeUpdate();
  };

  const badge = product.isNew
    ? <span className="badge badge--new">Новинка</span>
    : product.isSale
      ? <span className="badge badge--sale">Акция</span>
      : null;

  return (
    <article className="product-card" data-id={product.id}>
      <Link href={`/product?id=${product.id}`} className="product-card__media">
        <img src={product.image} alt="" loading="lazy" />
        {badge}
      </Link>
      <div className="product-card__body">
        <button
          type="button"
          className={`product-card__fav ${isFav ? 'is-active' : ''}`}
          onClick={toggleFav}
          aria-label="Избранное"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        <h3 className="product-card__title">
          <Link href={`/product?id=${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card__meta">{product.country} · {product.factory}</p>
        <p className="product-card__price">{formatPrice(product.price)}</p>
        <Link href={`/product?id=${product.id}`} className="btn btn--outline btn--sm">Подробнее</Link>
      </div>
    </article>
  );
}