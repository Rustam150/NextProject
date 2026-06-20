'use client';

import { useEffect, useState } from 'react';
import { HERMITAGE } from './data';

export function useStoreData() {
  const [data, setData] = useState(HERMITAGE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');

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
        console.error('Error parsing products from localStorage', e);
      }
    }

    setData(newData);
    setLoaded(true);
  }, []);

  return { data, loaded };
}