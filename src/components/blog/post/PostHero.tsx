// src/components/blog/post/PostHero.tsx
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
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
    <section className="relative w-full overflow-hidden border-b border-border bg-background">
      {/* The "Magical" Radial Gradient Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, oklch(var(--primary-oklch-values) / 0.8), transparent)',
        }}
      />

      <div className="container relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {post.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 text-xs opacity-25 hover:opacity-100"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          {post.description && (
            <p className="mb-8 max-w-3xl text-base text-muted-foreground sm:text-lg opacity-75 hover:opacity-100">
              {post.description}
            </p>
          )}

          <div className="flex flex-col items-center gap-y-6 sm:flex-row sm:gap-x-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarImage src="/images/utsav-khatri.webp" alt="Utsav Khatri" />
                <AvatarFallback>UK</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">Utsav Khatri</p>
                <p className="text-sm text-muted-foreground">Full Stack Developer</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />
                <span>{post.metadata.readingTime} min read</span>
              </div>
              {post.metadata.views && (
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>{post.metadata.views.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>

          {post.image && (
            <div className="relative mt-12 w-full max-w-4xl overflow-hidden rounded-xl shadow-lg">
              <div className="relative aspect-[16/9] w-full">
                <Image src={post.image} alt={post.title} fill className="object-cover" priority />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
