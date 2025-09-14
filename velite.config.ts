import { defineConfig, defineCollection, s } from 'velite';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerNotationWordHighlight,
  transformerRenderWhitespace,
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerCompactLineOptions,
  transformerNotationErrorLevel,
} from '@shikijs/transformers';
import { ShikiTransformer } from 'shiki';

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split('/').slice(1).join('/'),
});

const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.mdx',
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      date: s.isodate(),
      updated: s.isodate().optional(),
      published: s.boolean().default(true),
      tags: s.array(s.string()).optional(),
      body: s.mdx(),
      metadata: s.metadata(),
      toc: s.toc(),
    })
    .transform(computedFields),
});

const transformerCopyButton = (): ShikiTransformer => ({
  name: 'copy-button',
  pre(node) {
    node.children.push({
      type: 'element',
      tagName: 'button',
      properties: {
        type: 'button',
        className: 'copy',
        title: 'Copy to clipboard',
        onclick: `
          navigator.clipboard.writeText(this.previousSibling.textContent),
          this.className='copied',
          this.title='Copied!',
          setTimeout(()=>this.className='copy',5000)`.replace(/\s+/g, ''),
      },
      children: [
        {
          type: 'element',
          tagName: 'svg',
          properties: {
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '1.5',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          },
          children: [
            {
              type: 'element',
              tagName: 'rect',
              properties: {
                width: '8',
                height: '4',
                x: '8',
                y: '2',
                rx: '1',
                ry: '1',
              },
              children: [],
            },
            {
              type: 'element',
              tagName: 'path',
              properties: {
                d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
              },
              children: [],
            },
            {
              type: 'element',
              tagName: 'path',
              properties: {
                class: 'check',
                d: 'm9 14 2 2 4-4',
              },
              children: [],
            },
          ],
        },
      ],
    });
  },
});

const rehypePrettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: true,
  onVisitLine(node: any) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node: any) {
    node.properties.className.push('highlighted');
  },
  onVisitHighlightedChars(node: any) {
    node.properties.className = ['highlighted'];
  },
  filterMetaString: (meta: string) => meta.replace(/\[.*]/, ''),
  transformers: [
    transformerNotationDiff(),
    transformerNotationHighlight(),
    transformerNotationFocus(),
    transformerNotationWordHighlight(),
    transformerRenderWhitespace(),
    transformerMetaHighlight(),
    transformerMetaWordHighlight(),
    transformerCompactLineOptions(),
    transformerNotationErrorLevel(),
    transformerCopyButton(),
  ],
};

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, rehypePrettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
    remarkPlugins: [],
  },
});
