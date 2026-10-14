import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { docs, products } from '../src/data.ts';

const content = new Map(
  readdirSync(new URL('../src/content/', import.meta.url))
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => [
      name.slice(0, -4),
      readFileSync(new URL(`../src/content/${name}`, import.meta.url), 'utf8'),
    ]),
);
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

test('every registered page has MDX content, with no duplicate or orphan slugs', () => {
  assert.equal(new Set(docs.map((doc) => doc.slug)).size, docs.length);
  assert.deepEqual(
    [...content.keys()].sort(),
    docs.map((doc) => doc.slug).sort(),
  );
  for (const doc of docs) {
    assert.ok(doc.title && doc.description && doc.time);
    assert.ok(
      content.get(doc.slug).length > 500,
      `${doc.slug} should be a real guide`,
    );
  }
});

test('each product card points to an existing product guide', () => {
  for (const product of products) {
    assert.ok(
      docs.find((doc) => doc.slug === product.id && doc.repo === product.repo),
    );
  }
});

test('internal MDX links resolve and generated heading anchors are unique', () => {
  const routes = new Set([
    '/',
    '/products',
    '/guides',
    '/repositories',
    ...docs.map((doc) => `/docs/${doc.slug}`),
  ]);
  for (const [slug, text] of content) {
    const headings = [...text.matchAll(/^## (.+)$/gm)].map((match) =>
      slugify(match[1]),
    );
    assert.equal(
      new Set(headings).size,
      headings.length,
      `Duplicate heading in ${slug}`,
    );
    for (const [, link] of text.matchAll(/\]\((\/[^)\s]+)\)/g)) {
      assert.ok(
        routes.has(link.split('#')[0]),
        `Broken link ${link} in ${slug}`,
      );
    }
  }
});

test('OAuth sample preserves the API prefix and validates state before exchanging the code', () => {
  const oauth = content.get('oauth');
  assert.ok(oauth.includes('new URL(`${AUTH}/oauth/authorize`)'));
  assert.ok(
    oauth.indexOf("params.get('state') !== expectedState") <
      oauth.indexOf('fetch(`${AUTH}/oauth/token`'),
  );
});

test('Cloudflare Pages receives a SPA fallback and safe static headers', () => {
  assert.match(
    readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8'),
    /\/\* \/index\.html 200/,
  );
  const headers = readFileSync(
    new URL('../public/_headers', import.meta.url),
    'utf8',
  );
  assert.ok(headers.includes('X-Content-Type-Options: nosniff'));
  assert.ok(headers.includes('/assets/*'));
});
