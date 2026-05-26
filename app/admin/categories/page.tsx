'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Category } from '@/types/product';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
    setLoading(false);
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const { error } = await supabase.from('categories').insert([{ ...newCategory, slug }]);
      
      if (error) throw error;
      
      setNewCategory({ name: '', slug: '', description: '' });
      fetchCategories();
    } catch (err) {
      alert('Error adding category: ' + (err as Error).message);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This might affect products linked to this category.')) return;
    
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert('Error deleting category: ' + (err as Error).message);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-emerald-950 mb-2">Categories</h1>
          <p className="text-emerald-800/60">Organize your botanical collection into meaningful groups.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Add Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 sticky top-10">
            <h2 className="text-xl font-black text-emerald-950 mb-6 flex items-center gap-2">
              <PlusIcon /> Add Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g. Ferns"
                  className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-900"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-emerald-900"
                />
              </div>
              <button
                type="submit"
                disabled={isAdding}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
              >
                {isAdding ? 'Adding...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/50 border-b border-emerald-100">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-emerald-900/40">Category</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-emerald-900/40">Slug</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-emerald-900/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center text-emerald-800/40 font-bold">Loading categories...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center text-emerald-800/40 font-bold">No categories yet.</td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-emerald-900">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-emerald-800/60 mt-1">{category.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-emerald-800/40 italic">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteCategory(category.id)}
                          className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
  );
}
