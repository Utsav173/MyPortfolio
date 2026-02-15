// src/components/blog/EmptyState.tsx
'use client';

import { motion } from 'motion/react';
import { Search, ArrowLeft } from 'lucide-react';
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
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-6 opacity-20">
        <Search className="h-16 w-16" />
      </div>

      <h2 className="text-xl font-bold tracking-tight mb-3">
        {searchTerm ? 'No results found' : 'No posts yet'}
      </h2>

      <p className="text-muted-foreground mb-8 max-w-sm text-sm leading-relaxed">
        {searchTerm
          ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search keywords.`
          : hasFilters
            ? 'No articles match the selected filters.'
            : 'The journal is currently empty. Check back soon for new stories.'}
      </p>

      <div className="flex gap-4">
        <Button variant="outline" asChild className="h-10 px-6">
          <Link href="/blog">Clear all filters</Link>
        </Button>
      </div>
    </motion.div>
  );
}
