'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { Product } from '@/types';

const supabase = createBrowserSupabaseClient()!;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(id, name, slug)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchProducts();
    };
    init();
  }, []);

  async function updateStock(id: string, newQuantity: number) {
    if (newQuantity < 0) return;
    
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', id);

      if (error) throw error;

      setProducts(products.map(p => p.id === id ? { ...p, stock_quantity: newQuantity } : p));
    } catch (err) {
      alert('Failed to update stock: ' + (err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product: ' + (err as Error).message);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-emerald-950 mb-2">Inventory</h1>
          <p className="text-emerald-800/60">Manage your botanical collection and stock levels.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-200"
        >
          <PlusIcon />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-50/50 border-b border-emerald-100">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-emerald-900/40">Product</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-emerald-900/40">Category</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-emerald-900/40">Price</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-emerald-900/40">Stock</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-emerald-900/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-emerald-800/40 font-bold">
                  Loading inventory...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-emerald-800/40 font-bold">
                  No products found. Start by adding one!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 overflow-hidden flex-shrink-0">
                        {product.image_url && (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                               (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=100&auto=format&fit=crop';
                             }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-emerald-900">{product.name}</div>
                        <div className="text-xs text-emerald-800/40 font-mono">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full">
                      {product.category?.name ?? 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-900">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateStock(product.id, (product.stock_quantity || 0) - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-emerald-100 hover:border-emerald-300 transition-colors text-emerald-900 disabled:opacity-50"
                        disabled={updatingId === product.id}
                      >
                        -
                      </button>
                      <span className={`font-bold w-8 text-center ${ (product.stock_quantity || 0) < 5 ? 'text-red-500' : 'text-emerald-900' }`}>
                        {product.stock_quantity || 0}
                      </span>
                      <button 
                        onClick={() => updateStock(product.id, (product.stock_quantity || 0) + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-emerald-100 hover:border-emerald-300 transition-colors text-emerald-900 disabled:opacity-50"
                        disabled={updatingId === product.id}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <EditIcon />
                      </Link>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  );
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
  );
}
