"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, DownloadCloud } from "lucide-react";
import React, { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export function HeroSection({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const nameContainerRef = useRef<HTMLHeadingElement | null>(null);
  const introTextRef = useRef<HTMLParagraphElement | null>(null);
  const subTextRef = useRef<HTMLParagraphElement | null>(null);
  const ctaContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  const { resolvedTheme } = useTheme();

  const nameParts = [
    "U",
    "t",
    "s",
    "a",
    "v",
    " ",
    "K",
    "h",
    "a",
    "t",
    "r",
    "i",
  ];

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      gsap.set(introTextRef.current, { opacity: 0, y: 20 });
      gsap.set(subTextRef.current, { opacity: 0, y: 20 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0, y: -10 });

      if (ctaContainerRef.current) {
        gsap.set(ctaContainerRef.current.children, {
          opacity: 0,
          y: 20,
          scale: 0.95,
        });
      }

      const nameChars =
        nameContainerRef.current?.querySelectorAll(".name-char");
      if (nameChars) {
        gsap.set(nameChars, {
          opacity: 0,
          y: 25,
          scale: 0.9,
          rotationX: -30,
          transformOrigin: "center bottom -20px",
        });
      }
      if (nameContainerRef.current) {
        gsap.set(nameContainerRef.current, { perspective: "800px" });
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2,
      });

      tl.to(introTextRef.current, { opacity: 1, y: 0, duration: 0.7 });

      if (nameChars) {
        tl.to(
          nameChars,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }

      let primaryColorVal = "oklch(0.58 0.23 225)";
      if (typeof window !== "undefined") {
        const rootStyle = getComputedStyle(document.documentElement);
        primaryColorVal =
          rootStyle.getPropertyValue("--primary").trim() ||
          (resolvedTheme === "dark"
            ? "oklch(0.62 0.2 220)"
            : "oklch(0.58 0.23 225)");
      }

      const oklchToOklcha = (colorStr: string, alpha: number) => {
        if (colorStr.startsWith("oklch(")) {
          return colorStr
            .replace("oklch(", "oklcha(")
            .replace(")", `/ ${alpha})`);
        }
        return colorStr;
      };
      const subtleEndGlow = `0 0 5px ${oklchToOklcha(
        primaryColorVal,
        0.2
      )}, 0 0 10px ${oklchToOklcha(primaryColorVal, 0.1)}`;

      if (nameContainerRef.current) {
        tl.to(
          nameContainerRef.current,
          {
            textShadow: subtleEndGlow,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.3"
        );
      }

      tl.to(subTextRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.8");

      if (ctaContainerRef.current?.children) {
        tl.to(
          ctaContainerRef.current.children,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        );
      }

      tl.to(
        scrollIndicatorRef.current,
        { opacity: 0.6, y: 0, duration: 0.5, ease: "sine.inOut" },
        "-=0.2"
      ).add(() => {
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, {
            y: 10,
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: "sine.inOut",
          });
        }
      });
    },
    { scope: sectionRef, dependencies: [resolvedTheme] }
  );

  const handleProjectScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const projectsSection = document.querySelector("#projects");
      if (projectsSection) {
        const yOffset = -70;
        const y =
          projectsSection.getBoundingClientRect().top +
          window.scrollY +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    []
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "min-h-dvh flex flex-col justify-center items-center text-center px-4 relative overflow-hidden bg-transparent",
        className
      )}
    >
      <div className="container mx-auto relative z-10">
        <p
          ref={introTextRef}
          className="mb-2 sm:mb-3 md:mb-4 text-primary font-semibold text-sm sm:text-base md:text-lg"
        >
          Hello, I'm
        </p>
        <h1
          ref={nameContainerRef}
          aria-label="Utsav Khatri"
          className={cn(
            "my-2 sm:my-3 md:my-2 font-bold tracking-tighter text-foreground select-none",
            "text-[2.75rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl",
            "leading-tight"
          )}
        >
          {nameParts.map((char, index) => (
            <span
              key={index}
              className="name-char inline-block"
              style={char === " " ? { width: "0.2em", display: "inline" } : {}}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <p
          ref={subTextRef}
          className="mx-auto mt-2 sm:mt-3 md:mt-4 max-w-xl sm:max-w-2xl md:max-w-3xl text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0"
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
            "mt-6 sm:mt-8 md:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 select-none",
            "sm:flex-row sm:flex-wrap"
          )}
        >
          <Button
            size="lg"
            asChild
            className={cn(
              "group relative overflow-hidden btn-primary-gradient-sweep",
              "bg-primary hover:bg-primary/95 text-primary-foreground",
              "shadow-lg hover:shadow-primary/40 dark:shadow-primary/30 dark:hover:shadow-primary/50",
              "transition-all duration-300 ease-out hover:-translate-y-1 active:scale-[0.98]",
              "px-7 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base rounded-full h-auto"
            )}
          >
            <Link
              href="#projects"
              onClick={handleProjectScroll}
              className="flex items-center justify-center"
            >
              Explore Projects
              <ArrowRight className="ml-2.5 size-4 sm:size-5 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className={cn(
              "group",
              "border-primary/70 hover:border-primary text-primary hover:bg-primary/10 dark:border-primary/60 dark:hover:border-primary/80 dark:text-primary dark:hover:bg-primary/15",
              "shadow-sm hover:shadow-md dark:hover:shadow-primary/20",
              "transition-all duration-300 ease-out hover:-translate-y-1 active:scale-[0.98]",
              "px-7 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base rounded-full h-auto"
            )}
          >
            <a
              href="https://raw.githubusercontent.com/Utsav173/MyPortfolio/refs/heads/master/public/resume_utsav_khatri.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="resume_utsav_khatri.pdf"
              className="flex items-center justify-center"
            >
              <DownloadCloud className="mr-2.5 size-4 sm:size-5 resume-button-icon group-hover:animate-[bounceOnce_0.6s_ease-in-out] group-focus-visible:animate-[bounceOnce_0.6s_ease-in-out]" />
              Download Resume
            </a>
          </Button>
        </div>
      </div>
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
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
