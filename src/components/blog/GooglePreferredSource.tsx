'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useTheme } from 'next-themes';
import { SITE_URL } from '@/lib/config';
import { Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GooglePreferredSourceProps {
  variant?: 'card' | 'compact' | 'link';
  className?: string;
}

export function GooglePreferredSource({ variant = 'card', className }: GooglePreferredSourceProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  let domain = 'khatriutsav.com';
  try {
    domain = new URL(SITE_URL).hostname;
  } catch {
    domain = 'khatriutsav.com';
  }

  const googlePrefUrl = `https://www.google.com/preferences/source?q=${encodeURIComponent(domain)}`;
  const currentTheme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <>
      <Script src="https://news.google.com/swg/js/v1/publisher.js" strategy="lazyOnload" />

      {variant === 'card' && (
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-muted/20 p-6 sm:p-7 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md',
            className
          )}
        >
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  Google Search Priority
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                Prefer this source on Google Search
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Add <span className="font-semibold text-foreground">{domain}</span> as a preferred
                source to prioritize engineering articles in your Google{' '}
                <span className="font-medium text-foreground">AI Overviews</span>,{' '}
                <span className="font-medium text-foreground">AI Mode</span>, and{' '}
                <span className="font-medium text-foreground">Top Stories</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              {/* Google Native Preferred Source Button */}
              <div
                {...{ 'google-add-preferred-source-btn': '' }}
                data-theme={currentTheme}
                data-lang="en"
                className="flex items-center justify-center min-h-[38px] min-w-[140px]"
              />

              {/* Fallback Direct Link in case script is pending/blocked */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 border-dashed"
              >
                <a
                  href={googlePrefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Google Source Preferences directly"
                >
                  <span>Direct link</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {variant === 'compact' && (
        <div className={cn('inline-flex items-center gap-2', className)}>
          <div
            {...{ 'google-add-preferred-source-btn': '' }}
            data-theme={currentTheme}
            data-lang="en"
            className="inline-flex items-center min-h-[34px]"
          />
        </div>
      )}

      {variant === 'link' && (
        <a
          href={googlePrefUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline',
            className
          )}
        >
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Follow on Google Search</span>
        </a>
      )}
    </>
  );
}
