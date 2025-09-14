// src/components/blog/EmptyState.tsx
'use client';

import { motion } from 'motion/react';
import { Search, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  searchTerm?: string;
  hasFilters: boolean;
}

export function EmptyState({ searchTerm, hasFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-6 p-6 rounded-full bg-muted/50">
        {searchTerm ? (
          <Search className="h-12 w-12 text-muted-foreground" />
        ) : (
          <FileText className="h-12 w-12 text-muted-foreground" />
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-2">
        {searchTerm ? 'No results found' : 'No posts yet'}
      </h2>

      <p className="text-muted-foreground mb-8 max-w-md">
        {searchTerm
          ? `We couldn't find any posts matching "${searchTerm}". Try adjusting your search or filters.`
          : hasFilters
            ? 'No posts match the selected filters. Try selecting different tags or clearing filters.'
            : 'Check back soon for new content!'}
      </p>

      <div className="flex gap-4">
        <Button variant="default" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            View All Posts
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}
