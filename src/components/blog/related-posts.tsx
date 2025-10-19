import { Post } from '@site/content';
import { PostItem } from './post-item';

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto sm:max-w-5xl">
      <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Related Articles</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostItem
            key={post.slug}
            slug={post.slug}
            date={post.date}
            title={post.title}
            description={post.description}
            tags={post.tags}
          />
        ))}
      </div>
    </div>
  );
}
