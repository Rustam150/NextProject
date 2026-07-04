'use client';
import { Store } from '@/lib/store';
import { showToast } from '@/lib/toast';
import { useState, useEffect } from 'react';
import { Product, mockBrands } from '@/lib/admin-data';

const CATEGORIES = [
  { id: 'bedroom', name: 'Спальня' },
  { id: 'living', name: 'Гостиная' },
  { id: 'dining', name: 'Столовая' },
  { id: 'office', name: 'Кабинет' },
  { id: 'kitchen', name: 'Кухня' },
  { id: 'hallway', name: 'Прихожая' },
  { id: 'kids', name: 'Детская' },
  { id: 'soft', name: 'Мягкая мебель' },
  { id: 'dishes', name: 'Посуда' },
  { id: 'aromas', name: 'Ароматы' },
  { id: 'textile', name: 'Текстиль' },
];

const COUNTRIES = ['Италия', 'Германия', 'Испания', 'Франция', 'Турция', 'Китай', 'Другая'];

const AVAILABILITY_OPTIONS = [
  { value: 'in_stock', label: 'В наличии' },
  { value: 'preorder', label: 'Под заказ' },
  { value: 'out_of_stock', label: 'Нет в наличии' },
];

const COLOR_OPTIONS = [
  'Бежевый', 'Коричневый', 'Серый', 'Чёрный', 'Белый',
  'Синий', 'Зелёный', 'Красный', 'Жёлтый', 'Оранжевый',
  'Фиолетовый', 'Розовый', 'Голубой', 'Бирюзовый', 'Другой',
];

const MATERIAL_OPTIONS = [
  'Ткань', 'Велюр', 'Бархат', 'Кожа', 'Экокожа',
  'Дерево', 'МДФ', 'ДСП', 'Металл', 'Стекло',
  'Пластик', 'Камень', 'Другой',
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', brand: '', country: '',
    images: ['/images/p1.jpg'], inStockStatus: 'in_stock', stockQuantity: '',
    popular: false, isNew: false, description: '',
    sku: '', sizes: '', material: '', color: '', isSale: false,
    customColor: '',
    customMaterial: '',
    customCountry: '',
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
  }, []);

 const loadProducts = () => {
  setLoading(true);

  const products = Store.getProducts();

  setProducts(products);

  setLoading(false);
};

const loadCategories = () => {
  setCategories(Store.getCategories());
};

const loadBrands = () => {
  setBrands(Store.getBrands());
};

  const filteredProducts = products.filter(product => {
  const matchesSearch =
    product.name.toLowerCase().includes(search.toLowerCase());

  const matchesCategory =
    categoryFilter === '' ||
    String(product.category) === String(categoryFilter);

  const matchesBrand =
    brandFilter === '' ||
    product.brand === brandFilter;

  return matchesSearch && matchesCategory && matchesBrand;
});

  const handleDelete = (id: number) => {
    if (confirm('Удалить товар?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      Store.setProducts(updated);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '', price: '', category: '', brand: '', country: '',
      images: ['/images/p1.jpg'], inStockStatus: 'in_stock', stockQuantity: '',
      popular: false, isNew: false, description: '',
      sku: '', sizes: '', material: '', color: '', isSale: false,
      customColor: '',
      customMaterial: '',
      customCountry: '',
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
      images: product.images || ['/images/p1.jpg'],
      inStockStatus: product.inStock === 'preorder' ? 'preorder' : product.inStock ? 'in_stock' : 'out_of_stock',
      stockQuantity: String(product.stockQuantity || ''),
      popular: product.popular || false,
      isNew: product.isNew || false,
      description: product.description || '',
      sku: product.sku || '',
      sizes: product.sizes || '',
      material: product.material || '',
      color: product.color || '',
      isSale: product.isSale || false,
      customColor: !COLOR_OPTIONS.includes(product.color) ? product.color : '',
      customMaterial: !MATERIAL_OPTIONS.includes(product.material) ? product.material : '',
      customCountry: !COUNTRIES.includes(product.country) ? product.country : '',
    });
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      let loadedCount = 0;

      Array.from(files).forEach((file) => {
        const canvas = document.createElement('canvas');
        const img = new Image();
      
        img.onload = () => {
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
      
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
      
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedImage = canvas.toDataURL('image/jpeg', 0.6);
          newImages.push(compressedImage);
          loadedCount++;
      
          if (loadedCount === files.length) {
            if (e.target.multiple) {
              setFormData({ ...formData, images: [...formData.images, ...newImages] });
            } else {
              setFormData({ ...formData, images: newImages });
            }
          }
        };
        img.src = URL.createObjectURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : ['/images/p1.jpg'] });
  };

 const handleSave = () => {

  if (!formData.name.trim()) {
    showToast('Введите название товара', 'error');
    return;
  }

  if (!formData.category) {
    showToast('Выберите категорию', 'error');
    return;
  }

  if (!formData.brand) {
    showToast('Выберите бренд', 'error');
    return;
  }

  const price = Number(formData.price) || 0;

  if (price <= 0) {
    showToast('Цена должна быть больше 0', 'error');
    return;
  }

  if (
    formData.inStockStatus === 'in_stock' &&
    (formData.stockQuantity === '' || Number(formData.stockQuantity) < 0)
  ) {
    showToast('Количество на складе не может быть отрицательным', 'error');
    return;
  }

  const finalColor =
    formData.color === 'Другой' ? formData.customColor : formData.color;

  const finalMaterial =
    formData.material === 'Другой'
      ? formData.customMaterial
      : formData.material;

  const finalCountry =
    formData.country === 'Другая'
      ? formData.customCountry
      : formData.country;

  let inStockValue: boolean | string = true;

  if (formData.inStockStatus === 'preorder') {
    inStockValue = 'preorder';
  } else if (formData.inStockStatus === 'out_of_stock') {
    inStockValue = false;
  }

  // дальше идёт твой код...

  if (editingProduct) {
    const updated = products.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          ...formData,
          price,
          id: editingProduct.id,
          factory: formData.brand,
          images: formData.images,
          inStock: inStockValue,
          color: finalColor,
          material: finalMaterial,
          country: finalCountry,
          stockQuantity: formData.stockQuantity ? Number(formData.stockQuantity) : null,
          // Убедимся что category сохранена
          category: formData.category || '',
        };
      }
      return p;
    });
    setProducts(updated);
Store.setProducts(updated);
  } else {
    const newProduct = {
      ...formData,
      id: `p${Date.now()}`,
      price,
      factory: formData.brand,
      images: formData.images,
      isSale: formData.isSale,
      sku: formData.sku || `SKU-${Date.now()}`,
      sizes: formData.sizes,
      material: finalMaterial,
      color: finalColor,
      country: finalCountry,
      inStock: inStockValue,
      stockQuantity: formData.stockQuantity ? Number(formData.stockQuantity) : null,
      // Убедимся что category сохранена
      category: formData.category || '',
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    Store.setProducts(updated);
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
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', margin: 0 }}>
  Товары ({filteredProducts.length})
</h1>
<p
  style={{
    marginTop: '6px',
    color: '#666',
    fontSize: '14px',
  }}
>
  Показано {filteredProducts.length} из {products.length} товаров
</p>
        <button onClick={handleAdd} className="admin-btn" style={{ padding: '12px 24px', background: '#b89968', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Добавить товар</button>
      </div>

      <input 
        type="text" 
        placeholder="Поиск товаров..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        className="search-input" 
        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '24px', fontSize: '14px', boxSizing: 'border-box' }} 
      />

      <select
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
  style={{
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginLeft: '12px',
    minWidth: '200px',
  }}
>
  <option value="">Все категории</option>

  {categories.map(category => (
    <option
      key={category.id}
      value={String(category.id)}
    >
      {category.name}
    </option>
  ))}
</select>

<select
  value={brandFilter}
  onChange={(e) => setBrandFilter(e.target.value)}
  style={{
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginLeft: '12px',
    minWidth: '200px',
  }}
>
  <option value="">Все бренды</option>

  {brands.map((brand) => (
    <option
      key={brand.id}
      value={brand.name}
    >
      {brand.name}
    </option>
  ))}
</select>
<button
  onClick={() => {
    setSearch('');
    setCategoryFilter('');
    setBrandFilter('');
  }}
  style={{
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    background: '#444',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  }}
>
  Сбросить фильтры
</button>

      {/* КОНТЕЙНЕР С ГОРИЗОНТАЛЬНЫМ СКРОЛЛОМ */}
      <div style={{
        width: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        marginBottom: '24px',
      }}>
        <div style={{
          minWidth: '1100px',
          background: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 600, width: '60px' }}>ID</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 600, minWidth: '200px' }}>Название</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 600, width: '150px' }}>Категория</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 600, width: '120px' }}>Цена</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 600, width: '100px' }}>Остаток</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 600, width: '100px' }}>Популярный</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 600, width: '150px' }}>Статус</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 600, width: '200px' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id ?? Math.random()} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    №{filteredProducts.indexOf(product) + 1}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>
                    {categories.find(c => c.id === product.category)?.name || product.category}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>
                    {String(product.price)} ₽
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
  {product.stockQuantity != null ? (
    <span style={{
      padding: '4px 8px',
      background: product.stockQuantity > 5 ? '#e8f5e9' : 
                  product.stockQuantity > 0 ? '#fff3e0' : '#ffebee',
      color: product.stockQuantity > 5 ? '#2e7d32' : 
             product.stockQuantity > 0 ? '#e65100' : '#c62828',
      borderRadius: '12px',
      fontSize: '12px'
    }}>
      {product.stockQuantity} шт.
    </span>
  ) : (
    <span style={{
      padding: '4px 8px',
      background: '#e8f5e9',
      color: '#2e7d32',
      borderRadius: '12px',
      fontSize: '12px'
    }}>
      В наличии
    </span>
  )}
</td>
                  <td style={{ padding: '16px' }}>
                    {product.popular ? (
                      <span style={{ padding: '4px 12px', background: '#fff3e0', color: '#e65100', borderRadius: '12px', fontSize: '12px' }}>✓</span>
                    ) : (
                      <span style={{ padding: '4px 12px', background: '#f5f5f5', color: '#999', borderRadius: '12px', fontSize: '12px' }}>—</span>
                    )}
                  </td>
                                    <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      background: product.inStock === 'preorder' ? '#fff3e0' : 
                                  product.inStock === true ? '#e8f5e9' : '#ffebee',
                      color: product.inStock === 'preorder' ? '#e65100' : 
                             product.inStock === true ? '#2e7d32' : '#c62828',
                      borderRadius: '12px',
                      fontSize: '12px',
                      display: 'inline-block'
                    }}>
                      {product.inStock === 'preorder' ? 'Под заказ' : 
                       product.inStock === true ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleEdit(product)} 
                      style={{
                        padding: '6px 12px',
                        background: '#f5f5f5',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginRight: '8px'
                      }}
                    >
                      Редактировать
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)} 
                      style={{
                        padding: '6px 12px',
                        background: '#ffebee',
                        color: '#c62828',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
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
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Фото товара</label>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Можно выбрать несколько фото (до 10)</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '12px' }}>
                {formData.images.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img src={img} alt={`Preview ${index}`} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                    {formData.images.length > 1 && (
                      <button
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Категория</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}>
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Бренд</label>
              <select value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}>
                <option value="">Выберите бренд</option>
                {brands.map(brand => <option key={brand.id} value={brand.name}>{brand.name} ({brand.country})</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Страна</label>
              <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}>
                <option value="">Выберите страну</option>
                {COUNTRIES.map(country => <option key={country} value={country}>{country}</option>)}
              </select>
              {formData.country === 'Другая' && (
                <input type="text" value={formData.customCountry} onChange={(e) => setFormData({ ...formData, customCountry: e.target.value })} placeholder="Введите страну" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', marginTop: '8px' }} />
              )}
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
              <select value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}>
                <option value="">Выберите материал</option>
                {MATERIAL_OPTIONS.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
              {formData.material === 'Другой' && (
                <input type="text" value={formData.customMaterial} onChange={(e) => setFormData({ ...formData, customMaterial: e.target.value })} placeholder="Введите материал" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', marginTop: '8px' }} />
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Цвет</label>
              <select value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}>
                <option value="">Выберите цвет</option>
                {COLOR_OPTIONS.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              {formData.color === 'Другой' && (
                <input type="text" value={formData.customColor} onChange={(e) => setFormData({ ...formData, customColor: e.target.value })} placeholder="Введите цвет" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', marginTop: '8px' }} />
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Наличие</label>
              <select value={formData.inStockStatus} onChange={(e) => setFormData({ ...formData, inStockStatus: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}>
                {AVAILABILITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {formData.inStockStatus === 'in_stock' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Количество на складе</label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  placeholder="Оставьте пустым если не ограничено"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Например: 1, 5, 10. Оставьте пустым если товара много.</p>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Описание</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({ ...formData, popular: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                Популярный товар
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