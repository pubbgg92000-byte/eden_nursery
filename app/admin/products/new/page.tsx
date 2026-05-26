import React from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-emerald-950 mb-2">New Plant</h1>
        <p className="text-emerald-800/60">Introduce a new species to your botanical inventory.</p>
      </div>

      <ProductForm />
    </div>
  );
}
