'use client';

import { useEffect, useState } from 'react';
import { HERMITAGE } from './data';

// Маппинг названий категорий на оригинальные строковые id из data.ts
const CATEGORY_NAME_TO_ID: Record<string, string> = {
  'Спальня': 'bedroom',
  'Гостиная': 'living',
  'Столовая': 'dining',
  'Кабинет': 'office',
  'Кухня': 'kitchen',
  'Прихожая': 'hallway',
  'Детская': 'kids',
  'Мягкая мебель': 'soft',
  'Посуда': 'dishes',
  'Ароматы': 'aromas',
  'Текстиль': 'textile',
};

export function useStoreData() {
  const [data, setData] = useState(HERMITAGE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedCategories = localStorage.getItem('categories');

    const newData = { ...HERMITAGE };

    if (savedProducts) {
      try {
        const customProducts = JSON.parse(savedProducts);
        newData.products = customProducts.map((p: any) => ({
          ...p,
          images: p.images || (p.image ? [p.image] : ['/images/p1.jpg']),
          factory: p.factory || p.brand || '',
          isSale: p.isSale ?? false,
          sku: p.sku || '',
          sizes: p.sizes || '',
          material: p.material || '',
          color: p.color || '',
        }));
      } catch (e) {
        console.error('Error parsing products', e);
      }
    }

    if (savedCategories) {
      try {
        const customCategories = JSON.parse(savedCategories);
        newData.categories = customCategories.map((c: any) => {
          // Если id числовой - пытаемся найти оригинальный строковый id по имени
          const stringId = CATEGORY_NAME_TO_ID[c.name];
          return {
            id: stringId || String(c.id),
            name: c.name,
            image: c.image || '/images/p1.jpg',
          };
        });
      } catch (e) {
        console.error('Error parsing categories', e);
      }
    }

    setData(newData);
    setLoaded(true);
  }, []);

  return { data, loaded };
}