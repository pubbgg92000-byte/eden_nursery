'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Product, Review } from '@/types';
import { supabase } from '@/lib/supabase';

interface ProductDetailProps {
  product: Product & { reviews?: Review[] };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const addToCart = useStore((state) => state.addToCart);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    
    // Always add to local store for immediate UI feedback
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    });

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      try {
        const { data: cart } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        let cartId = cart?.id;
        
        if (!cartId) {
          const { data: newCart } = await supabase
            .from('carts')
            .insert([{ user_id: session.user.id }])
            .select()
            .single();
          cartId = newCart?.id;
        }

        if (cartId) {
          await supabase
            .from('cart_items')
            .upsert([{ 
              cart_id: cartId, 
              product_id: product.id,
              quantity: 1
            }], { onConflict: 'cart_id,product_id' });
        }
      } catch (err) {
        console.error('Error persisting cart:', err);
      }
    }
    
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-32 aspect-square bg-emerald-50 rounded-[40px] overflow-hidden shadow-2xl shadow-emerald-100"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8">
              <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">
                {typeof product.category === 'object' ? product.category.name : product.category}
              </span>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-6xl font-black text-emerald-900">{product.name}</h1>
                <div className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest ${product.stock_quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} In Stock` : 'Out of Stock'}
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-800">
                ${product.price}
              </div>
            </div>

            <p className="text-emerald-800/70 text-lg mb-10 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <span className="block text-[10px] font-bold text-emerald-900/40 uppercase mb-1 tracking-widest">Sunlight</span>
                <span className="text-emerald-900 font-black">{product.sunlight}</span>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <span className="block text-[10px] font-bold text-emerald-900/40 uppercase mb-1 tracking-widest">Water</span>
                <span className="text-emerald-900 font-black">{product.water_frequency}</span>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <span className="block text-[10px] font-bold text-emerald-900/40 uppercase mb-1 tracking-widest">Care Level</span>
                <span className="text-emerald-900 font-black">{product.care_level}</span>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <span className="block text-[10px] font-bold text-emerald-900/40 uppercase mb-1 tracking-widest">Pet Friendly</span>
                <span className="text-emerald-900 font-black">{product.is_pet_friendly ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock_quantity === 0}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xl font-black transition-all active:scale-95 shadow-xl shadow-emerald-200 mb-12 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {adding ? 'Adding to Collection...' : 'Add to Collection'}
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>

            {/* Care Guide */}
            <div className="bg-slate-50 p-10 rounded-[2.5rem] mb-12">
              <h3 className="text-2xl font-black text-emerald-950 mb-6">Care Guide</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 000 14a7 7 0 000-14z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900">Light Requirements</h4>
                    <p className="text-emerald-800/60 text-sm">Best kept in {product.sunlight.toLowerCase()} conditions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900">Watering Schedule</h4>
                    <p className="text-emerald-800/60 text-sm">Water approximately {product.water_frequency.toLowerCase()}.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-emerald-950">Community Reviews</h3>
                <button className="text-emerald-600 font-black text-xs uppercase tracking-widest">Write a Review</button>
              </div>
              
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="p-8 bg-white border border-emerald-50 rounded-3xl shadow-sm">
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs text-uppercase">
                            {review.profile?.full_name?.[0] || 'U'}
                          </div>
                          <span className="font-bold text-emerald-900">{review.profile?.full_name || 'Anonymous User'}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-emerald-800/70 font-medium italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-emerald-50 rounded-3xl border border-dashed border-emerald-200">
                  <p className="text-emerald-800/40 font-bold uppercase tracking-widest text-xs">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
