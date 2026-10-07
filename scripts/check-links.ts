import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../src/config/site.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const pages = ['index.html', 'privacy/index.html', '404.html'];
const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (value: string) => value.replace(/[&<>"']/g, (character) => entities[character]!);

for (const filename of pages) {
  const html = await readFile(path.join(dist, filename), 'utf8');
  assert.match(html, /<html lang="ko">/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${filename}: h1은 하나여야 합니다.`);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<link rel="canonical"/);
  const schema = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  assert.ok(schema?.[1], `${filename}: 구조화 데이터가 없습니다.`);
  assert.equal(JSON.parse(schema[1]).legalName, siteConfig.business.registeredName);
  assert.ok(!/<script(?! type="application\/ld\+json")/.test(html), '클라이언트 스크립트가 없어야 합니다.');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1]!;
    if (target.startsWith('https:') || target.startsWith('mailto:')) continue;
    const url = new URL(target, new URL(filename.replace('index.html', ''), 'https://local.test/'));
    let local = path.join(dist, url.pathname);
    if (url.pathname.endsWith('/')) local = path.join(local, 'index.html');
    await access(local);
    if (url.hash) {
      const linkedHtml = await readFile(local, 'utf8');
      assert.ok(linkedHtml.includes(`id="${url.hash.slice(1)}"`), `${filename}: 앵커가 없습니다: ${target}`);
    }
  }
}
const home = await readFile(path.join(dist, 'index.html'), 'utf8');
for (const value of Object.values(siteConfig.business)) assert.ok(home.includes(escape(value)), `사업자 정보 누락: ${value}`);
assert.ok(!/다운로드|심사 통과용|증빙용/.test(home));
const privacy = await readFile(path.join(dist, 'privacy/index.html'), 'utf8');
if (siteConfig.privacy.status === 'pending') {
  assert.ok(privacy.includes('확정된 개인정보처리방침이 아닙니다.'));
  assert.match(privacy, /noindex, follow/);
  const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('/privacy/'));
}
if (siteConfig.site.googleSiteVerification) assert.ok(home.includes(`content="${escape(siteConfig.site.googleSiteVerification)}"`));
console.log('Checked: metadata, business details, internal links, anchors, structured data, privacy status.');
