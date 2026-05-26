import "server-only";

import type { Category, Product, Testimonial } from "@/types";
import { createServerSupabaseClient } from "./server";

const PRODUCT_SELECT =
  "*, category:categories(id, name, slug, description)";

export async function getPublishedProducts(): Promise<Product[]> {
  const client = await createServerSupabaseClient();
  if (!client) return [];
  const { data } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as Product[];
}

export async function getCategories(): Promise<Category[]> {
  const client = await createServerSupabaseClient();
  if (!client) return [];
  const { data } = await client.from("categories").select("*").order("name");
  return (data ?? []) as Category[];
}

export async function getPublishedProduct(slug: string) {
  const client = await createServerSupabaseClient();
  if (!client) return null;
  const { data } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as Product | null) ?? null;
}

export async function getTestimonials(productId: string): Promise<Testimonial[]> {
  const client = await createServerSupabaseClient();
  if (!client) return [];
  const { data } = await client
    .from("testimonials")
    .select("*")
    .eq("product_id", productId)
    .order("display_order", { ascending: true });
  return (data ?? []) as Testimonial[];
}
