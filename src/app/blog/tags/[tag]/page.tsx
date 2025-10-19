import { posts } from '@site/content';
import { getPostsByTagSlug, getAllTags, sortPosts } from '@/lib/utils';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';
import { slug as slugger } from 'github-slugger';
import { PostGrid } from '@/components/blog/PostGrid';
import { PageWrapper } from '@/components/layout/PageWrapper';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({
  params,
}: PageProps<'/blog/tags/[tag]'>): Promise<Metadata> {
  const { tag } = await params;
  const allTags = getAllTags(posts);
  const title = Object.keys(allTags).find((t) => slugger(t) === tag) || tag;

  return {
    title: `Posts tagged with "${title}"`,
    description: `Browse all articles and posts tagged with "${title}" on Utsav Khatri's blog.`,
    alternates: {
      canonical: `${SITE_URL}/blog/tags/${tag}`,
    },
  };
}

export async function generateStaticParams() {
  const tags = getAllTags(posts);
  return Object.keys(tags).map((tag) => ({
    tag: slugger(tag),
  }));
}

export default async function TagPage({ params }: PageProps<'/blog/tags/[tag]'>) {
  const { tag } = await params;
  const allTags = getAllTags(posts);
  const title = Object.keys(allTags).find((t) => slugger(t) === tag) || tag;
  const filteredPosts = sortPosts(getPostsByTagSlug(posts, tag));

  return (
    <PageWrapper>
      <div className="container mx-auto mt-16 max-w-5xl">
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Tag Archive
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight">&#35;{title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found.
            </p>
          </div>

          <PostGrid featuredPost={null} posts={filteredPosts} view="list" />

          <div className="mt-16 text-center">
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View All Posts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
