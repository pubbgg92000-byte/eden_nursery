import { MetadataRoute } from 'next';
import { MOCK_PRODUCTS } from '@/lib/seedData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eden-nursery.vercel.app';

  // Base pages
  const routes = ['', '/products', '/about', '/pricing', '/contact'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    })
  );

  // Product pages
  const productEntries = MOCK_PRODUCTS.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...routes, ...productEntries];
}
