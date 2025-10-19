import { posts as allPosts } from '@site/content';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';
import { getRelatedPosts } from '@/lib/utils';
import { Post } from '@site/content';

import { PostHero } from '@/components/blog/post/PostHero';
import { PostContent } from '@/components/blog/post/PostContent';
import { PostSidebar } from '@/components/blog/post/PostSidebar';
import { PostFooter } from '@/components/blog/post/PostFooter';
import { FloatingActions } from '@/components/blog/post/FloatingActions';
import { RelatedPostsEnhanced } from '@/components/blog/post/RelatedPostsEnhanced';
import { PostSchema } from '@/components/blog/post/PostSchema';
import { ReadingProgress } from '@/components/blog/post/ReadingProgress';

const posts = allPosts as Post[];

async function getPostFromParams(params: PageProps<'/blog/[...slug]'>['params']) {
  const slug = (await params)?.slug?.join('/');
  const post = posts.find((post) => post.slugAsParams === slug);
  return post;
}

export async function generateMetadata({
  params,
}: PageProps<'/blog/[...slug]'>): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('title', post.title);

  const ogImageUrl = `${SITE_URL}/api/og?${ogSearchParams.toString()}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: 'Utsav Khatri', url: SITE_URL }],
    alternates: {
      canonical: `${SITE_URL}/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description ?? '',
      type: 'article',
      url: `${SITE_URL}/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      ...(post.updated && { modifiedTime: new Date(post.updated).toISOString() }),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description ?? '',
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slugAsParams.split('/'),
  }));
}

export default async function PostPage({ params }: PageProps<'/blog/[...slug]'>) {
  const post = await getPostFromParams(params);

  if (!post || !post.published) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(posts, post);

  return (
    <>
      <PostSchema post={post} />
      <ReadingProgress />

      <article className="min-h-screen">
        <PostHero post={post} />

        <div className="mx-auto px-4 lg:px-8 py-8 lg:py-12 sm:max-w-7xl">
            <aside className="hidden lg:block fixed left-4 -lg:left-[max(1rem,calc((100vw-80rem)/2))] top-24 w-64 lg:w-72 h-[calc(100vh-7rem)] overflow-y-auto z-10">
              <PostSidebar post={post} />
            </aside>

            <main className="min-w-0 sm:max-w-4xl flex-grow">
              <PostContent post={post} />
              <PostFooter post={post} />
            </main>

            <div className="hidden lg:block w-72 flex-shrink-0"></div>
        </div>

        {relatedPosts.length > 0 && (
          <RelatedPostsEnhanced posts={relatedPosts} currentPost={post} />
        )}
      </article>

      <FloatingActions post={post} />
    </>
  );
}
