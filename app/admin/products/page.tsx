'use client';

import { useState, useEffect } from 'react';
import { Product, mockBrands } from '@/lib/admin-data';

const CATEGORIES = [
  'Спальня', 'Гостиная', 'Столовая', 'Кабинет', 'Кухня',
  'Прихожая', 'Детская', 'Мягкая мебель', 'Посуда', 'Ароматы', 'Текстиль',
];

const COUNTRIES = ['Италия', 'Германия', 'Испания', 'Франция', 'Турция', 'Китай', 'Другая'];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', brand: '', country: '',
    image: '/images/p1.jpg', inStock: true, popular: false, isNew: false, description: '',
    sku: '', sizes: '', material: '', color: '', isSale: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    
    // Пробуем загрузить из localStorage
    const saved = localStorage.getItem('products');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('Loaded from localStorage:', parsed.length, 'products');
      setProducts(parsed);
    } else {
      // Если нет - загружаем из lib/data.ts
      try {
        const dataModule = await import('@/lib/data');
        const hermitageData = dataModule.HERMITAGE;
        
        console.log('Loaded from data.ts:', hermitageData.products.length, 'products');
        
        const productsFromData = hermitageData.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category || '',
          brand: p.factory || p.brand || '',
          country: p.country || '',
          image: p.images?.[0] || p.image || '/images/p1.jpg',
          inStock: p.inStock ?? true,
          popular: p.popular ?? false,
          isNew: p.isNew ?? false,
          description: p.description || '',
          sku: p.sku || '',
          sizes: p.sizes || '',
          material: p.material || '',
          color: p.color || '',
          isSale: p.isSale ?? false,
          images: p.images || [p.image] || ['/images/p1.jpg'],
          factory: p.factory || p.brand || '',
        }));
        
        setProducts(productsFromData);
        localStorage.setItem('products', JSON.stringify(productsFromData));
      } catch (error) {
        console.error('Error loading products:', error);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('Удалить товар?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('products', JSON.stringify(updated));
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '', price: '', category: '', brand: '', country: '',
      image: '/images/p1.jpg', inStock: true, popular: false, isNew: false, description: '',
      sku: '', sizes: '', material: '', color: '', isSale: false,
    });
    setShowModal(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: String(product.price),
      category: product.category,
      brand: product.brand || product.factory || '',
      country: product.country,
      image: product.images?.[0] || product.image || '/images/p1.jpg',
      inStock: product.inStock,
      popular: product.popular || false,
      isNew: product.isNew || false,
      description: product.description || '',
      sku: product.sku || '',
      sizes: product.sizes || '',
      material: product.material || '',
      color: product.color || '',
      isSale: product.isSale || false,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) { alert('Введите название товара'); return; }
    const price = Number(formData.price) || 0;

    if (editingProduct) {
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            ...formData,
            price,
            id: editingProduct.id,
            factory: formData.brand,
            images: [formData.image],
          };
        }
        return p;
      });
      setProducts(updated);
      localStorage.setItem('products', JSON.stringify(updated));
    } else {
      const newProduct = {
        ...formData,
        id: Math.max(...products.map(p => p.id), 0) + 1,
        price,
        factory: formData.brand,
        images: [formData.image],
        isSale: formData.isSale,
        sku: formData.sku || `SKU-${Date.now()}`,
        sizes: formData.sizes,
        material: formData.material,
        color: formData.color,
      };
      const updated = [...products, newProduct];
      setProducts(updated);
      localStorage.setItem('products', JSON.stringify(updated));
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка товаров...</div>;
  }

  return (
    <div>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', margin: 0 }}>Товары ({products.length})</h1>
        <button onClick={handleAdd} className="admin-btn" style={{ padding: '12px 24px', background: '#b89968', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Добавить товар</button>
      </div>

      <input type="text" placeholder="Поиск товаров..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '24px', fontSize: '14px', boxSizing: 'border-box' }} />

      <div className="products-table" style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>ID</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Название</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Категория</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Цена</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Статус</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px', fontSize: '14px' }}>{product.id}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{product.name}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>{product.category}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{product.price.toLocaleString()} ₽</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 12px', background: product.inStock ? '#e8f5e9' : '#ffebee', color: product.inStock ? '#2e7d32' : '#c62828', borderRadius: '12px', fontSize: '12px' }}>
                    {product.inStock ? 'В наличии' : 'Нет'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(product)} style={{ padding: '6px 12px', background: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '8px' }}>Редактировать</button>
                  <button onClick={() => handleDelete(product.id)} style={{ padding: '6px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px', overflowY: 'auto' }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', margin: '0 0 24px 0' }}>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Название *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Цена *</label>
              <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/\D/g, '') })} placeholder="0" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Категория</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}>
                <option value="">Выберите категорию</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Бренд</label>
              <select value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}>
                <option value="">Выберите бренд</option>
                {mockBrands.map(brand => <option key={brand.id} value={brand.name}>{brand.name} ({brand.country})</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Страна</label>
              <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}>
                <option value="">Выберите страну</option>
                {COUNTRIES.map(country => <option key={country} value={country}>{country}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Артикул</label>
              <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Размеры</label>
              <input type="text" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Материал</label>
              <input type="text" value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Цвет</label>
              <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Описание</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                В наличии
              </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({ ...formData, popular: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                Популярный
              </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                Новинка
              </label>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.isSale} onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                Акция
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleSave} style={{ flex: 1, padding: '12px', background: '#b89968', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Сохранить</button>
              <button onClick={() => { setShowModal(false); setEditingProduct(null); }} style={{ flex: 1, padding: '12px', background: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}