'use client';

import { memo } from 'react';

const FooterSectionComponent = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative z-20 w-full border-t border-border/30 bg-background/80 dark:bg-background/60 backdrop-blur-xl shadow-[0_-2px_24px_0_rgba(0,0,0,0.10)]">
      <div className="mx-auto flex flex-col items-center justify-center gap-2 py-8 px-4 max-w-4xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block h-1 w-16 rounded-full bg-gradient-to-r from-primary/70 via-primary/40 to-transparent dark:from-primary/80 dark:via-primary/50 dark:to-transparent" />
        </div>
        <p className="text-balance text-center text-[1.05rem] font-medium text-muted-foreground md:text-base">
          Designed & Built by{' '}
          <a
            href="https://github.com/Utsav173"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary underline-offset-4 hover:underline transition-colors duration-200"
          >
            Utsav Khatri
          </a>{' '}
          · © {currentYear} · All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const FooterSection = memo(FooterSectionComponent);
export default FooterSection;
