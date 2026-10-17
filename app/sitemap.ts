import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { PRODUCTS } from '@/data/products';
import { CATEGORIES } from '@/data/categories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lapiez.com';
  const currentDate = new Date();

  // Core storefront routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic Product routes
  let productSlugs: string[] = [];
  try {
    const dbProds = await prisma.product.findMany({
      where: { status: 'active' },
      select: { slug: true },
      take: 200,
    });
    if (dbProds.length > 0) {
      productSlugs = dbProds.map((p) => p.slug);
    } else {
      productSlugs = PRODUCTS.map((p) => p.slug || p.id);
    }
  } catch {
    productSlugs = PRODUCTS.map((p) => p.slug || p.id);
  }

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Category routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${baseUrl}/shop?cat=${encodeURIComponent(c.name)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
