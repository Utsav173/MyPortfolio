// src/components/blog/Breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface Breadcrumb {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('text-sm mt-4 w-full overflow-x-scroll scrollbar-hidden', className)}
    >
      <ol className="flex flex-nowrap items-center gap-1 flex-1">
        {items.map((item, index) => (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center"
          >
            {index === 0 ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  'transition-colors',
                  index === items.length - 1
                    ? 'text-foreground font-medium pointer-events-none'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            )}
            {index < items.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-muted-foreground/50" />
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}
