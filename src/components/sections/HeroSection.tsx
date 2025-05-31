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
  const p1Ref = useRef<HTMLParagraphElement | null>(null);
  const p2Ref = useRef<HTMLParagraphElement | null>(null);
  const ctaContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  const { resolvedTheme } = useTheme();
  const nameChars = "Utsav Khatri".split("");

  const initialSetup = useCallback(() => {
    gsap.set([p1Ref.current, p2Ref.current], { opacity: 0, y: 20 });
    if (ctaContainerRef.current) {
      gsap.set(ctaContainerRef.current.children, {
        opacity: 0,
        y: 20,
        scale: 0.95,
      });
    }
    if (nameContainerRef.current) {
      gsap.set(nameContainerRef.current.querySelectorAll(".name-char"), {
        opacity: 0,
        y: 30,
        filter: "blur(4px)",
        scale: 0.9,
      });
      gsap.set(nameContainerRef.current, { textShadow: "0 0 0px transparent" });
    }
    gsap.set(scrollIndicatorRef.current, { opacity: 0, y: -10 });
  }, []);

  useGSAP(
    () => {
      initialSetup();

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      let primaryColor = "oklch(0.58 0.23 225)";
      if (typeof window !== "undefined") {
        primaryColor =
          resolvedTheme === "dark"
            ? getComputedStyle(document.documentElement)
                .getPropertyValue("--primary")
                .trim() || "oklch(0.62 0.2 220)"
            : getComputedStyle(document.documentElement)
                .getPropertyValue("--primary")
                .trim() || "oklch(0.58 0.23 225)";
      }

      const oklchToOklcha = (colorStr: string, alpha: number) => {
        if (colorStr.startsWith("oklch(")) {
          return colorStr
            .replace("oklch(", "oklcha(")
            .replace(")", `/ ${alpha})`);
        }
        return colorStr;
      };

      const initialGlow = `0 0 5px ${oklchToOklcha(
        primaryColor,
        0.3
      )}, 0 0 10px ${oklchToOklcha(primaryColor, 0.2)}`;
      const peakGlow = `0 0 12px ${oklchToOklcha(
        primaryColor,
        0.5
      )}, 0 0 24px ${oklchToOklcha(primaryColor, 0.3)}`;
      const subtleEndGlow = `0 0 3px ${oklchToOklcha(
        primaryColor,
        0.15
      )}, 0 0 6px ${oklchToOklcha(primaryColor, 0.1)}`;

      tl.to(p1Ref.current, { opacity: 1, y: 0 }, 0.2)
        .to(
          nameContainerRef.current?.querySelectorAll(".name-char") || [],
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            stagger: 0.06,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          nameContainerRef.current,
          {
            textShadow: initialGlow,
            duration: 0.3,
            ease: "power1.inOut",
          },
          "-=0.3"
        )
        .to(nameContainerRef.current, {
          textShadow: peakGlow,
          duration: 0.4,
          ease: "power2.inOut",
        })
        .to(nameContainerRef.current, {
          textShadow: subtleEndGlow,
          duration: 0.6,
          ease: "power2.out",
        })
        .to(p2Ref.current, { opacity: 1, y: 0, duration: 0.6 }, "-=1.0")
        .to(
          ctaContainerRef.current?.children || [],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.7"
        )
        .to(
          scrollIndicatorRef.current,
          { opacity: 0.6, y: 0, duration: 0.5, ease: "sine.inOut" },
          "-=0.3"
        )
        .add(() => {
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
    { scope: sectionRef, dependencies: [resolvedTheme, initialSetup] }
  );

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
      id={id}
      className={cn(
        className,
        "min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden bg-transparent"
      )}
    >
      <div className="container mx-auto relative z-10">
        <p
          ref={p1Ref}
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
          {nameChars.map((char, index) => (
            <span
              key={index}
              className="name-char inline-block"
              style={char === " " ? { width: "0.2em" } : {}}
            >
              {char}
            </span>
          ))}
        </h1>
        <p
          ref={p2Ref}
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
            size="default"
            asChild
            className={cn(
              "group shadow-md hover:shadow-primary/30 transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5 text-sm h-auto",
              "w-full max-w-xs sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 sm:text-base sm:hover:-translate-y-1"
            )}
          >
            <Link
              href="#projects"
              onClick={handleProjectScroll}
              className="flex items-center justify-center"
            >
              Explore Projects
              <ArrowRight className="ml-2 size-4 sm:ml-2.5 sm:size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="default"
            variant="outline"
            asChild
            className={cn(
              "group shadow-sm hover:shadow-md transition-all duration-300 text-sm h-auto",
              "w-full max-w-xs sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 sm:text-base",
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
              <DownloadCloud className="mr-2 size-4 sm:mr-2.5 sm:size-5 resume-button-icon" />
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
