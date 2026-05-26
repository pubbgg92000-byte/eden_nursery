'use client';

import React, { useEffect, useState, use } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setProduct(data);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-emerald-800/40 font-bold">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-emerald-950">Product not found</h2>
        <p className="text-emerald-800/60 mt-2">The product you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-emerald-950 mb-2">Edit Product</h1>
        <p className="text-emerald-800/60">Update details for <span className="text-emerald-900 font-bold">{product.name}</span>.</p>
      </div>

      <ProductForm initialData={product} isEditing={true} />
    </div>
  );
}
