"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, DownloadCloud } from "lucide-react";
import React, { useEffect, useRef, useCallback } from "react";
import { animate, utils, stagger, type JSAnimation } from "animejs";
import { cn, MASK_PATH_D, SVG_MAIN_PATH_D } from "@/lib/utils";
import { useTheme } from "next-themes";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgPathRef = useRef<SVGPathElement | null>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const scrollIndicatorAnimationRef = useRef<JSAnimation | null>(null);
  const svgNameAnimationRef = useRef<JSAnimation | null>(null);

  const { resolvedTheme } = useTheme();

  const initialSetup = useCallback(() => {
    const elements = [
      p1Ref.current,
      p2Ref.current,
      scrollIndicatorRef.current,
      ...(ctaContainerRef.current?.children || []),
      svgPathRef.current,
    ];

    elements.forEach((el) => {
      if (el) {
        utils.set(el, { opacity: 0 });
        if (el !== svgPathRef.current && el !== scrollIndicatorRef.current) {
          utils.set(el, { translateY: 20 });
        }
        if (el === scrollIndicatorRef.current) {
          utils.set(el, { translateY: -10 });
        }
      }
    });
    if (svgPathRef.current) {
      utils.set(svgPathRef.current, {
        opacity: 0.6,
        filter: "drop-shadow(0 0 2px transparent)",
      });
    }
  }, []);

  useEffect(() => {
    initialSetup();

    const p1El = p1Ref.current;
    const p2El = p2Ref.current;
    const ctaEl = ctaContainerRef.current;
    const scrollEl = scrollIndicatorRef.current;
    const svgPathEl = svgPathRef.current;

    const baseDelay = 200;

    if (p1El) {
      animate(p1El, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: "easeOutQuart",
        delay: baseDelay,
      });
    }

    if (svgPathEl) {
      svgPathEl.style.fill = "currentColor";

      const glowColor =
        resolvedTheme === "dark"
          ? "rgba(var(--primary-oklch-values-raw, 0.62 0.2 220), 0.7)"
          : "rgba(var(--primary-oklch-values-raw, 0.58 0.23 225), 0.5)";
      const brighterGlowColor =
        resolvedTheme === "dark"
          ? "rgba(var(--primary-oklch-values-raw, 0.62 0.2 220), 0.9)"
          : "rgba(var(--primary-oklch-values-raw, 0.58 0.23 225), 0.7)";

      svgNameAnimationRef.current = animate(svgPathEl, {
        opacity: [
          { value: 0.6, duration: 1000, easing: "easeInOutSine" },
          { value: 1, duration: 800, easing: "easeInOutSine" },
          { value: 0.6, duration: 1200, easing: "easeInOutSine" },
        ],
        filter: [
          {
            value: `drop-shadow(0 0 3px ${glowColor}) drop-shadow(0 0 8px ${glowColor})`,
            duration: 1000,
            easing: "easeInOutSine",
          },
          {
            value: `drop-shadow(0 0 6px ${brighterGlowColor}) drop-shadow(0 0 15px ${brighterGlowColor})`,
            duration: 800,
            easing: "easeInOutSine",
          },
          {
            value: `drop-shadow(0 0 3px ${glowColor}) drop-shadow(0 0 8px ${glowColor})`,
            duration: 1200,
            easing: "easeInOutSine",
          },
        ],
        loop: true,
        direction: "alternate",
        delay: baseDelay + 400,
      });
    }

    if (p2El) {
      animate(p2El, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: "easeOutQuart",
        delay: baseDelay + 600,
      });
    }

    if (ctaEl && ctaEl.children.length > 0) {
      const ctaChildren = Array.from(ctaEl.children) as HTMLElement[];
      animate(ctaChildren, {
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.9, 1],
        duration: 500,
        easing: "easeOutBack",
        delay: stagger(150, { start: baseDelay + 800 }),
        complete: () => {
          if (scrollEl) {
            scrollIndicatorAnimationRef.current = animate(scrollEl, {
              opacity: [0, 0.6],
              translateY: [
                { value: -10, duration: 1000 },
                { value: 0, duration: 1000 },
              ],
              loop: true,
              direction: "alternate",
              duration: 2000,
              easing: "easeInOutSine",
            });
          }
        },
      });
    }

    return () => {
      if (scrollIndicatorAnimationRef.current)
        scrollIndicatorAnimationRef.current.pause();
      if (svgNameAnimationRef.current) svgNameAnimationRef.current.pause();
    };
  }, [resolvedTheme, initialSetup]);

  const handleProjectScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const projectsSection = document.querySelector("#projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden pt-20 md:pt-0 bg-transparent"
    >
      <div className="container mx-auto relative z-10">
        <p
          ref={p1Ref}
          className="mb-3 md:mb-4 text-primary font-semibold text-base md:text-lg"
        >
          Hello, I'm
        </p>

        <div
          aria-label="Utsav Khatri"
          className="flex justify-center items-center my-3 md:my-4"
        >
          <svg
            width="498"
            height="64"
            viewBox="0 0 498 64"
            className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl h-auto text-foreground" // text-foreground will provide base for currentColor
          >
            <mask
              id="path-1-outside-1_2_2"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="498"
              height="64"
              fill="black"
            >
              <rect fill="white" width="498" height="64" />
              <path d={MASK_PATH_D} className="visibleNamePath" />
            </mask>
            <path
              className="visibleNamePath"
              d={SVG_MAIN_PATH_D}
              ref={svgPathRef}
              fill="currentColor"
              mask="url(#path-1-outside-1_2_2)"
              style={{
                opacity: 0.7,
                filter: "drop-shadow(0 0 2px transparent)",
              }}
            />
          </svg>
        </div>

        <p
          ref={p2Ref}
          className="mx-auto mt-3 md:mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground"
        >
          A{" "}
          <span className="text-primary font-semibold">
            Full Stack Developer
          </span>{" "}
          based in Gujarat, India.
        </p>

        <div
          ref={ctaContainerRef}
          className={cn(
            "mt-8 md:mt-10 flex flex-col items-center justify-center gap-4 select-none",
            "sm:flex-row sm:flex-wrap"
          )}
        >
          <Button
            size="lg"
            asChild
            className={cn(
              "group shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:bg-primary/90 hover:-translate-y-1 text-base h-auto",
              "w-full sm:w-auto px-8 py-3"
            )}
          >
            <Link
              href="#projects"
              onClick={handleProjectScroll}
              className="flex items-center justify-center"
            >
              Explore Projects
              <ArrowRight className="ml-2.5 size-5 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className={cn(
              "group shadow-sm hover:shadow-md transition-all duration-300 text-base h-auto",
              "w-full sm:w-auto px-8 py-3",
              "border-primary/40 hover:border-primary/70 text-primary hover:bg-primary/10 dark:border-primary/30 dark:hover:border-primary/60 dark:text-primary dark:hover:bg-primary/10",
              "focus-visible:ring-primary/50"
            )}
          >
            <a
              href="https://raw.githubusercontent.com/Utsav173/MyPortfolio/refs/heads/master/public/resume_utsav_khatri.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="resume_utsav_khatri.pdf"
              className="flex items-center justify-center"
            >
              <DownloadCloud className="mr-2.5 size-5 resume-button-icon" />
              Download Resume
            </a>
          </Button>
        </div>
      </div>
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-arrow-down text-muted-foreground/50"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
