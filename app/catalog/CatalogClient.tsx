'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import { Store } from '@/lib/store';
import { HERMITAGE } from '@/lib/data';

export default function CatalogClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const newOnly = searchParams.get('new') === '1';
  const saleOnly = searchParams.get('sale') === '1';
  const country = searchParams.get('country') || '';
  const search = searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    country: '',
    factory: '',
    color: '',
    material: '',
    inStock: '',
  });

  const [sort, setSort] = useState('popular');
  const [categoriesPanelOpen, setCategoriesPanelOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
  const loadProducts = () => {
    const allProducts = Store.getProducts();
    setProducts(allProducts);
    setLoaded(true);
  };

  const loadCategories = () => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(HERMITAGE.categories);
    }
  };

  loadProducts();
  loadCategories();

  const unsubscribe = Store.subscribeToProducts(loadProducts);

  return unsubscribe;
}, []);

  useEffect(() => {
    if (country) {
      setFilters((prev) => ({ ...prev, country }));
    }
  }, [country]);

  if (!loaded) return null;

  const filteredProducts = products.filter((p: any) => {
    if (category && String(p.category) !== String(category)) {
  return false;
}
    if (newOnly && !p.isNew) return false;
    if (saleOnly && !p.isSale) return false;
    if (filters.country && p.country !== filters.country) return false;
    if (filters.factory && p.factory !== filters.factory) return false;
    if (filters.color && p.color !== filters.color) return false;
    if (filters.material && !p.material.includes(filters.material)) return false;
    if (filters.inStock === 'yes' && p.inStock !== true) return false;
    if (filters.inStock === 'preorder' && p.inStock !== 'preorder') return false;
    if (filters.inStock === 'no' && p.inStock !== false) return false;
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.factory.toLowerCase().includes(q) && !p.country.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'new') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
  });

  const countries = [...new Set(products.map((p: any) => p.country))];
  const factories = [...new Set(products.map((p: any) => p.factory))];
  const colors = [...new Set(products.map((p: any) => p.color))];
  const materials = [...new Set(products.map((p: any) => p.material.split(',')[0].trim()))];

  const pageTitle = category
    ? categories.find((c: any) => c.id === category)?.name || 'Каталог'
    : newOnly
      ? 'Новинки'
      : saleOnly
        ? 'Акции'
        : search
          ? `Поиск: ${search}`
          : 'Каталог';

  return (
    <>
      <Header />

      <div className="container" style={{ paddingTop: 16 }}>
        <BackButton fallback="/" />
      </div>

      <header className="page-header">
        <div className="container">
          <h1>{pageTitle}</h1>
        </div>
      </header>

      <div className="container catalog-layout">
        <aside className={`filters-panel ${filtersOpen ? 'is-open' : ''}`}>
          
          <form onSubmit={(e) => { e.preventDefault(); setFiltersOpen(false); }}>
            <div className="filter-group">
              <label>Цена от</label>
              <input type="number" placeholder="0" min="0" step="1000" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
            </div>
            <div className="filter-group">
              <label>Цена до</label>
              <input type="number" placeholder="1000000" min="0" step="1000" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
            </div>
            <div className="filter-group">
              <label>Страна</label>
              <select value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })}>
                <option value="">Все</option>
                {countries.map((c: any) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Фабрика</label>
              <select value={filters.factory} onChange={(e) => setFilters({ ...filters, factory: e.target.value })}>
                <option value="">Все</option>
                {factories.map((f: any) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Цвет</label>
              <select value={filters.color} onChange={(e) => setFilters({ ...filters, color: e.target.value })}>
                <option value="">Все</option>
                {colors.map((c: any) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Материал</label>
              <select value={filters.material} onChange={(e) => setFilters({ ...filters, material: e.target.value })}>
                <option value="">Все</option>
                {materials.map((m: any) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Наличие</label>
              <select value={filters.inStock} onChange={(e) => setFilters({ ...filters, inStock: e.target.value })}>
                <option value="">Все</option>
                <option value="yes">В наличии</option>
                <option value="preorder">Под заказ</option>
                <option value="no">Нет в наличии</option>
              </select>
            </div>
            <button type="submit" className="btn btn--primary btn--block">Применить</button>
            <button type="button" className="btn btn--outline btn--block mt-2" onClick={() => setFilters({ minPrice: '', maxPrice: '', country: '', factory: '', color: '', material: '', inStock: '' })}>Сбросить</button>
          </form>
        </aside>

        <main className="catalog-main">
          <button type="button" className="categories-menu-toggle" onClick={() => setCategoriesPanelOpen(true)}>
            Выбрать комнату <span style={{ fontSize: 12 }}>▼</span>
          </button>

          <div className="catalog-categories">
            <p className="catalog-categories__label">Комнаты</p>
            <div className="catalog-categories__scroll">
              <a href="/catalog" className={`catalog-chip ${!category ? 'is-active' : ''}`}>Все</a>
              {categories.map((c: any) => (
                <a key={c.id} href={`/catalog?category=${c.id}`} className={`catalog-chip ${category === c.id ? 'is-active' : ''}`}>{c.name}</a>
              ))}
            </div>
          </div>

          <div className="catalog-toolbar">
            <button type="button" className="filters-toggle" onClick={() => setFiltersOpen(true)}>Фильтры</button>
            
            <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Сортировка">
              <option value="popular">По популярности</option>
              <option value="price-asc">По цене: сначала дешевле</option>
              <option value="price-desc">По цене: сначала дороже</option>
              <option value="new">По новизне</option>
            </select>
          </div>

          <div className="products-grid" style={{ marginTop: 24 }}>
            {sortedProducts.length > 0 ? (
              sortedProducts.map((p: any) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <p>Товары не найдены</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className={`categories-panel ${categoriesPanelOpen ? 'open' : ''}`}>
        <button type="button" onClick={() => setCategoriesPanelOpen(false)} aria-label="Закрыть" style={{ position: 'relative', top: '50px', right: '16px', width: '32px', height: '32px', background: '#fff', border: '1px solid #ddd', borderRadius: '50%', fontSize: '20px', lineHeight: '1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: 0 }}>×</button>
        <h2 className="categories-panel__title">Комнаты</h2>
        <div className="categories-panel__grid">
          <a href="/catalog" className={`categories-panel__item ${!category ? 'active' : ''}`} onClick={() => setCategoriesPanelOpen(false)}>
            <span className="categories-panel__item-name">Все</span>
          </a>
          {categories.map((c: any) => (
            <a key={c.id} href={`/catalog?category=${c.id}`} className={`categories-panel__item ${category === c.id ? 'active' : ''}`} onClick={() => setCategoriesPanelOpen(false)}>
              <span className="categories-panel__item-name">{c.name}</span>
            </a>
          ))}
        </div>
      </div>

      <Footer full />
    </>
  );
}