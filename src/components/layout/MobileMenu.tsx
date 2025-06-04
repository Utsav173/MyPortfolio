"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const resumeUrl =
  "https://raw.githubusercontent.com/Utsav173/MyPortfolio/refs/heads/master/public/resume_utsav_khatri.pdf";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const yOffset = -70;
      const y =
        targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full p-1 shrink-0"
          aria-label="Toggle Menu"
        >
          <Menu className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn(
          "w-[300px] sm:w-[360px] p-0",
          "bg-transparent border-none shadow-none",
          "flex items-center justify-start"
        )}
      >
        <div
          className={cn(
            "m-4 h-[calc(100dvh-2rem)] max-h-[96dvh] w-full rounded-2xl",
            "bg-background/85 dark:bg-neutral-900/85 backdrop-blur-lg",
            "border border-border/30 shadow-xl",
            "flex flex-col overflow-hidden"
          )}
        >
          <SheetHeader className="p-4 sm:p-6 border-b border-border/30 shrink-0">
            <SheetTitle className="text-left text-md sm:text-lg font-semibold">
              Navigation
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-1 p-4 sm:p-6 overflow-y-auto flex-grow">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-3 py-2.5 sm:py-3 text-base sm:text-lg font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => handleLinkClick(link.href)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="resume_utsav_khatri.pdf"
              className="block px-3 py-2.5 sm:py-3 text-base sm:text-lg font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors mt-4 border-t border-border/30 pt-4 sm:pt-5"
              onClick={() => setIsOpen(false)}
            >
              Download Resume
            </a>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
