"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import type { Category, Product } from "@/types";

const CARE_LEVELS = ["All", "Easy", "Moderate", "Expert"] as const;

export function CatalogExplorer({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCare, setSelectedCare] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products
      .filter((product) => {
        const categoryName = product.category?.name ?? "";
        const matchesQuery = !normalizedQuery || `${product.name} ${product.description} ${categoryName}`.toLowerCase().includes(normalizedQuery);
        return matchesQuery &&
          (selectedCategory === "All" || categoryName === selectedCategory) &&
          (selectedCare === "All" || product.care_level === selectedCare);
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return Number(a.price) - Number(b.price);
        if (sortBy === "price-high") return Number(b.price) - Number(a.price);
        return a.display_order - b.display_order;
      });
  }, [products, query, selectedCategory, selectedCare, sortBy]);

  return (
    <main className="min-h-screen bg-emerald-50/30 px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-5xl font-black text-emerald-900">
            The Collection
          </motion.h1>
          <p className="max-w-2xl text-emerald-800/60">
            Hand-selected plants with considered care stories, ready to become part of your sanctuary.
          </p>
        </header>
        <section aria-label="Catalog filters" className="mb-12 space-y-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <label className="block max-w-md">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-emerald-900/50">Search plants</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search by name or story" className="field" />
          </label>
          <div className="flex flex-wrap gap-8">
            <FilterButtons label="Category" options={["All", ...categories.map((category) => category.name)]} value={selectedCategory} onChange={setSelectedCategory} />
            <FilterButtons label="Care Level" options={[...CARE_LEVELS]} value={selectedCare} onChange={setSelectedCare} />
            <label>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-emerald-900/50">Sort By</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="field min-w-48">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>
        </section>
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="mb-2 text-2xl font-bold text-emerald-900">No plants found</h2>
            <p className="text-emerald-800/60">Adjust your filters or check back as new specimens arrive.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function FilterButtons({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (option: string) => void }) {
  return (
    <div>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-emerald-900/50">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)} className={value === option ? "filter-chip filter-chip-active" : "filter-chip"}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
