'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { type Toc, type TocEntry } from '@/types';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Share2, Bookmark, Download, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PostSidebarProps {
  post: {
    toc: Toc;
    slug: string;
    title: string;
  };
}

export function PostSidebar({ post }: PostSidebarProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `-80px 0% -80% 0%` }
    );

    const getIds = (entries: TocEntry[]): string[] => {
      return entries.flatMap((entry) => [entry.url.substring(1), ...getIds(entry.items)]);
    };

    const ids = getIds(post.toc);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () =>
      elements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
  }, [post.toc]);

  const TocEntry = ({ entry, depth = 0 }: { entry: TocEntry; depth?: number }) => {
    const isActive = entry.url.substring(1) === activeId;

    return (
      <li>
        <a
          href={entry.url}
          onClick={(e) => {
            e.preventDefault();
            const element = document.querySelector(entry.url);
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={cn(
            'group flex items-center gap-2 py-2 text-sm transition-all hover:text-primary',
            depth > 0 && 'pl-4',
            isActive ? 'font-medium text-primary' : 'text-muted-foreground hover:translate-x-1'
          )}
        >
          {isActive && <ChevronRight className="h-3 w-3 text-primary" />}
          <span className={cn('line-clamp-2', isActive && 'text-primary')}>{entry.title}</span>
        </a>
        {entry.items.length > 0 && (
          <ul className="space-y-1 border-l border-border/50 ml-2">
            {entry.items.map((child) => (
              <TocEntry key={child.url} entry={child} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="sticky top-24 space-y-4">
      {/* Table of Contents */}
      {post.toc && post.toc.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-lg border bg-card p-4 shadow-sm"
        >
          <h3 className="mb-4 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            On This Page
          </h3>
          <nav>
            <ul className="space-y-1">
              {post.toc.map((entry) => (
                <TocEntry key={entry.url} entry={entry} />
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </div>
  );
}
