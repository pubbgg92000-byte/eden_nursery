import React from 'react';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductDetail from './ProductDetail';
import { Product } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Eden Nursery`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Eden Nursery`,
      description: product.description,
      images: [
        {
          url: product.image_url,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Eden Nursery`,
      description: product.description,
      images: [product.image_url],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name),
      reviews:reviews(
        *,
        profile:profiles(full_name, avatar_url)
      )
    `)
    .eq('slug', slug)
    .single();

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product as any} />;
}
