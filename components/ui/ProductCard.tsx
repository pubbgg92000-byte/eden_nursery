"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { useStore } from "@/store/useStore";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock_quantity <= 0;

  function handleAdd() {
    addToCart({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <motion.article whileHover={{ y: -8 }} className="overflow-hidden rounded-2xl border border-emerald-50 bg-white shadow-sm transition-shadow hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-64 bg-emerald-50">
          <span className="absolute left-4 top-4 z-10 rounded-full bg-emerald-700/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            {product.category?.name ?? "Botanical"}
          </span>
          <img src={product.image_url || "/plants/monstera.jpg"} alt={product.name} width={640} height={640} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-800">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>
      </Link>
      <div className="p-6">
        <Link href={`/products/${product.slug}`} className="text-xl font-bold text-emerald-900 transition-colors hover:text-emerald-600">
          {product.name}
        </Link>
        <p className="mb-4 mt-2 line-clamp-2 text-sm text-emerald-700/70">{product.description}</p>
        <div className="mb-6 flex gap-2 text-[10px] font-bold uppercase">
          <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">{product.care_level} Care</span>
          <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">{product.sunlight}</span>
        </div>
        <button type="button" onClick={handleAdd} disabled={soldOut || added} className="button-primary w-full disabled:cursor-not-allowed disabled:bg-emerald-100 disabled:text-emerald-700">
          {soldOut ? "Currently Unavailable" : added ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </motion.article>
  );
}
