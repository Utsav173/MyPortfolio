'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface RelatedPost {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  image?: string;
  metadata?: {
    readingTime?: number;
  };
}

interface RelatedPostsEnhancedProps {
  posts: RelatedPost[];
  currentPost: {
    tags?: string[];
  };
}

export function RelatedPostsEnhanced({ posts, currentPost }: RelatedPostsEnhancedProps) {
  // Get the most relevant posts based on shared tags
  const sortedPosts = posts.sort((a, b) => {
    const aSharedTags = a.tags?.filter((tag) => currentPost.tags?.includes(tag)).length || 0;
    const bSharedTags = b.tags?.filter((tag) => currentPost.tags?.includes(tag)).length || 0;
    return bSharedTags - aSharedTags;
  });

  const topPosts = sortedPosts.slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Related Articles
            </span>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-5xl sm:text-4xl font-bold mb-4">Continue Reading</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover more articles on similar topics that might interest you
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {topPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={post.slug.split('/')[1]} className="group block h-full">
                <Card className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                  {/* Image */}
                  {post.image && (
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    {/* Description */}
                    {post.description && (
                      <p className="text-muted-foreground line-clamp-2">{post.description}</p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.date)}
                      </span>
                      {post.metadata?.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.metadata.readingTime} min
                        </span>
                      )}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300">
                      Read article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
