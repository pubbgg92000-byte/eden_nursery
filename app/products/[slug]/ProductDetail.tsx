"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { useStore } from "@/store/useStore";
import type { Product, Testimonial } from "@/types";

export default function ProductDetail({ product, testimonials, related }: { product: Product; testimonials: Testimonial[]; related: Product[] }) {
  const addToCart = useStore((state) => state.addToCart);
  const soldOut = product.stock_quantity <= 0;
  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="sticky top-32 aspect-square overflow-hidden rounded-[40px] bg-emerald-50 shadow-2xl shadow-emerald-100">
            <img src={product.image_url || "/plants/monstera.jpg"} alt={product.name} width={900} height={900} decoding="async" className="h-full w-full object-cover" />
          </motion.div>
          <motion.section initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} aria-label={product.name}>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">{product.category?.name ?? "Botanical"}</span>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-5xl font-black text-emerald-900 md:text-6xl">{product.name}</h1>
              <span className={soldOut ? "stock-chip stock-chip-out" : "stock-chip"}>{soldOut ? "Unavailable" : `${product.stock_quantity} in stock`}</span>
            </div>
            <p className="mt-5 text-3xl font-black text-emerald-800">${Number(product.price).toFixed(2)}</p>
            <p className="my-9 text-lg leading-relaxed text-emerald-800/70">{product.story || product.description}</p>
            <div className="mb-10 grid grid-cols-2 gap-4">
              <PlantStat label="Sunlight" value={product.sunlight} />
              <PlantStat label="Water" value={product.water_frequency} />
              <PlantStat label="Care Level" value={product.care_level} />
              <PlantStat label="Pet Friendly" value={product.is_pet_friendly ? "Yes" : "No"} />
            </div>
            <button type="button" disabled={soldOut} onClick={() => addToCart({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url })} className="button-primary mb-12 w-full py-5 text-lg disabled:bg-slate-200 disabled:text-slate-500">
              {soldOut ? "Join waitlist through inquiry" : "Add to Botanical Request"}
            </button>
            <section aria-labelledby="testimonials-heading" className="border-t border-emerald-100 pt-8">
              <h2 id="testimonials-heading" className="mb-5 text-2xl font-black text-emerald-950">Curated Notes</h2>
              {testimonials.length === 0 ? <p className="rounded-2xl bg-emerald-50 p-6 text-emerald-800/60">Care stories from our curators will appear here soon.</p> : testimonials.map((testimonial) => (
                <blockquote key={testimonial.id} className="mb-4 rounded-2xl border border-emerald-50 p-6">
                  <p className="text-amber-500" aria-label={`${testimonial.rating} out of 5 stars`}>{"*".repeat(testimonial.rating)}</p>
                  <p className="mt-2 text-emerald-800/70">&ldquo;{testimonial.comment}&rdquo;</p>
                  <footer className="mt-3 text-sm font-bold text-emerald-900">{testimonial.author_name}</footer>
                </blockquote>
              ))}
            </section>
          </motion.section>
        </div>
        {related.length > 0 && (
          <section className="mt-24" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-8 text-3xl font-black text-emerald-950">Related Botanicals</h2>
            <div className="grid gap-8 md:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
          </section>
        )}
      </div>
    </main>
  );
}

function PlantStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-emerald-900/40">{label}</span><span className="font-bold text-emerald-900">{value}</span></div>;
}
