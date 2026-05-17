'use client';

import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';
import { NAV_ITEMS, RESUME_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

import GlassSurface from '@/components/ui/GlassSurface';

const MobileMenuComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollTo } = useScrollToSection();

  const handleLinkClick = useCallback(
    (href: string) => {
      setIsOpen(false);
      scrollTo(href);
    },
    [scrollTo]
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn(
          'w-[300px] sm:w-[360px] p-0',
          'flex items-center justify-start border-none bg-transparent shadow-none'
        )}
      >
        <GlassSurface
          width="calc(100% - 2rem)"
          height="calc(100dvh - 2rem)"
          borderRadius={16}
          borderWidth={0.06}
          brightness={40}
          opacity={0.88}
          blur={12}
          backgroundOpacity={0.08}
          saturation={1.6}
          distortionScale={-70}
          className="m-4 border border-border/40 dark:border-border/30 max-h-[96dvh]"
        >
          <div className="flex flex-col w-full h-full overflow-hidden">
            <SheetHeader className="shrink-0 border-b border-border/30 p-4 sm:p-6">
              <SheetTitle className="text-left text-base font-semibold sm:text-lg">
                Navigation
              </SheetTitle>
            </SheetHeader>
            <nav className="flex-grow overflow-y-auto p-4 sm:p-6">
              <ul className="flex flex-col space-y-1">
                {NAV_ITEMS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block rounded-md px-3 py-2.5 text-base font-medium transition-all hover:bg-accent hover:rounded-full hover:text-accent-foreground sm:py-3 sm:text-lg"
                      onClick={() => handleLinkClick(link.href)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={RESUME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="resume_utsav_khatri.pdf"
                    className="block rounded-md px-3 py-2 text-base font-medium transition-all hover:rounded-full  hover:bg-accent hover:text-accent-foreground mt-4 border-t border-border/30 pt-4 sm:py-3 sm:text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Download Resume
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </GlassSurface>
      </SheetContent>
    </Sheet>
  );
};

export const MobileMenu = memo(MobileMenuComponent);
