"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/button";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Download } from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Navbar({
  className,
  activeSection,
}: {
  className?: string;
  activeSection?: string | null;
}) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  React.useEffect(() => {
    navItems.forEach((item) => {
      const element = document.querySelector(item.href) as HTMLElement | null;
      if (element) {
        sectionRefs.current[item.href.substring(1)] = element;
      }
    });
  }, []);

  const handleNavLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement =
      sectionRefs.current[targetId] || document.getElementById(targetId);

    if (targetElement) {
      const yOffset = -70;
      const y =
        targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
      className={cn(
        "fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50",
        "w-[calc(100%-1.5rem)] xs:w-[calc(100%-2rem)] sm:w-auto",
        "bg-background/75 dark:bg-neutral-900/75 backdrop-blur-xl",
        "rounded-full border border-border/30 shadow-lg dark:shadow-primary/10",
        className
      )}
      role="banner"
    >
      <div
        className={cn(
          "flex items-center justify-between",
          "h-12 sm:h-[52px]",
          "px-2.5 xs:px-3 sm:px-4",
          "gap-2 xs:gap-3 sm:gap-4"
        )}
      >
        <Logo className="shrink-0 h-6 xs:h-7 sm:h-auto" />
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center space-x-0.5 lg:space-x-1 relative mx-auto"
        >
          {navItems.map((item) => (
            <React.Fragment key={item.label}>
              <Link
                href={item.href}
                onClick={(e) => handleNavLinkClick(e, item.href)}
                className={cn(
                  "px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-md text-xs lg:text-sm font-medium transition-colors duration-200 relative outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  activeSection === item.href.substring(1)
                    ? "text-primary font-semibold"
                    : "text-foreground/70 hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-1 xs:gap-1.5 sm:gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            asChild
            className={cn(
              "hidden sm:flex group text-[0.65rem] xs:text-[11px] lg:text-xs h-auto transition-all duration-300",
              "border-primary/40 hover:border-primary text-primary/90 hover:text-primary hover:bg-primary/10",
              "dark:border-primary/30 dark:hover:border-primary/70 dark:text-primary/80 dark:hover:text-primary dark:hover:bg-primary/10",
              "focus-visible:ring-primary/50",
              "px-2 py-1 xs:px-2.5 xs:py-1 lg:px-3 lg:py-1.5 rounded-full"
            )}
          >
            <a
              href="https://raw.githubusercontent.com/Utsav173/MyPortfolio/refs/heads/master/public/resume_utsav_khatri.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="resume_utsav_khatri.pdf"
              className="flex items-center justify-center"
              aria-label="Download Utsav Khatri's Resume"
            >
              Resume
              <Download className="ml-1 xs:ml-1.5 size-2.5 xs:size-3" />
            </a>
          </Button>
          <ModeToggle />
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
