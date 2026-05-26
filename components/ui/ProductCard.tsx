'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { useStore } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = useStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-50"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-64 w-full bg-emerald-50">
          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-sm text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg">
              {product.category?.name || 'Plant'}
            </span>
          </div>
          <img
            src={product.image_url || ''}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=600&auto=format&fit=crop';
            }}
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-800">
            ${product.price}
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xl font-bold text-emerald-900 hover:text-emerald-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <p className="text-emerald-700/70 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-6">
          <span className="px-2 py-1 bg-emerald-50 text-[10px] font-bold text-emerald-700 rounded uppercase tracking-tighter">
            {product.care_level} Care
          </span>
          <span className="px-2 py-1 bg-blue-50 text-[10px] font-bold text-blue-700 rounded uppercase tracking-tighter">
            {product.sunlight}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={added}
          className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg ${
            added 
              ? 'bg-emerald-100 text-emerald-700 shadow-none cursor-default' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
          }`}
        >
          {added ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
