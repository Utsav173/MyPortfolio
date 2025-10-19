import { posts } from '@site/content';
import { sortPosts, getAllTags, sortTagsByCount } from '@/lib/utils';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';
import { slug } from 'github-slugger';
import { BlogFilter } from '@/components/blog/BlogFilter';
import { EmptyState } from '@/components/blog/EmptyState';
import { PostGrid } from '@/components/blog/PostGrid';
import { Suspense } from 'react';
import { BlogSkeleton } from '@/components/blog/BlogSkeleton';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'My thoughts on web development, AI, and modern technology.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const searchTerm = sp?.q as string | undefined;
  const activeTags = sp?.tag ? (Array.isArray(sp.tag) ? sp.tag : [sp.tag]) : [];
  const view = (sp?.view as 'grid' | 'list') || 'grid';

  const sorted = sortPosts(posts.filter((post) => post.published));
  const allTags = getAllTags(posts);
  const sortedTags = sortTagsByCount(getAllTags(posts));

  const filteredPosts = (() => {
    let filtered = sorted;

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (activeTags.length > 0) {
      filtered = filtered.filter((post) =>
        activeTags.some((tag) => post.tags?.map((t) => slug(t)).includes(tag))
      );
    }

    return filtered;
  })();

  // Get featured post (most recent or specially marked)
  const featuredPost = !searchTerm && activeTags.length === 0 ? filteredPosts[0] : null;
  const regularPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="min-h-screen container mx-auto mt-16">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Utsav&apos;s Tech Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            My thoughts on web development, AI, and modern technology.
          </p>
        </div>
        <Suspense fallback={<BlogSkeleton />}>
          <BlogFilter
            tags={allTags}
            sortedTags={sortedTags}
            searchTerm={searchTerm}
            activeTags={activeTags}
            view={view}
            postsCount={filteredPosts.length}
          />

          {filteredPosts?.length > 0 ? (
            <PostGrid featuredPost={featuredPost} posts={regularPosts} view={view} />
          ) : (
            <EmptyState searchTerm={searchTerm} hasFilters={activeTags.length > 0} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
