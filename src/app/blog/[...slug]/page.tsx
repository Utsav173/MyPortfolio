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

  const relatedPosts = getRelatedPosts(posts, post).map((p: any) => ({
    slug: p.slug,
    title: p.title,
    description: p.description || '',
    date: p.date,
    tags: p.tags || [],
    image: p.image,
    readingTime: p.readingTime || p.metadata?.readingTime || 5, // Handle both locations
  }));

  // Construct a safe post object for components that mimics the structure they expect
  // This is sometimes needed if the raw 'post' type differs slightly from component props
  const safePost = {
    ...post,
    tags: post.tags || [],
    metadata: {
      readingTime: (post as any).readingTime || (post.metadata as any)?.readingTime || 5,
      views: (post.metadata as any)?.views,
    },
    // Ensure specific fields required by components are present
    image: (post as any).image,
    toc: post.toc,
    body: post.body,
  };

  return (
    <>
      <PostSchema post={post} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: SITE_URL,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: `${SITE_URL}/blog`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `${SITE_URL}/${post.slug}`,
              },
            ],
          }),
        }}
        key="breadcrumb-jsonld"
      />
      <ReadingProgress />
      <article className="min-h-screen pb-20">
        <PostHero post={safePost} />

        <div className="container px-4 sm:px-6 mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12 max-w-6xl mx-auto">
            <main className="min-w-0">
              <PostContent post={{ body: post.body }} />
            </main>
            <aside className="hidden lg:block pt-8">
              <div className="sticky top-24">
                <PostSidebar post={{ toc: post.toc }} />
              </div>
            </aside>
          </div>
        </div>

        <PostFooter post={safePost} />

        {relatedPosts.length > 0 && (
          <RelatedPostsEnhanced posts={relatedPosts} currentPost={{ tags: post.tags || [] }} />
        )}
      </article>
      <FloatingActions post={safePost} />
    </>
  );
}
