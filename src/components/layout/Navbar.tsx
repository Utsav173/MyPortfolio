"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
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

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    navItems.forEach((item) => {
      const element = document.querySelector(item.href) as HTMLElement | null;
      if (element) {
        sectionRefs.current[item.href.substring(1)] = element;
      }
    });

    const handleScroll = () => {
      let currentSectionId: string | null = null;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const activationThresholdTop = viewportHeight * 0.4;

      const heroSection = document.getElementById("hero");
      if (heroSection && scrollY < heroSection.offsetHeight * 0.6) {
        currentSectionId = null;
      } else {
        let maxVisibleHeight = 0;
        for (const item of navItems) {
          const sectionName = item.href.substring(1);
          const sectionElement = sectionRefs.current[sectionName];

          if (sectionElement) {
            const rect = sectionElement.getBoundingClientRect();
            const elementTopInViewport = rect.top;
            const elementBottomInViewport = rect.bottom;

            const visibleHeight = Math.max(
              0,
              Math.min(elementBottomInViewport, viewportHeight) -
                Math.max(elementTopInViewport, 0)
            );

            const navBarHeightEstimate = 80;
            if (
              elementTopInViewport <
                navBarHeightEstimate + activationThresholdTop &&
              elementBottomInViewport > navBarHeightEstimate
            ) {
              if (visibleHeight >= maxVisibleHeight) {
                maxVisibleHeight = visibleHeight;
                currentSectionId = sectionName;
              }
            }
          }
        }
      }

      if (
        window.scrollY + viewportHeight >=
        document.documentElement.scrollHeight - 5
      ) {
        currentSectionId = "contact";
      }

      if (activeSection !== currentSectionId) {
        setActiveSection(currentSectionId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]);

  useEffect(() => {
    if (indicatorRef.current && headerRef.current) {
      const activeLink = activeSection
        ? (headerRef.current.querySelector(
            `a[href="#${activeSection}"]`
          ) as HTMLElement)
        : null;

      if (activeLink) {
        animate(indicatorRef.current, {
          width: activeLink.offsetWidth,
          translateX: activeLink.offsetLeft,
          opacity: 1,
          duration: 400,
          easing: "easeOutQuint",
        });
      } else {
        animate(indicatorRef.current, {
          width: 0,
          opacity: 0,
          duration: 300,
          easing: "easeOutQuint",
        });
      }
    }
  }, [activeSection]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50",
        "w-[calc(100%-1.5rem)] sm:w-auto",
        "transition-opacity duration-300 ease-out",
        "bg-background/75 dark:bg-neutral-900/75 backdrop-blur-xl",
        "rounded-full border border-border/30 shadow-lg dark:shadow-primary/10"
      )}
    >
      <div className="flex h-[48px] sm:h-[52px] items-center justify-between px-3 sm:px-4 gap-3 sm:gap-4">
        <Logo className="shrink-0" />

        <nav className="hidden md:flex items-center space-x-1 relative mx-auto">
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
                "px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors duration-200 relative outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                activeSection === item.href.substring(1)
                  ? "text-primary"
                  : "text-foreground/70 hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
          <span
            ref={indicatorRef}
            className="absolute bottom-[calc(50%-10px)] left-0 h-0.5 bg-primary rounded-full"
            style={{ width: 0, opacity: 0, transform: "translateY(10px)" }}
          />
        </nav>

        <div className="flex items-center justify-end gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            asChild
            className={cn(
              "hidden sm:flex group text-[11px] lg:text-xs h-auto transition-all duration-300",
              "border-primary/40 hover:border-primary text-primary/90 hover:text-primary hover:bg-primary/10",
              "dark:border-primary/30 dark:hover:border-primary/70 dark:text-primary/80 dark:hover:text-primary dark:hover:bg-primary/10",
              "focus-visible:ring-primary/50",
              "px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full"
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
              <Download className="ml-1 sm:ml-1.5 size-3" />
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
