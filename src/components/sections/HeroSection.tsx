"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, DownloadCloud } from "lucide-react";
import React, { useEffect, useRef, lazy, Suspense, useCallback } from "react";
import { animate, utils, stagger, svg } from "animejs";
import { cn, MASK_PATH_D, SVG_MAIN_PATH_D } from "@/lib/utils";
import { useTheme } from "next-themes";

const MatrixDataStream = lazy(
  () => import("@/components/threed/MatrixDataStream")
);

type AnimeInstance = ReturnType<typeof animate>;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGPathElement | null>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const scrollIndicatorAnimationRef = useRef<AnimeInstance | null>(null);
  const { theme } = useTheme();

  const initialSetup = useCallback(() => {
    const elementsToReset = [
      p1Ref.current,
      p2Ref.current,
      scrollIndicatorRef.current,
    ];
    elementsToReset.forEach((el) => el && utils.set(el, { opacity: 0 }));

    if (p1Ref.current) utils.set(p1Ref.current, { translateY: 20 });
    if (p2Ref.current) utils.set(p2Ref.current, { translateY: 20 });
    if (scrollIndicatorRef.current)
      utils.set(scrollIndicatorRef.current, { translateY: -10 });

    if (ctaContainerRef.current) {
      (Array.from(ctaContainerRef.current.children) as HTMLElement[]).forEach(
        (el) => utils.set(el, { opacity: 0, translateY: 20, scale: 0.95 })
      );
    }
  }, []);

  useEffect(() => {
    initialSetup();

    const p1El = p1Ref.current;
    // const namePathElement =
    //   svgRef.current?.querySelector<SVGPathElement>(".visibleNamePath");

    // console.log(namePathElement);

    const p2El = p2Ref.current;
    const ctaEl = ctaContainerRef.current;
    const scrollEl = scrollIndicatorRef.current;

    if (!p1El || !p2El || !ctaEl || !scrollEl) {
      return;
    }

    const ctaElements = ctaEl
      ? (Array.from(ctaEl.children) as HTMLElement[])
      : [];

    if (scrollIndicatorAnimationRef.current) {
      scrollIndicatorAnimationRef.current.pause();
    }

    animate(p1El, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: "easeOutQuart",
      delay: 0,
    });

    const pathElement = svgRef.current;
    if (pathElement) {
      animate(svg.createDrawable(pathElement), {
        draw: ["0 0", "0 1", "1 1"],
        duration: 2000,
        easing: "inOutQuad",
        delay: 600,
        loop: true,
      });
    }

    animate(p2El, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      easing: "easeOutQuart",
      delay: 800,
    });

    if (ctaElements.length > 0) {
      animate(ctaElements, {
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.9, 1],
        duration: 500,
        easing: "easeOutBack",
        delay: stagger(150, { start: 1000 }),
        complete: () => {
          if (scrollEl && !scrollIndicatorAnimationRef.current?.began) {
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
      if (scrollIndicatorAnimationRef.current) {
        scrollIndicatorAnimationRef.current.pause();
      }
    };
  }, [theme, initialSetup]);

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
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden pt-20 md:pt-0"
    >
      <Suspense
        fallback={<div className="absolute inset-0 -z-20 bg-background" />}
      >
        <MatrixDataStream className="absolute inset-0 -z-10" />
      </Suspense>
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
            className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl h-auto text-foreground"
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
              ref={svgRef}
              fill="#338CFF"
              mask="url(#path-1-outside-1_2_2)"
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
              href="/resume_utsav_khatri.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Utsav_Khatri_Resume.pdf"
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
