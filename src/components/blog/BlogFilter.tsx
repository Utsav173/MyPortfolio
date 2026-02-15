// src/components/blog/BlogFilter.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Grid, List, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { slug } from 'github-slugger';

interface BlogFilterProps {
  tags: string[];
  sortedTags: string[];
  searchTerm: string;
  activeTags: string[];
  view: 'grid' | 'list';
  postsCount: number;
}

export function BlogFilter({
  tags,
  sortedTags,
  searchTerm = '',
  activeTags,
  view,
  postsCount,
}: BlogFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Local state for immediate UI feedback
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [showAllTags, setShowAllTags] = useState(false);

  // Sync local state with URL prop if it changes externally
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleSearch = (term: string) => {
    setLocalSearch(term);
    startTransition(() => {
      if (term) {
        router.push(`${pathname}?${createQueryString({ q: term })}`, { scroll: false });
      } else {
        router.push(`${pathname}?${createQueryString({ q: null })}`, { scroll: false });
      }
    });
  };

  const toggleTag = (tag: string) => {
    const slugifiedTag = slug(tag);
    let newTags = [...activeTags];

    if (newTags.includes(slugifiedTag)) {
      newTags = newTags.filter((t) => t !== slugifiedTag);
    } else {
      newTags.push(slugifiedTag);
    }

    startTransition(() => {
      if (newTags.length > 0) {
        router.push(`${pathname}?${createQueryString({ tags: newTags.join(',') })}`, {
          scroll: false,
        });
      } else {
        router.push(`${pathname}?${createQueryString({ tags: null })}`, { scroll: false });
      }
    });
  };

  const setView = (v: 'grid' | 'list') => {
    router.push(`${pathname}?${createQueryString({ view: v })}`, { scroll: false });
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, 8);
  const hasActiveFilters = activeTags.length > 0 || searchTerm.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-20 space-y-8"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
        {/* Search Input - Minimalist Bottom Border */}
        <div className="relative w-full md:max-w-md group ">
          <Input
            placeholder="Search articles..."
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8 border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors bg-transparent placeholder:text-muted-foreground/50 h-10"
          />
          {localSearch && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:text-foreground text-muted-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border border-border/40 rounded-lg p-1 bg-background/50 backdrop-blur-sm self-end md:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('grid')}
            className={cn(
              'h-7 w-7 p-0 rounded-md transition-all',
              view === 'grid'
                ? 'bg-muted text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="Grid view"
          >
            <Grid className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('list')}
            className={cn(
              'h-7 w-7 p-0 rounded-md transition-all',
              view === 'list'
                ? 'bg-muted text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="List view"
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
        {/* All Posts Filter */}
        <button
          onClick={clearAllFilters}
          className={cn(
            'text-sm font-mono transition-colors duration-300',
            activeTags.length === 0 && !searchTerm
              ? 'text-primary font-bold border-b border-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          All
        </button>

        {/* Dynamic Tags */}
        <AnimatePresence mode="popLayout">
          {visibleTags.map((tag) => {
            const isActive = activeTags.includes(slug(tag));
            return (
              <motion.button
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => toggleTag(tag)}
                className={cn(
                  'group flex items-center gap-1.5 text-sm font-mono transition-colors duration-300',
                  isActive
                    ? 'text-primary font-bold border-b border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">#</span>
                {tag}
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Show More/Less Button */}
        {sortedTags.length > 8 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllTags(!showAllTags)}
            className="h-7 px-2 text-xs font-mono text-muted-foreground hover:text-foreground"
          >
            {showAllTags ? 'Less' : 'More'}
            <ChevronDown
              className={cn('ml-1 h-3 w-3 transition-transform', showAllTags && 'rotate-180')}
            />
          </Button>
        )}

        {/* Clear Filters Action */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={clearAllFilters}
              className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 border border-border/40 rounded-full px-2 py-0.5"
            >
              <X className="h-3 w-3" />
              Clear filters
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground pt-4 border-t border-border/40"
        >
          <span>Showing {postsCount} results</span>
          {searchTerm && <span>for &quot;{searchTerm}&quot;</span>}
          {activeTags.length > 0 && <span>in {activeTags.map((t) => `#${t}`).join(', ')}</span>}
        </motion.div>
      )}
    </motion.div>
  );
}
