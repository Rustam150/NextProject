'use client';
import { Store } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Category } from '@/lib/admin-data';
import { mockCategories } from '@/lib/admin-data';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteMode, setDeleteMode] = useState<'move' | 'delete'>('move');
  const [targetCategoryId, setTargetCategoryId] = useState('');
  const [formData, setFormData] = useState({ name: '', image: '/images/p1.jpg' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  useEffect(() => {
  setCategories(Store.getCategories());

  const savedProducts = localStorage.getItem('products');

  if (savedProducts) {
    setProducts(JSON.parse(savedProducts));
  }
}, []);

  

  useEffect(() => {
  if (categories.length > 0) {
    Store.setCategories(categories);
  }
}, [categories]);

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const productsCount = products.reduce((acc: Record<string, number>, product: any) => {
  const categoryId = String(product.category);
  acc[categoryId] = (acc[categoryId] || 0) + 1;
  return acc;
}, {});

  const handleSave = () => {
    if (!formData.name.trim()) return;
    const exists = categories.some(
  c =>
    c.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
    c.id !== editingCategory?.id
);

if (exists) {
  alert('Категория с таким названием уже существует.');
  return;
}
    if (editingCategory) {
      const updated = categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c);
      setCategories(updated);
      localStorage.setItem('categories', JSON.stringify(updated));
    } else {
      const maxId = categories.reduce((max, c) => {
    const id = Number(c.id);
    return Number.isFinite(id) ? Math.max(max, id) : max;
  }, 0);
      const newCategory: Category = {
          id: maxId + 1,
        ...formData,
      };
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem('categories', JSON.stringify(updated));
    }

    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', image: '/images/p1.jpg' });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, image: category.image });
    setShowModal(true);
  };

  const confirmDeleteCategory = () => {
  if (!categoryToDelete) return;

  // ---------- Перенос товаров ----------
  if (deleteMode === 'move') {
    if (!targetCategoryId) {
      alert('Выберите категорию, в которую нужно перенести товары.');
      return;
    }

    const updatedProducts = products.map(product =>
      String(product.category) === String(categoryToDelete.id)
        ? { ...product, category: targetCategoryId }
        : product
    );

    Store.setProducts(updatedProducts);
    setProducts(updatedProducts);
  }

  // ---------- Удаление товаров ----------
  if (deleteMode === 'delete') {
    const updatedProducts = products.filter(
      product => String(product.category) !== String(categoryToDelete.id)
    );

    Store.setProducts(updatedProducts);
    setProducts(updatedProducts);
  }

  // ---------- Удаляем категорию ----------
  const updatedCategories = categories.filter(
    c => c.id !== categoryToDelete.id
  );

  setCategories(updatedCategories);
  Store.setCategories(updatedCategories);

  // ---------- Закрываем окно ----------
  setShowDeleteModal(false);
  setCategoryToDelete(null);
  setTargetCategoryId('');
  setDeleteMode('move');
};

  

  return (
    <div>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', margin: 0 }}>
          Категории
        </h1>
        <button
          onClick={() => { setShowModal(true); setEditingCategory(null); setFormData({ name: '', image: '/images/p1.jpg' }); }}
          className="admin-btn"
          style={{
            padding: '12px 24px',
            background: '#b89968',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Добавить категорию
        </button>
      </div>

      <input
        type="text"
        placeholder="Поиск категорий..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '24px',
          fontSize: '14px',
          boxSizing: 'border-box',
        }}
      />

      <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>ID</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Название</th>
              <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Товаров</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Действия</th>
              
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px', fontSize: '14px' }}>{category.id}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{category.name}</td>
                <td
  style={{
    padding: '16px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 600,
  }}
>
  {productsCount[String(category.id)] || 0}
</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleEdit(category)}
                    style={{
                      padding: '6px 12px',
                      background: '#f5f5f5',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginRight: '8px',
                    }}
                  >
                    Редактировать
                  </button>
                  <button
                   onClick={() => {
  setCategoryToDelete(category);
  setDeleteMode('move');
  setTargetCategoryId('');
  setShowDeleteModal(true);
}}
                    style={{
                      padding: '6px 12px',
                      background: '#ffebee',
                      color: '#c62828',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3000,
    }}
  >
    <div
      style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '8px',
        width: '400px',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: '16px' }}>
  Удаление категории
</h2>

<p style={{ marginBottom: '8px' }}>
  <strong>Категория:</strong> {categoryToDelete?.name}
</p>

<p style={{ marginBottom: '24px', color: '#666' }}>
  В этой категории находится{' '}
  <strong>
    {productsCount[String(categoryToDelete?.id)] || 0}
  </strong>{' '}
  товар(ов).
</p>

<div style={{ marginBottom: '20px' }}>
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
      cursor: 'pointer',
    }}
  >
    <input
      type="radio"
      checked={deleteMode === 'move'}
      onChange={() => setDeleteMode('move')}
    />
    Перенести товары в другую категорию
  </label>

  {deleteMode === 'move' && (
    <select
      value={targetCategoryId}
      onChange={(e) => setTargetCategoryId(e.target.value)}
      style={{
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '16px',
      }}
    >
      <option value="">Выберите категорию</option>

      {categories
        .filter(c => c.id !== categoryToDelete?.id)
        .map(c => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
    </select>
  )}

  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
    }}
  >
    <input
      type="radio"
      checked={deleteMode === 'delete'}
      onChange={() => setDeleteMode('delete')}
    />
    Удалить категорию вместе с товарами
  </label>
</div>
      <div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  }}
>
  <button
    onClick={() => setShowDeleteModal(false)}
    style={{
      padding: '10px 18px',
      border: '1px solid #ccc',
      background: '#fff',
      borderRadius: '6px',
      cursor: 'pointer',
    }}
  >
    Отмена
  </button>

  <button
  onClick={confirmDeleteCategory}
  style={{
    padding: '10px 18px',
    background: '#b89968',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }}
>
  Продолжить
</button>
</div>
    </div>
  </div>
)}

      {showModal && (
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
          zIndex: 2000,
          padding: '16px',
        }}>
          <div style={{
            background: '#fff',
            padding: '32px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '400px',
          }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', margin: '0 0 24px 0' }}>
              {editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                Название
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#b89968',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Сохранить
              </button>
              <button
                onClick={() => { setShowModal(false); setEditingCategory(null); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f5f5f5',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}