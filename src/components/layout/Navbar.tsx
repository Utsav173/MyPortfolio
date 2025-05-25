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
  const [scrolled, setScrolled] = useState(false);
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
      const newScrolled = window.scrollY > 50;
      if (newScrolled !== scrolled) {
        setScrolled(newScrolled);
      }

      let currentSectionId: string | null = null;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const activationThresholdTop = viewportHeight * 0.4;
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        if (scrollY < viewportHeight * 0.4) {
          currentSectionId = null;
        }
      }

      if (currentSectionId === null) {
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

            if (
              elementTopInViewport < activationThresholdTop &&
              elementBottomInViewport > activationThresholdTop
            ) {
              if (visibleHeight > maxVisibleHeight) {
                maxVisibleHeight = visibleHeight;
                currentSectionId = sectionName;
              }
            } else if (
              !currentSectionId &&
              elementTopInViewport < viewportHeight &&
              elementBottomInViewport > 0
            ) {
              if (visibleHeight > maxVisibleHeight) {
                maxVisibleHeight = visibleHeight;
                currentSectionId = sectionName;
              }
            }
          }
        }
      }

      // Special case for 'contact' section if at the very bottom of the page
      if (
        window.scrollY + viewportHeight >=
        document.documentElement.scrollHeight - 5
      ) {
        // 5px buffer
        currentSectionId = "contact";
      }

      if (activeSection !== currentSectionId) {
        setActiveSection(currentSectionId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Initial header animation
    if (headerRef.current) {
      headerRef.current.style.opacity = "0"; // Set initial for anime
      animate(headerRef.current, {
        translateY: [-100, 0],
        opacity: [0, 1],
        duration: 700,
        easing: "easeOutExpo",
        delay: 200,
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // scrolled removed from deps to avoid re-running sectionRefs population

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
        // Animate out smoothly
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
        "sticky top-0 z-50 w-full border-b transition-all duration-300 ease-out",
        scrolled
          ? "border-border/40 bg-background/85 backdrop-blur-lg shadow-sm"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container flex h-[72px] max-w-screen-xl items-center">
        <Logo />
        <nav className="hidden md:flex items-center space-x-1 ml-auto relative">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                const targetSection =
                  sectionRefs.current[item.href.substring(1)];
                if (targetSection) {
                  targetSection.scrollIntoView({
                    behavior: "smooth",
                  });
                }
                setActiveSection(item.href.substring(1));
              }}
              className={cn(
                "px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 relative outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
            className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
            style={{ width: 0, opacity: 0 }} // Initial state
          />
        </nav>
        <div className="flex items-center justify-end space-x-2 max-sm:ml-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className={cn(
              "hidden sm:flex group text-[13px] h-auto transition-all duration-300",
              "border-primary/40 hover:border-primary text-primary/90 hover:text-primary hover:bg-primary/10",
              "dark:border-primary/30 dark:hover:border-primary/70 dark:text-primary/80 dark:hover:text-primary dark:hover:bg-primary/10",
              "focus-visible:ring-primary/50",
              "px-3.5 py-1.5"
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
              <Download className="ml-1.5 size-3.5 resume-button-icon" />
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
