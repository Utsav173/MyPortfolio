// src/components/blog/post-item.tsx
'use client';

import Link from 'next/link';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PostItemProps {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: Array<string>;
  image?: string;
  readingTime?: number;
  views?: number;
  featured?: boolean;
}

export function PostItem({
  slug,
  title,
  description,
  date,
  tags,
  image,
  readingTime = 5,
  views,
  featured = false,
}: PostItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group flex flex-col h-full border-b border-border/40 pb-8 hover:border-border transition-colors duration-300"
    >
      <Link href={`/${slug}`} className="flex flex-col h-full focus:outline-none">
        {/* Image - 3:2 Aspect Ratio */}
        {image && (
          <div className="relative aspect-[3/2] w-full overflow-hidden mb-6 bg-muted/20">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Overlay on Hover */}
            <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/5" />
          </div>
        )}

        <div className="flex flex-col flex-1">
          {/* Meta Information Check */}
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">
            <time dateTime={date} className="flex items-center gap-1.5">
              {formatDate(date)}
            </time>
            <span>•</span>
            <span className="flex items-center gap-1.5">{readingTime} min read</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3 text-base/7 flex-1">
            {description}
          </p>

          {/* Footer: Tags & Action */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-muted-foreground/60 group-hover:text-primary/80 transition-colors duration-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-foreground border-b border-transparent group-hover:border-primary transition-colors duration-300 pb-0.5">
              Read
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// Featured Post Item for hero section
export function FeaturedPostItem({
  slug,
  title,
  description,
  date,
  tags,
  image,
  readingTime = 5,
}: PostItemProps) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative w-full overflow-hidden"
    >
      <Link href={`/${slug}`} className="block group">
        <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8 lg:gap-12 items-start">
          {/* Left: Content */}
          <div className="flex flex-col justify-center order-2 lg:order-1 relative z-10 pl-6 border-l-4 border-primary/20 group-hover:border-primary transition-colors duration-500 py-2">
            {/* Tag & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-xs font-bold text-primary tracking-widest uppercase">
                Featured Story
              </span>
              <span className="h-px w-8 bg-border" />
              <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <time dateTime={date}>{formatDate(date)}</time>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-foreground group-hover:text-primary transition-colors duration-300 leading-[1.1]">
              {title}
            </h2>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl text-balance">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-4">
              {tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono border border-border/50 text-muted-foreground bg-secondary/30 group-hover:border-primary/30 group-hover:text-primary/80 transition-all duration-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          {image && (
            <div className="order-1 lg:order-2 relative aspect-[16/9] lg:aspect-square w-full overflow-hidden rounded-sm group-hover:shadow-2xl transition-all duration-500">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
