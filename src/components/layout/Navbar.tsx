"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, RESUME_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";

interface NavbarProps {
  className?: string;
  activeSection?: string | null;
}

export function Navbar({ className, activeSection }: NavbarProps) {
  const { handleNavClick } = useScrollToSection();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
      className={cn(
        "fixed top-3 left-1/2 z-50 w-[calc(100%-1.5rem)] -translate-x-1/2 sm:top-4 sm:w-auto",
        "rounded-full border border-border/30 bg-background/75 shadow-lg backdrop-blur-xl dark:bg-neutral-900/75 dark:shadow-primary/10",
        className
      )}
      role="banner"
    >
      <div
        className={cn(
          "flex h-12 items-center justify-between gap-2 px-2.5 sm:h-[52px] sm:gap-4 sm:px-4"
        )}
      >
        <Logo className="h-6 shrink-0 sm:h-auto" />

        <nav
          aria-label="Main navigation"
          className="relative mx-auto hidden items-center space-x-0.5 md:flex lg:space-x-1"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "relative rounded-md px-2.5 py-1.5 text-xs font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:px-3 lg:py-2 lg:text-sm",
                activeSection === item.href.substring(1)
                  ? "font-semibold text-primary"
                  : "text-foreground/70 hover:text-primary"
              )}
              aria-current={
                activeSection === item.href.substring(1) ? "page" : undefined
              }
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
          <Button
            variant="outline"
            size="sm"
            asChild
            className={cn(
              "hidden h-auto rounded-full px-2 py-1 text-[0.65rem] transition-all duration-300 sm:flex lg:px-3 lg:py-1.5 lg:text-xs",
              "border-primary/40 text-primary/90 hover:border-primary hover:bg-primary/10 dark:border-primary/30 dark:text-primary/80 dark:hover:border-primary/70 dark:hover:bg-primary/10 dark:hover:text-primary",
              "focus-visible:ring-primary/50"
            )}
          >
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              download="resume_utsav_khatri.pdf"
              className="flex items-center justify-center"
              aria-label="Download Utsav Khatri's Resume"
            >
              Resume
              <Download className="ml-1.5 size-3" />
            </a>
          </Button>
          <ModeToggle />
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}
