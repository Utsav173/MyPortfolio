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
          url: `/api/og?${ogSearchParams.toString()}`,
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
      images: [`/api/og?${ogSearchParams.toString()}`],
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

      <article className="min-h-screen mx-auto container">
        {/* Hero Section */}
        <PostHero post={post} />

        {/* Main Content Area */}
        <div className="container px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto relative">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-16">
              <PostSidebar post={post} />
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-9 xl:col-span-8">
              <PostContent post={post} />

              {/* Post Footer */}
              <PostFooter post={post} />
            </main>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPostsEnhanced posts={relatedPosts} currentPost={post} />
        )}
      </article>

      {/* Floating Actions */}
      <FloatingActions post={post} />
    </>
  );
}
