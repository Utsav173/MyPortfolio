// src/components/blog/post/RelatedPostsEnhanced.tsx
'use client';

import { motion } from 'motion/react';
import { PostItem } from '@/components/blog/post-item';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  readingTime: number;
}

interface RelatedPostsEnhancedProps {
  posts: RelatedPost[];
  currentPost: {
    tags: string[];
  };
}

export function RelatedPostsEnhanced({ posts, currentPost }: RelatedPostsEnhancedProps) {
  // Get the most relevant posts based on shared tags
  const sortedPosts = posts.sort((a, b) => {
    const aSharedTags = a.tags?.filter((tag) => currentPost.tags?.includes(tag)).length || 0;
    const bSharedTags = b.tags?.filter((tag) => currentPost.tags?.includes(tag)).length || 0;
    return bSharedTags - aSharedTags;
  });

  const topPosts = sortedPosts.slice(0, 2); // Show 2 posts for better grid rhythm

  return (
    <section className="py-24 border-t border-border/40">
      <div className="container px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-primary mb-2">
              Keep Reading
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              More from the Journal
            </h2>
          </div>

          <Link
            href="/blog"
            className="group flex items-center gap-2 text-sm font-medium border-b border-transparent hover:border-primary transition-colors pb-0.5"
          >
            View all articles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-x-12 gap-y-16 md:grid-cols-2">
          {topPosts.map((post) => (
            <PostItem
              key={post.slug}
              slug={post.slug}
              date={post.date}
              title={post.title}
              description={post.description}
              tags={post.tags}
              image={post.image}
              readingTime={post.readingTime}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
