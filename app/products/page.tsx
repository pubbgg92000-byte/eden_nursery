import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/commerce/CatalogExplorer";
import { getCategories, getPublishedProducts } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Botanical Collection",
  description: "Explore EDEN's curated indoor botanical collection.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getPublishedProducts(), getCategories()]);
  return <CatalogExplorer products={products} categories={categories} />;
}
