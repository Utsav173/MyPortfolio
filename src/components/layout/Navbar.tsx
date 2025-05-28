"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Download } from "lucide-react";
import { animate } from "animejs";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Navbar({ className }: { className?: string }) {
  const headerRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    navItems.forEach((item) => {
      const element = document.querySelector(item.href) as HTMLElement | null;
      if (element) {
        sectionRefs.current[item.href.substring(1)] = element;
      }
    });
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.opacity = "0";
      headerRef.current.style.transform = "scale(0.9) translateY(-20px)";
      animate(headerRef.current, {
        translateY: ["-20px", "0px"],
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutQuint",
        delay: 300,
      });
    }
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        className,
        "fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50",
        "w-[calc(100%-1.5rem)] xs:w-[calc(100%-2rem)] sm:w-auto",
        "transition-opacity duration-300 ease-out",
        "bg-background/75 dark:bg-neutral-900/75 backdrop-blur-xl",
        "rounded-full border border-border/30 shadow-lg dark:shadow-primary/10"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between",
          "h-12 sm:h-[52px]",
          "px-2.5 xs:px-3 sm:px-4",
          "gap-2 xs:gap-3 sm:gap-4"
        )}
      >
        <Logo className="shrink-0 h-6 xs:h-7 sm:h-auto" />{" "}
        {/* Responsive Logo height */}
        <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1 relative mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                const targetSection =
                  sectionRefs.current[item.href.substring(1)];
                if (targetSection) {
                  const yOffset = -70;
                  const y =
                    targetSection.getBoundingClientRect().top +
                    window.scrollY +
                    yOffset;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className={cn(
                "px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-md text-xs lg:text-sm font-medium transition-colors duration-200 relative outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "text-foreground/70 hover:text-primary"
              )}
            >
              {item.label}
            </Link>
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
            >
              Resume
              <Download className="ml-1 xs:ml-1.5 size-2.5 xs:size-3" />{" "}
              {/* Responsive icon */}
            </a>
          </Button>
          <ModeToggle />
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
