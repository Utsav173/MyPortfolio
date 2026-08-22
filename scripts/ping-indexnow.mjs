#!/usr/bin/env node
/**
 * Ping IndexNow (Bing / Yandex / Seznam) after a production deploy so new and
 * updated URLs are picked up within hours instead of weeks. ChatGPT's search
 * index leans on Bing, so this directly improves AI-citation freshness.
 *
 * Free tier friendly: no account needed — the key file in /public IS the auth.
 * Runs only on Vercel production builds; fails open so it never breaks a build.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const KEY = '45d146a612845672da5864f1ed23911d';
const HOST = 'khatriutsav.com';
const SITE_URL = `https://${HOST}`;

const isVercelProduction = process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'production';

if (!isVercelProduction) {
  console.log('[indexnow] Skipping ping (not a Vercel production build).');
  process.exit(0);
}

try {
  const urls = [
    SITE_URL,
    `${SITE_URL}/about`,
    `${SITE_URL}/projects`,
    `${SITE_URL}/experience`,
    `${SITE_URL}/skills`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/contact`,
    `${SITE_URL}/resume`,
    `${SITE_URL}/feed.xml`,
    `${SITE_URL}/llms.txt`,
    `${SITE_URL}/llms-full.txt`,
  ];

  if (existsSync('.velite/posts.json')) {
    const posts = JSON.parse(await readFile('.velite/posts.json', 'utf8'));
    for (const post of posts) {
      if (post.published) {
        const slug = post.slugAsParams || String(post.slug).replace(/^blog\//, '');
        urls.push(`${SITE_URL}/blog/${slug}`);
      }
    }
  }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList: urls,
    }),
  });

  // 200/202 = accepted, 400 = bad key format, 403 = key file not reachable yet
  console.log(`[indexnow] Pinged ${urls.length} URLs — HTTP ${res.status}`);
} catch (err) {
  console.warn('[indexnow] Ping failed (non-fatal):', err?.message ?? err);
}
