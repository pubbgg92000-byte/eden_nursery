'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types/product';

interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    stock_quantity: initialData?.stock_quantity || 0,
    image_url: initialData?.image_url || '',
    category_id: initialData?.category_id || '',
    care_level: initialData?.care_level || 'Easy',
    sunlight: initialData?.sunlight || '',
    water_frequency: initialData?.water_frequency || '',
    indoor: initialData?.indoor ?? true,
    is_pet_friendly: initialData?.is_pet_friendly ?? false,
  });

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  useEffect(() => {
    const init = async () => {
      await fetchCategories();
    };
    init();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    // Auto-generate slug from name if adding new product
    if (name === 'name' && !isEditing) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: data.publicUrl
      }));
    } catch (err) {
      alert('Error uploading image: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && initialData) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        if (error) throw error;
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      alert('Error saving product: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">1</span>
            Basic Information
          </h2>
          
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Monstera Deliciosa"
              className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-900"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">URL Slug</label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm text-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-emerald-900"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">2</span>
            Inventory & Price
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-900"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                required
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-900 appearance-none"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Product Image</label>
            <div className="space-y-4">
              {formData.image_url && (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-emerald-100 shadow-lg">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    className="absolute top-1 right-1 bg-white/80 backdrop-blur rounded-full p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl cursor-pointer hover:bg-emerald-100 hover:border-emerald-300 transition-all font-bold text-emerald-700 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formData.image_url ? 'Change Image' : 'Upload Image'}
                    </>
                  )}
                </label>
              </div>
              <input
                type="hidden"
                name="image_url"
                value={formData.image_url}
              />
            </div>
          </div>
        </div>

        {/* Plant Metadata */}
        <div className="md:col-span-2 space-y-6 pt-6 border-t border-emerald-50">
          <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">3</span>
            Botanical Specs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Care Level</label>
              <select
                name="care_level"
                value={formData.care_level}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-900"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Sunlight</label>
              <input
                type="text"
                name="sunlight"
                value={formData.sunlight}
                onChange={handleChange}
                placeholder="e.g. Bright Indirect"
                className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-900"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/40 mb-2">Water Frequency</label>
              <input
                type="text"
                name="water_frequency"
                value={formData.water_frequency}
                onChange={handleChange}
                placeholder="e.g. Weekly"
                className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-900"
              />
            </div>
          </div>

          <div className="flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="indoor"
                checked={formData.indoor}
                onChange={(e) => setFormData(prev => ({ ...prev, indoor: e.target.checked }))}
                className="w-5 h-5 rounded border-emerald-200 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">Indoor Plant</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="is_pet_friendly"
                checked={formData.is_pet_friendly}
                onChange={(e) => setFormData(prev => ({ ...prev, is_pet_friendly: e.target.checked }))}
                className="w-5 h-5 rounded border-emerald-200 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">Pet Friendly</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-8 py-4 text-emerald-900 font-bold hover:bg-emerald-50 rounded-2xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}
