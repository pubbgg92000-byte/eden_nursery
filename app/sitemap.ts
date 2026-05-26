import type { MetadataRoute } from "next";
import { getPublishedProducts } from "@/lib/supabase/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eden-nursery.vercel.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublishedProducts();
  const pages = ["", "/products", "/about", "/pricing", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
