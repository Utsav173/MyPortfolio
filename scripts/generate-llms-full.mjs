#!/usr/bin/env node
/**
 * Generates public/llms-full.txt at build time: the llms.txt index followed by
 * the full text of every published blog post. Compliant AI agents fetch one
 * file instead of crawling N pages. Free-tier friendly (static file, no runtime cost).
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/;

function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (m) data[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
  return { data, body: raw.slice(match[0].length) };
}

async function main() {
  const header = await readFile('public/llms.txt', 'utf8');

  let full = `${header}
---

# Full Content: Blog Posts

The complete text of every published article follows, for direct citation without crawling.

`;

  const files = (await readdir('content/blog')).filter((f) => f.endsWith('.mdx')).sort();

  for (const file of files) {
    const raw = await readFile(`content/blog/${file}`, 'utf8');
    const { data, body } = parseFrontmatter(raw);
    if (String(data.published) !== 'true') continue;

    const slug = file.replace(/\.mdx$/, '');
    full += `## ${data.title ?? slug}\n`;
    full += `URL: https://khatriutsav.com/blog/${slug}\n`;
    if (data.date) full += `Published: ${data.date}\n`;
    if (data.description) full += `\n${data.description}\n`;
    full += `\n${body.trim()}\n\n---\n\n`;
  }

  await writeFile('public/llms-full.txt', full);
  console.log(`[llms-full] Wrote public/llms-full.txt (${(full.length / 1024).toFixed(1)} kB)`);
}

main().catch((err) => {
  console.warn('[llms-full] Generation failed (non-fatal):', err?.message ?? err);
});
