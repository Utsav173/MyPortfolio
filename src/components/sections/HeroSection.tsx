"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, DownloadCloud } from "lucide-react";
import React, { useEffect, useRef, lazy, Suspense } from "react";
import anime from "animejs/lib/anime.es.js";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const MatrixDataStream = lazy(
  () => import("@/components/threed/MatrixDataStream")
);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = anime.timeline({
      easing: "easeOutExpo",
      delay: 500,
    });

    if (p1Ref.current) {
      p1Ref.current.style.opacity = "0";
      tl.add({
        targets: p1Ref.current,
        opacity: [0, 1],
        translateY: [20, 0],
        filter: ["blur(2px)", "blur(0px)"],
        duration: 700,
      });
    }

    if (nameRef.current) {
      const nameEl = nameRef.current;
      nameEl.style.opacity = "0";
      const nameText = nameEl.dataset.text || "Utsav Khatri";
      nameEl.innerHTML = "";

      nameText.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        nameEl.appendChild(span);
      });

      tl.add(
        {
          targets: nameEl.querySelectorAll("span"),
          opacity: [0, 1],
          translateY: [() => anime.random(25, 50), 0],
          rotateX: [() => anime.random(-90, -60), 0],
          scale: [0.8, 1],
          duration: 1200,
          delay: anime.stagger(40, { start: 0, easing: "easeOutQuad" }),
          easing: "spring(1, 80, 15, 0)",
        },
        "-=400"
      );
      nameEl.style.opacity = "1";
    }

    if (p2Ref.current) {
      p2Ref.current.style.opacity = "0";
      tl.add(
        {
          targets: p2Ref.current,
          opacity: [0, 1],
          translateY: [20, 0],
          filter: ["blur(2px)", "blur(0px)"],
          duration: 900,
        },
        "-=800"
      );
    }

    if (ctaContainerRef.current) {
      const ctaElements = Array.from(
        ctaContainerRef.current.children
      ) as HTMLElement[];
      ctaElements.forEach((el) => (el.style.opacity = "0"));
      tl.add(
        {
          targets: ctaElements,
          opacity: [0, 1],
          translateY: [20, 0],
          scale: [0.95, 1],
          duration: 700,
          delay: anime.stagger(100, { start: 0 }),
          easing: "easeOutBack",
        },
        "-=600"
      );
    }

    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = "0";
      anime({
        targets: scrollIndicatorRef.current,
        opacity: [0, 1],
        translateY: [
          { value: -15, duration: 800, easing: "easeOutBounce" },
          { value: 0, duration: 800, easing: "easeInBounce" },
        ],
        loop: true,
        direction: "alternate",
        delay: tl.duration + 300,
        duration: 1600,
      });
    }

    return () => {
      anime.remove(p1Ref.current);
      if (nameRef.current)
        anime.remove(nameRef.current.querySelectorAll("span"));
      anime.remove(p2Ref.current);
      if (ctaContainerRef.current)
        anime.remove(Array.from(ctaContainerRef.current.children));
      anime.remove(scrollIndicatorRef.current);
    };
  }, []);

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
        <h1 ref={nameRef} data-text="Utsav Khatri" className="text-balance">
          Utsav Khatri
        </h1>
        <p
          ref={p2Ref}
          className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-muted-foreground"
        >
          A{" "}
          <span className="text-primary font-semibold">
            Full Stack Developer
          </span>{" "}
          based in Gujarat, India. I specialize in crafting scalable,
          cloud-native web applications and robust APIs, with a keen interest in
          leveraging AI to build intelligent solutions.
        </p>

        <div
          ref={ctaContainerRef}
          className={cn(
            "mt-10 flex flex-col items-center justify-center gap-4",
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
              onClick={(e) => {
                e.preventDefault();
                const projectsSection = document.querySelector("#projects");
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
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
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10"
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
