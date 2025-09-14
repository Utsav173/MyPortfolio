// src/components/blog/post/PostContent.tsx
'use client';

import { MDXContent } from '@/components/blog/mdx-components';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface PostContentProps {
  post: {
    body: string;
  };
}

export function PostContent({ post }: PostContentProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'prose prose-lg dark:prose-invert max-w-none',
        'prose-headings:scroll-mt-20 prose-headings:font-bold',
        'prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4',
        'prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4',
        'prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3',
        'prose-p:leading-relaxed prose-p:mb-6',
        'prose-li:leading-relaxed',
        'prose-strong:font-semibold prose-strong:text-foreground',
        'prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline',
        'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5',
        'prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg',
        'prose-blockquote:not-italic prose-blockquote:font-medium',
        'prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-border',
        'prose-img:rounded-xl prose-img:shadow-lg',
        'prose-table:overflow-hidden prose-table:rounded-lg prose-table:shadow-sm',
        'prose-th:bg-muted prose-th:font-semibold',
        'prose-td:border-border',
        'prose-hr:border-border'
      )}
    >
      <MDXContent code={post.body} />
    </motion.article>
  );
}
