'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { type Toc, type TocEntry } from '@/types';

interface TableOfContentsProps {
  toc: Toc;
}

const TocEntry = ({ entry, activeId }: { entry: TocEntry; activeId: string | null }) => {
  return (
    <li>
      <a
        href={entry.url}
        className={cn(
          'block text-sm transition-colors hover:text-primary',
          entry.url.substring(1) === activeId ? 'font-medium text-primary' : 'text-muted-foreground'
        )}
      >
        {entry.title}
      </a>
      {entry.items.length > 0 && (
        <ul className="pl-4 mt-2 space-y-2">
          {entry.items.map((child) => (
            <TocEntry key={child.url} entry={child} activeId={activeId} />
          ))}
        </ul>
      )}
    </li>
  );
};

export function TableOfContents({ toc }: TableOfContentsProps) {
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
      { rootMargin: `0% 0% -80% 0%` }
    );

    const getIds = (entries: TocEntry[]): string[] => {
      return entries.flatMap((entry) => [entry.url.substring(1), ...getIds(entry.items)]);
    };

    const ids = getIds(toc);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () =>
      elements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
  }, [toc]);

  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 rounded-lg border bg-card p-4 shadow-sm">
      <p className="font-semibold text-primary">On This Page</p>
      <ul className="space-y-2">
        {toc.map((entry) => (
          <TocEntry key={entry.url} entry={entry} activeId={activeId} />
        ))}
      </ul>
    </div>
  );
}
