import { MDXContent } from '@/components/blog/mdx-components';
import { Suspense } from 'react';

interface PostContentProps {
  post: {
    body: string;
  };
}

export function PostContent({ post }: PostContentProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <article className="container py-6 prose max-sm:prose-sm dark:prose-invert sm:max-w-4xl mx-auto">
        <MDXContent code={post.body} />
      </article>
    </Suspense>
  );
}
