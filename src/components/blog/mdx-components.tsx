'use client';

import Image from 'next/image';
import * as runtime from 'react/jsx-runtime';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CalloutProps {
  children?: ReactNode;
  type?: 'default' | 'warning' | 'danger';
}

function Callout({ children, type = 'default', ...props }: CalloutProps) {
  return (
    <div
      className={cn('my-6 flex items-start rounded-md border border-l-4 p-4', {
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

const sharedComponents = {
  Image,
  Callout,
};

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MdxProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

export function MDXContent({ code, components }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
