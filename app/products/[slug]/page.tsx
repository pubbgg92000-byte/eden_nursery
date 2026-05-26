import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import { getPublishedProduct, getPublishedProducts, getTestimonials } from "@/lib/supabase/queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) return { title: "Plant Not Found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: `${product.name} | EDEN`, description: product.description, images: product.image_url ? [{ url: product.image_url, alt: product.name }] : [] },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) notFound();
  const [testimonials, products] = await Promise.all([getTestimonials(product.id), getPublishedProducts()]);
  const related = products.filter((candidate) => candidate.id !== product.id && candidate.category_id === product.category_id).slice(0, 3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eden-nursery.vercel.app";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_url,
    offers: {
      "@type": "Offer",
      price: Number(product.price).toFixed(2),
      priceCurrency: "USD",
      availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteUrl}/products/${product.slug}`,
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ProductDetail product={product} testimonials={testimonials} related={related} />
    </>
  );
}
