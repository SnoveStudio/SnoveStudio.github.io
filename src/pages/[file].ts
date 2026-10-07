import type { APIRoute, GetStaticPaths } from 'astro';
import { siteConfig } from '../config/site';

// A custom domain needs a CNAME file in the published artifact.
export const getStaticPaths: GetStaticPaths = () => {
  const hostname = new URL(siteConfig.site.url).hostname;
  return hostname.endsWith('.github.io') ? [] : [{ params: { file: 'CNAME' } }];
};

export const GET: APIRoute = () => new Response(`${new URL(siteConfig.site.url).hostname}\n`);
