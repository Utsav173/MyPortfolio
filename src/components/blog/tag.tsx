import Link from 'next/link';
import { slug } from 'github-slugger';
import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import React from 'react';

interface TagProps {
  tag: string;
  current?: boolean;
  count?: number;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Tag({ tag, current, count, href, onClick }: TagProps) {
  const badgeClasses = cn(
    badgeVariants({
      variant: current ? 'default' : 'secondary',
      className: 'no-underline rounded-md transition-all duration-200',
    }),
    onClick && 'cursor-pointer'
  );

  const content = `${tag}${count ? ` (${count})` : ''}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={badgeClasses}>
        {content}
      </button>
    );
  }

  return (
    <Link className={badgeClasses} href={href || `/tags/${slug(tag)}`}>
      {content}
    </Link>
  );
}
