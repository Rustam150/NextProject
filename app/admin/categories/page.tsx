'use client';

import { useState, useEffect } from 'react';
import { mockCategories, Category } from '@/lib/admin-data';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', image: '/images/p1.jpg' });

  useEffect(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(mockCategories);
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories]);

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingCategory) {
      const updated = categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c);
      setCategories(updated);
    } else {
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        ...formData,
      };
      setCategories([...categories, newCategory]);
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

  const handleDelete = (id: number) => {
    if (confirm('Удалить категорию?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
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
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px', fontSize: '14px' }}>{category.id}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{category.name}</td>
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
                    onClick={() => handleDelete(category.id)}
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

      {/* Модальное окно */}
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