// src/components/blog/post/PostHero.tsx
'use client';

import Image from 'next/image';
import { CalendarIcon, ClockIcon, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PostHeroProps {
  post: {
    title: string;
    description?: string;
    date: string;
    updated?: string;
    tags?: string[];
    image?: string;
    metadata: {
      readingTime: number;
      views?: number;
    };
  };
}

export function PostHero({ post }: PostHeroProps) {
  return (
    <section className="relative w-full border-b border-border/40 bg-background pt-24 pb-12">
      <div className="container relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-start text-left max-w-4xl">
          {/* Tags as Section Header */}
          <div className="mb-8 flex flex-wrap gap-4 text-sm font-mono text-primary font-bold uppercase tracking-widest">
            {post.tags?.map((tag) => <span key={tag}>#{tag}</span>)}
          </div>

          {/* Title - Massive Editorial Style */}
          <h1 className="mb-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.9]">
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p className="mb-12 max-w-2xl text-xl sm:text-2xl text-muted-foreground leading-relaxed font-light">
              {post.description}
            </p>
          )}

          {/* Author & Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-6 sm:gap-12 items-center w-full border-y border-border/40 py-6">
            {/* Meta Stats */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-mono text-muted-foreground uppercase tracking-wider sm:justify-self-end">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>Published {formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-3.5 w-3.5" />
                <span>{post.metadata.readingTime} min read</span>
              </div>
              {post.metadata.views && (
                <div className="flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{post.metadata.views.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>

          {/* Hero Image */}
          {post.image && (
            <div className="relative mt-16 w-full overflow-hidden shadow-2xl bg-muted/20 border border-border/20">
              <div className="relative aspect-[21/9] w-full">
                <Image src={post.image} alt={post.title} fill className="object-cover" priority />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
