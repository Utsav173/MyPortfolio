import { PostItem, FeaturedPostItem } from './post-item';

interface PostGridProps {
  featuredPost: any | null;
  posts: any[];
  view: 'grid' | 'list';
}

export function PostGrid({ featuredPost, posts, view }: PostGridProps) {
  return (
    <>
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-12">
          <FeaturedPostItem
            slug={featuredPost.slug}
            date={featuredPost.date}
            title={featuredPost.title}
            description={featuredPost.description}
            tags={featuredPost.tags}
            image={featuredPost.image}
            featured
          />
        </div>
      )}

      {/* Regular Posts Grid/List */}
      <div className={view === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-6'}>
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
            key={index}
          />
        ))}
      </div>
    </>
  );
}
