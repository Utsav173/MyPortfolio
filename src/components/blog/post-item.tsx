// src/components/blog/post-item.tsx
'use client';

import Link from 'next/link';
import { Calendar, ArrowRight, Clock, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
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
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        shouldReduceMotion
          ? {}
          : { y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }
      }
      className="h-full"
    >
      <Link href={slug} className="block h-full">
        <Card
          className={cn(
            'group relative flex h-full cursor-pointer flex-col overflow-hidden',
            'border border-border/50 bg-card/50 backdrop-blur-sm',
            'transition-all duration-300 hover:border-primary/30',
            'hover:shadow-lg hover:shadow-primary/5',
            featured && 'ring-2 ring-primary/20'
          )}
        >
          {/* Optional Image */}
          {image && (
            <div className="relative h-48 w-full overflow-hidden bg-muted">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          )}

          <CardHeader className="space-y-3">
            {/* Meta Information */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <time dateTime={date}>{formatDate(date)}</time>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min read
              </span>
              {views && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {views} views
                </span>
              )}
            </div>

            {/* Title */}
            <CardTitle className="line-clamp-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
              {title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-grow">
            <CardDescription className="line-clamp-3 text-muted-foreground">
              {description}
            </CardDescription>
          </CardContent>

          <CardFooter className="pt-4">
            <div className="flex w-full items-center justify-between">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {tags?.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 opacity-25 hover:opacity-100"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Read More Arrow */}
              <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                Read
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </CardFooter>
        </Card>
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={slug}>
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/20 via-card to-card hover:border-primary/40 transition-all duration-300">
          <div className={cn('grid gap-6', image && 'md:grid-cols-2')}>
            {/* Content */}
            <div className="p-6 md:p-8 space-y-4">
              <Badge variant="default" className="mb-2 dark:text-pretty dark:text-black">
                Featured Post
              </Badge>

              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight group-hover:text-primary transition-colors">
                {title}
              </h2>

              <p className="text-muted-foreground text-lg line-clamp-3">{description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readingTime} min read
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="opacity-50 hover:opacity-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Image */}
            {image && (
              <div className="relative h-full min-h-[300px] md:min-h-[400px]">
                <Image src={image} alt={title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/20" />
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.article>
  );
}
