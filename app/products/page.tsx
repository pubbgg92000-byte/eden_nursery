'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { ProductSkeleton } from '@/components/ui/ProductSkeleton';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types';

const CARE_LEVELS = ['All', 'Easy', 'Moderate', 'Expert'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCare, setSelectedCare] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: productsData } = await supabase
          .from('products')
          .select('*, category:categories(*)');
        
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (productsData) setProducts(productsData);
        if (categoriesData) setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
      const categoryMatch = selectedCategory === 'All' || categoryName === selectedCategory;
      const careMatch = selectedCare === 'All' || product.care_level === selectedCare;
      return categoryMatch && careMatch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // featured/default
    });
  }, [products, selectedCategory, selectedCare, sortBy]);

  const categoryList = ['All', ...categories.map(c => c.name)];

  return (
    <div className="min-h-screen bg-emerald-50/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-emerald-900 mb-4"
          >
            The Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-800/60 max-w-2xl"
          >
            Explore our curated selection of premium plants, from hardy survivors to exotic rarities. Each plant is ethically sourced and hand-selected for quality.
          </motion.p>
        </header>

        {/* Filters & Sorting */}
        <section className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-12 bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
          <div className="flex flex-wrap gap-8">
            <div>
              <span className="block text-[10px] font-bold text-emerald-900/40 uppercase mb-2 tracking-widest">Category</span>
              <div className="flex flex-wrap gap-2">
                {categoryList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedCategory === cat 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-emerald-900/40 uppercase mb-2 tracking-widest">Care Level</span>
              <div className="flex gap-2">
                {CARE_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedCare(level)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedCare === level 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <span className="block text-[10px] font-bold text-emerald-900/40 uppercase mb-2 tracking-widest">Sort By</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 bg-emerald-50 text-emerald-800 text-sm font-bold px-4 py-2 rounded-full outline-none border-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </section>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">No plants found</h3>
            <p className="text-emerald-800/60">Try adjusting your filters to find your perfect match.</p>
          </div>
        )}
      </div>
    </div>
  );
}
