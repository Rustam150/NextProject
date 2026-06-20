'use client';

import { useState } from 'react';
import { mockBrands, Brand } from '@/lib/admin-data';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: '', country: '' });

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingBrand) {
      setBrands(brands.map(b => b.id === editingBrand.id ? { ...b, ...formData } : b));
    } else {
      const newBrand: Brand = {
        id: Math.max(...brands.map(b => b.id), 0) + 1,
        ...formData,
      };
      setBrands([...brands, newBrand]);
    }

    setShowModal(false);
    setEditingBrand(null);
    setFormData({ name: '', country: '' });
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, country: brand.country });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Удалить бренд?')) {
      setBrands(brands.filter(b => b.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', margin: 0 }}>
          Бренды
        </h1>
        <button
          onClick={() => { setShowModal(true); setEditingBrand(null); setFormData({ name: '', country: '' }); }}
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
          Добавить бренд
        </button>
      </div>

      <input
        type="text"
        placeholder="Поиск брендов..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Страна</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr key={brand.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px', fontSize: '14px' }}>{brand.id}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{brand.name}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>{brand.country}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleEdit(brand)}
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
                    onClick={() => handleDelete(brand.id)}
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
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', marginBottom: '24px', margin: '0 0 24px 0' }}>
              {editingBrand ? 'Редактировать бренд' : 'Добавить бренд'}
            </h2>

            <div style={{ marginBottom: '16px' }}>
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

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>
                Страна
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
                onClick={() => { setShowModal(false); setEditingBrand(null); }}
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