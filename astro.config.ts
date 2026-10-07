import { defineConfig } from 'astro/config';
import { siteConfig } from './src/config/site';

export default defineConfig({
  site: siteConfig.site.url,
  base: siteConfig.site.base,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
