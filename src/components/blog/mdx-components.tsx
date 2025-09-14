'use client';

import Image from 'next/image';
import * as runtime from 'react/jsx-runtime';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// 1. Define your custom components
interface CalloutProps {
  children?: ReactNode;
  type?: 'default' | 'warning' | 'danger';
}

function Callout({ children, type = 'default', ...props }: CalloutProps) {
  return (
    <div
      className={cn('my-6 items-start rounded-md border border-l-4 p-4 w-full dark:max-w-none', {
        'border-destructive bg-destructive/10': type === 'danger',
        'border-yellow-500 bg-yellow-500/10': type === 'warning',
        'border-primary bg-primary/10': type === 'default',
      })}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
}

// 2. Create a shared components object
// These components will be available to all MDX files
const sharedComponents = {
  Image,
  Callout,
};

// 3. Create the hook that parses the MDX code
const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MdxProps {
  code: string;
  // Allow passing page-specific components if needed
  components?: Record<string, React.ComponentType>;
}

// 4. Create the final MDXContent component
export function MDXContent({ code, components }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
