'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, RESUME_URL } from '@/lib/constants';
import { Logo } from '@/components/Logo';
import { ModeToggle } from '@/components/layout/ModeToggle';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';
import { usePathname } from 'next/navigation';
import GlassSurface from '@/components/ui/GlassSurface';

interface NavbarProps {
  className?: string;
  activeSection?: string | null;
}

export function Navbar({ className, activeSection }: NavbarProps) {
  const { handleNavClick } = useScrollToSection();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
      className={cn(
        'fixed top-3 left-1/2 z-50 h-12 w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-full shadow-lg sm:top-4 sm:h-[60px] sm:w-auto',
        className
      )}
      role="banner"
    >
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={9999}
        borderWidth={0.06}
        brightness={40}
        opacity={0.88}
        blur={12}
        backgroundOpacity={0.08}
        saturation={1.6}
        distortionScale={-70}
        className="w-full h-full border border-border/40 dark:border-border/30"
      >
        <div className="flex h-full w-full items-center justify-between gap-2 px-2.5 sm:gap-4 sm:px-4">
          <Logo className="h-6 shrink-0 sm:h-auto" />

          <nav
            aria-label="Main navigation"
            className="relative mx-auto hidden items-center space-x-0.5 md:flex lg:space-x-1"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={isHomePage && item.label !== 'Blog' ? item.href : `/${item.href}`}
                onClick={isHomePage && item.label !== 'Blog' ? handleNavClick : undefined}
                className={cn(
                  'relative rounded-md px-2.5 py-1.5 text-xs font-medium outline-none transition-all duration-300 ease-in-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:px-3 lg:py-2 lg:text-sm',
                  activeSection === item.href.substring(1)
                    ? 'font-semibold text-primary bg-accent rounded-3xl'
                    : 'text-foreground/80 hover:text-primary dark:text-foreground/85 dark:hover:text-primary'
                )}
                aria-current={activeSection === item.href.substring(1) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-2 hidden lg:block">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              download="resume_utsav_khatri.pdf"
              aria-label="Download Utsav Khatri's Resume"
              className="group hidden items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground sm:flex"
            >
              <span className="relative">
                Resume
                <span className="absolute -bottom-px left-0 h-px w-0 bg-foreground transition-all duration-300 ease-out group-hover:w-full" />
              </span>
              <Download className="size-3 opacity-50 transition-opacity duration-200 group-hover:opacity-100" />
            </a>
            <ModeToggle />
            <MobileMenu />
          </div>
        </div>
      </GlassSurface>
    </motion.header>
  );
}
