import { Suspense } from 'react';
import ProductClient from './ProductClient';

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Загрузка...</div>}>
      <ProductClient />
    </Suspense>
  );
}