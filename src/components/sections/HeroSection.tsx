"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, DownloadCloud } from "lucide-react";
import React, { useCallback } from "react";
import { motion, useReducedMotion, Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const introTextVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] },
  },
};

const nameContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
};

const nameCharVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.9,
    rotateX: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

const subTextVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.7 },
  },
};

const ctaContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.9,
    },
  },
};

const ctaItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const scrollIndicatorVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 0.6,
    y: 10,
    transition: {
      opacity: { duration: 0.5, ease: "easeOut", delay: 1.2 },
      y: {
        from: 0,
        duration: 0.75,
        ease: "circInOut",
        delay: 1.2 + 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  },
};

export function HeroSection({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  const { resolvedTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

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

  const primaryColor = React.useMemo(() => {
    if (typeof window === "undefined") {
      return resolvedTheme === "dark"
        ? "oklch(0.62 0.2 220)"
        : "oklch(0.58 0.23 225)";
    }
    const rootStyle = getComputedStyle(document.documentElement);
    return (
      rootStyle.getPropertyValue("--primary").trim() ||
      (resolvedTheme === "dark"
        ? "oklch(0.62 0.2 220)"
        : "oklch(0.58 0.23 225)")
    );
  }, [resolvedTheme]);

  const oklchToOklcha = (colorStr: string, alpha: number) => {
    if (colorStr.startsWith("oklch(")) {
      return colorStr.replace("oklch(", "oklcha(").replace(")", `/ ${alpha})`);
    }
    return colorStr;
  };

  const subtleEndGlow = `0 0 5px ${oklchToOklcha(
    primaryColor,
    0.2
  )}, 0 0 10px ${oklchToOklcha(primaryColor, 0.1)}`;

  const nameTextShadowVariants: Variants = {
    hidden: { textShadow: "0 0 0px transparent" },
    visible: {
      textShadow: subtleEndGlow,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.9 },
    },
  };

  return (
    <motion.section
      id={id}
      className={cn(
        "min-h-dvh flex flex-col justify-center items-center text-center px-4 relative overflow-hidden bg-transparent",
        className
      )}
      initial={shouldReduceMotion ? undefined : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
      variants={shouldReduceMotion ? {} : heroVariants}
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto relative z-10">
        <motion.p
          variants={shouldReduceMotion ? {} : introTextVariants}
          className="mb-2 sm:mb-3 md:mb-4 text-primary font-semibold text-sm sm:text-base md:text-lg"
        >
          Hello, I'm
        </motion.p>
        <motion.h1
          id="hero-heading"
          aria-label="Utsav Khatri"
          variants={shouldReduceMotion ? {} : nameContainerVariants}
          style={{ perspective: "800px" }}
          className={cn(
            "my-2 sm:my-3 md:my-2 font-bold tracking-tighter text-foreground select-none",
            "text-[2.75rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl",
            "leading-tight"
          )}
        >
          <motion.span
            className="inline-block"
            initial={shouldReduceMotion ? undefined : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
            variants={shouldReduceMotion ? {} : nameTextShadowVariants}
          >
            {nameParts.map((char, index) => (
              <motion.span
                key={index}
                variants={shouldReduceMotion ? {} : nameCharVariants}
                className="name-char inline-block"
                style={
                  char === " " ? { width: "0.2em", display: "inline" } : {}
                }
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.span>
        </motion.h1>
        <motion.p
          variants={shouldReduceMotion ? {} : subTextVariants}
          className="mx-auto mt-2 sm:mt-3 md:mt-4 max-w-xl sm:max-w-2xl md:max-w-3xl text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0"
        >
          A{" "}
          <span className="text-primary font-semibold">
            Full Stack Developer
          </span>{" "}
          based in Gujarat, India.
        </motion.p>
        <motion.div
          variants={shouldReduceMotion ? {} : ctaContainerVariants}
          className={cn(
            "mt-6 sm:mt-8 md:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 select-none",
            "sm:flex-row sm:flex-wrap"
          )}
        >
          <motion.div variants={shouldReduceMotion ? {} : ctaItemVariants}>
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
                aria-label="Explore my projects"
              >
                Explore Projects
                <ArrowRight className="ml-2.5 size-4 sm:size-5 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          <motion.div variants={shouldReduceMotion ? {} : ctaItemVariants}>
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
                aria-label="Download Utsav Khatri's Resume"
              >
                <DownloadCloud className="mr-2.5 size-4 sm:size-5 resume-button-icon group-hover:animate-[bounceOnce_0.6s_ease-in-out] group-focus-visible:animate-[bounceOnce_0.6s_ease-in-out]" />
                Download Resume
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "visible"}
        variants={shouldReduceMotion ? {} : scrollIndicatorVariants}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0"
        aria-hidden="true"
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
      </motion.div>
    </motion.section>
  );
}
