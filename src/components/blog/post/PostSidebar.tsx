'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { type Toc, type TocEntry } from '@/types';

interface PostSidebarProps {
  post: {
    toc: Toc;
  };
}

export function PostSidebar({ post }: PostSidebarProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
          return;
        }
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-80px 0% -70% 0%',
      threshold: 1.0,
    });

    const getIds = (entries: TocEntry[]): string[] => {
      return entries.flatMap((entry) => [entry.url.substring(1), ...getIds(entry.items)]);
    };

    const ids = getIds(post.toc);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [post.toc]);

  const TocEntry = ({ entry }: { entry: TocEntry }) => {
    const isActive = entry.url.substring(1) === activeId;

    return (
      <li>
        <a
          href={entry.url}
          onClick={(e) => {
            e.preventDefault();
            const element = document.querySelector(entry.url);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className={cn(
            'block py-2 pl-4 text-sm transition-all duration-300 -ml-px border-l-2',
            isActive
              ? 'border-primary font-medium text-foreground'
              : 'border-transparent text-muted-foreground hover:border-border/60 hover:text-foreground'
          )}
        >
          {entry.title}
        </a>
        {entry.items.length > 0 && (
          <ul className="mt-2 space-y-2 pl-4">
            {entry.items.map((child) => (
              <TocEntry key={child.url} entry={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  if (!post.toc || post.toc.length === 0) {
    return null;
  }

  return (
    <div className="pt-2 max-h-[calc(100vh-96px)] overflow-y-auto scrollbar-none">
      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-4">
        Table of Contents
      </h3>
      <nav className="relative">
        <ul className="space-y-0 border-l border-border/40">
          {post.toc.map((entry) => (
            <TocEntry key={entry.url} entry={entry} />
          ))}
        </ul>
      </nav>
    </div>
  );
}
