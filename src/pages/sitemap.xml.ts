import type { APIRoute } from 'astro';
import { siteConfig } from '../config/site';

export const GET: APIRoute = () => {
  const paths = siteConfig.privacy.status === 'published' ? ['/', '/privacy/'] : ['/'];
  const entries = paths.map((pathname) => `<url><loc>${new URL(pathname, siteConfig.site.url).href.replace(/&/g, '&amp;')}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
