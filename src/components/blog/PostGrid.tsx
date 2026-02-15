import { PostItem, FeaturedPostItem } from '@/components/blog/post-item';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  readingTime: number;
  views?: number;
}

interface PostGridProps {
  featuredPost?: BlogPost;
  posts: BlogPost[];
  view: 'grid' | 'list';
}

export function PostGrid({ featuredPost, posts, view }: PostGridProps) {
  return (
    <>
      {/* Featured Post - Full Width */}
      {featuredPost && (
        <div className="mb-20">
          <FeaturedPostItem
            slug={featuredPost.slug}
            date={featuredPost.date}
            title={featuredPost.title}
            description={featuredPost.description}
            tags={featuredPost.tags}
            image={featuredPost.image}
            readingTime={featuredPost.readingTime}
          />
        </div>
      )}

      {/* Regular Posts Grid/List */}
      <div
        className={
          view === 'grid' ? 'grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-2' : 'space-y-12'
        }
      >
        {posts.map((post, index) => (
          <PostItem
            slug={post.slug}
            date={post.date}
            title={post.title}
            description={post.description}
            tags={post.tags}
            image={post.image}
            readingTime={post.readingTime}
            views={post.views}
            key={post.slug}
          />
        ))}
      </div>
    </>
  );
}
