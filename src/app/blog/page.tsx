// src/app/blog/page.tsx
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
  const searchTerm = (sp?.q as string) || '';
  const activeTagsParam = sp?.tags;
  const activeTags = activeTagsParam
    ? Array.isArray(activeTagsParam)
      ? activeTagsParam
      : activeTagsParam.split(',')
    : [];

  const view = (sp?.view as 'grid' | 'list') || 'grid';

  const sorted = sortPosts(posts.filter((post) => post.published));
  const allTagsMap = getAllTags(posts); // Record<string, number>
  const allTags = Object.keys(allTagsMap); // string[]
  const sortedTags = sortTagsByCount(allTagsMap);

  const filteredPostsRaw = (() => {
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

  // Map to the interface expected by PostGrid
  const filteredPosts = filteredPostsRaw.map((post) => ({
    ...post,
    readingTime: post.metadata.readingTime,
    tags: post.tags || [],
    description: post.description || '',
  }));

  // Get featured post (only if no filters active)
  const hasFilters = searchTerm.length > 0 || activeTags.length > 0;
  const showFeatured = !hasFilters && view === 'grid' && filteredPosts.length > 0;

  const featuredPost = showFeatured ? filteredPosts[0] : undefined;
  const regularPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-32">
      {/* Asymmetric Header Section */}
      <div className="grid lg:grid-cols-[2fr,1fr] gap-12 mb-24 items-end">
        <div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-foreground mb-6 leading-[0.9]">
            The <br /> Journal.
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
            Engineering thoughts, deep dives, and experiments in web development and AI.
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-end text-right space-y-4 pb-2">
          <div className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Total Articles
          </div>
          <div className="text-4xl font-bold text-foreground">
            {posts.length < 10 ? `0${posts.length}` : posts.length}
          </div>
        </div>
      </div>

      <Suspense fallback={<BlogSkeleton />}>
        {/* Filter & Controls */}
        <BlogFilter
          tags={allTags}
          sortedTags={sortedTags}
          searchTerm={searchTerm}
          activeTags={activeTags}
          view={view}
          postsCount={filteredPosts.length}
        />

        {/* Content Area */}
        {filteredPosts.length > 0 ? (
          <PostGrid featuredPost={featuredPost} posts={regularPosts} view={view} />
        ) : (
          <EmptyState searchTerm={searchTerm} hasFilters={hasFilters} />
        )}
      </Suspense>
    </div>
  );
}
