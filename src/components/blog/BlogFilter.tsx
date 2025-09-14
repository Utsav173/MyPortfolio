// src/components/blog/BlogFilter.tsx
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { slug } from 'github-slugger';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Grid3x3, List, Filter, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BlogFilterProps {
  tags: Record<string, number>;
  sortedTags: string[];
  searchTerm?: string;
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showAllTags, setShowAllTags] = useState(false);
  const [searchValue, setSearchValue] = useState(searchTerm);

  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, 8);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set('q', searchValue);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleTagToggle = (tagSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTags = params.getAll('tag');

    if (tagSlug === 'all') {
      params.delete('tag');
    } else if (currentTags.includes(tagSlug)) {
      params.delete('tag');
      currentTags.filter((t) => t !== tagSlug).forEach((t) => params.append('tag', t));
    } else {
      params.append('tag', tagSlug);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleViewToggle = (newView: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.replace(pathname);
    setSearchValue('');
  };

  const hasActiveFilters = searchTerm || activeTags.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 mb-12"
    >
      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="h-12 pl-10 pr-10 text-base"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>
        </form>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleViewToggle('grid')}
            className="h-12 w-12"
          >
            <Grid3x3 className="h-5 w-5" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleViewToggle('list')}
            className="h-12 w-12"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter by Topics
          </h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
              Clear all
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* All Posts Tag */}
          <Badge
            variant={activeTags.length === 0 ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all hover:scale-105',
              activeTags.length === 0 && 'bg-primary text-primary-foreground'
            )}
            onClick={() => handleTagToggle('all')}
          >
            All Posts ({postsCount})
          </Badge>

          {/* Individual Tags */}
          <AnimatePresence mode="popLayout">
            {visibleTags.map((tag) => {
              const tagSlug = slug(tag);
              return (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant={activeTags.includes(tagSlug) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-all hover:scale-105',
                      activeTags.includes(tagSlug) && 'bg-primary text-primary-foreground'
                    )}
                    onClick={() => handleTagToggle(tagSlug)}
                  >
                    {tag} ({tags[tag]})
                  </Badge>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Show More/Less Button */}
          {sortedTags.length > 8 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllTags(!showAllTags)}
              className="h-7 px-2"
            >
              {showAllTags ? 'Show less' : `+${sortedTags.length - 8} more`}
              <ChevronDown
                className={cn('ml-1 h-3 w-3 transition-transform', showAllTags && 'rotate-180')}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span>Showing {postsCount} results</span>
          {searchTerm && <span>for &quot;{searchTerm}&quot;</span>}
          {activeTags.length > 0 && <span>in {activeTags.join(', ')}</span>}
        </motion.div>
      )}
    </motion.div>
  );
}
