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
