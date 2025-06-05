"use client";

import { useCallback } from "react";
import Link from "next/link";
import { motion, useReducedMotion, Variants } from "motion/react";
import { ArrowRight, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] },
  },
};

const nameContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const nameCharVariants: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.9, rotateX: -30 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

const scrollIndicatorVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 0.6,
    y: 10,
    transition: {
      opacity: { duration: 0.5, ease: "easeOut", delay: 1.5 },
      y: {
        from: 0,
        duration: 0.75,
        ease: "circInOut",
        delay: 2,
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
  const shouldReduceMotion = useReducedMotion();
  const nameParts = "Utsav Khatri".split("");

  const handleProjectScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const projectsSection = document.querySelector("#projects");
      if (projectsSection) {
        const yOffset = -80;
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
    <motion.section
      id={id}
      className={cn(
        "relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-transparent px-4 text-center",
        className
      )}
      variants={shouldReduceMotion ? {} : heroVariants}
      initial={shouldReduceMotion ? undefined : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
      aria-labelledby="hero-heading"
    >
      <div className="container relative z-10 mx-auto">
        <motion.p
          variants={shouldReduceMotion ? {} : itemVariants}
          className="mb-3 text-base font-semibold text-primary md:text-lg"
        >
          Hello, I'm
        </motion.p>
        <motion.h1
          id="hero-heading"
          aria-label="Utsav Khatri"
          variants={shouldReduceMotion ? {} : nameContainerVariants}
          style={{ perspective: "800px" }}
          className={cn(
            "my-2 select-none font-bold tracking-tighter text-foreground",
            "text-[2.75rem] leading-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
          )}
        >
          {nameParts.map((char, index) => (
            <motion.span
              key={index}
              variants={shouldReduceMotion ? {} : nameCharVariants}
              className="inline-block"
              style={char === " " ? { width: "0.25em" } : {}}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          variants={shouldReduceMotion ? {} : itemVariants}
          className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:mt-4 md:text-xl"
        >
          A{" "}
          <span className="font-semibold text-primary">
            Full Stack Developer
          </span>{" "}
          based in Gujarat, India, crafting high-performance web experiences.
        </motion.p>
        <motion.div
          variants={shouldReduceMotion ? {} : itemVariants}
          className={cn(
            "mt-8 flex select-none flex-col items-center justify-center gap-4 sm:flex-row md:mt-10"
          )}
        >
          <Button
            size="lg"
            asChild
            className={cn(
              "group relative h-auto overflow-hidden rounded-full px-7 py-3 text-base shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-primary/40 active:scale-[0.98] sm:px-8 sm:py-3.5 btn-primary-gradient-sweep"
            )}
          >
            <Link
              href="#projects"
              onClick={handleProjectScroll}
              className="flex items-center justify-center"
              aria-label="Explore my projects"
            >
              Explore Projects
              <ArrowRight className="ml-2.5 size-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className={cn(
              "group h-auto rounded-full px-7 py-3 text-base shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md active:scale-[0.98] sm:px-8 sm:py-3.5",
              "border-primary/70 text-primary hover:border-primary hover:bg-primary/10 dark:border-primary/60 dark:text-primary dark:hover:border-primary/80 dark:hover:bg-primary/15"
            )}
          >
            <a
              href="/resume_utsav_khatri.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="resume_utsav_khatri.pdf"
              className="flex items-center justify-center"
              aria-label="Download Utsav Khatri's Resume"
            >
              <DownloadCloud className="mr-2.5 size-5 resume-button-icon" />
              Download Resume
            </a>
          </Button>
        </motion.div>
      </div>
      <motion.div
        variants={shouldReduceMotion ? {} : scrollIndicatorVariants}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
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
