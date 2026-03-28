import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andhiekaagrestya.netlify.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date('2026-03-28'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
