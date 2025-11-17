import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/track-order',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/shop' ? 'daily' : 'weekly' as 'daily' | 'weekly',
    priority: route === '' ? 1 : route === '/shop' ? 0.9 : 0.7,
  }));

  // Fetch products dynamically if available
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/catalog`, {
      next: { revalidate: 3600 },
    });
    
    if (response.ok) {
      const products = await response.json();
      productRoutes = products.map((product: any) => ({
        url: `${BASE_URL}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  return [...routes, ...productRoutes];
}
