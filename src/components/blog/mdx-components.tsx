'use client';

import Image from 'next/image';
import * as runtime from 'react/jsx-runtime';
import { cn } from '@/lib/utils';
import { ReactNode, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

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

function Pre({ children, ...props }: any) {
  const preRef = useRef<HTMLPreElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    if (preRef.current) {
      await navigator.clipboard.writeText(preRef.current.textContent || '');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button
        disabled={isCopied}
        onClick={copy}
        className="absolute right-4 top-4 z-20 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background/50 p-2 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 disabled:opacity-100 hover:bg-background"
        aria-label="Copy code"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-foreground" />
        )}
      </button>
    </div>
  );
}

const sharedComponents = {
  Image,
  Callout,
  pre: Pre,
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
