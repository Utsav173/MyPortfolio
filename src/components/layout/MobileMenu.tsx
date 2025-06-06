"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { NAV_ITEMS, RESUME_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
          "w-[300px] sm:w-[360px] p-0",
          "flex items-center justify-start border-none bg-transparent shadow-none"
        )}
      >
        <div
          className={cn(
            "m-4 h-[calc(100dvh-2rem)] max-h-[96dvh] w-full rounded-2xl",
            "border border-border/30 bg-background/85 shadow-xl backdrop-blur-lg dark:bg-neutral-900/85",
            "flex flex-col overflow-hidden"
          )}
        >
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
                    className="block rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:py-3 sm:text-lg"
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
                  className="block rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground mt-4 border-t border-border/30 pt-4 sm:py-3 sm:pt-5 sm:text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Download Resume
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const MobileMenu = memo(MobileMenuComponent);
