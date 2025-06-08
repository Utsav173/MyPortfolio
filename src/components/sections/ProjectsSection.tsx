"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { ProjectCard, type Project } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  Variants,
  useInView,
  LayoutGroup,
} from "motion/react";

const PROJECTS_INITIAL_DISPLAY_COUNT = 6;
const PROJECTS_INCREMENT = 4;

const headingVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(3px)",
    willChange: "opacity, transform, filter",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    willChange: "auto",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      filter: { duration: 0.6 },
    },
  },
};

const cardContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.96,
    willChange: "opacity, transform",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    willChange: "auto",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      scale: { duration: 0.5 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(1px)",
    willChange: "opacity, transform, filter",
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const filterContainerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.05,
    },
  },
};

const filterButtonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const popularFilters = [
  "Next.js",
  "React",
  "AI",
  "Three.js",
  "Hono.js",
  "TypeScript",
  "Fintech",
];

interface ProjectsSectionProps {
  className?: string;
  id?: string;
  initialProjects: Project[];
}

export function ProjectsSection({
  className,
  id,
  initialProjects,
}: ProjectsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [displayedCount, setDisplayedCount] = useState<number>(
    PROJECTS_INITIAL_DISPLAY_COUNT,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const availableFilters = useMemo(() => {
    const allTechs = new Set<string>();
    initialProjects.forEach((p) => {
      p.techStack?.forEach((tech) => allTechs.add(tech));
      p.topics?.forEach((topic) => allTechs.add(topic));
    });

    return [
      "All",
      ...popularFilters.filter((filter) =>
        Array.from(allTechs).some(
          (tech) => tech.toLowerCase() === filter.toLowerCase(),
        ),
      ),
    ];
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") {
      return initialProjects;
    }
    return initialProjects.filter(
      (p) =>
        p.techStack?.some(
          (tech) => tech.toLowerCase() === activeFilter.toLowerCase(),
        ) ||
        p.topics?.some(
          (topic) => topic.toLowerCase() === activeFilter.toLowerCase(),
        ),
    );
  }, [initialProjects, activeFilter]);

  const currentDisplayedProjects = useMemo(() => {
    return filteredProjects.slice(0, displayedCount);
  }, [filteredProjects, displayedCount]);

  const handleSetFilter = useCallback(
    (filter: string) => {
      if (filter === activeFilter) return;
      setActiveFilter(filter);
      setDisplayedCount(PROJECTS_INITIAL_DISPLAY_COUNT);
    },
    [activeFilter],
  );

  const handleShowMore = useCallback(() => {
    setDisplayedCount((prev) =>
      Math.min(prev + PROJECTS_INCREMENT, filteredProjects.length),
    );
  }, [filteredProjects.length]);

  const canShowMore = displayedCount < filteredProjects.length;

  if (initialProjects.length === 0) {
    return (
      <section id={id} className={cn("py-20 md:py-28", className)}>
        <div className="container mx-auto px-4">
          <motion.h2
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            variants={shouldReduceMotion ? {} : headingVariants}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-20 text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter"
          >
            Selected <span className="text-primary">Creations</span>
          </motion.h2>
          <p className="text-center text-xl text-muted-foreground">
            No projects to showcase at the moment. Please check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={cn("py-20 md:py-28", className)}
      ref={containerRef}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={shouldReduceMotion ? false : "hidden"}
          animate={
            shouldReduceMotion ? undefined : isInView ? "visible" : "hidden"
          }
          variants={shouldReduceMotion ? {} : headingVariants}
          className="mb-12 text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter"
        >
          Selected <span className="text-primary">Creations</span>
        </motion.h2>

        {/* Improved Filter Container */}
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          animate={
            shouldReduceMotion ? undefined : isInView ? "visible" : "hidden"
          }
          variants={shouldReduceMotion ? {} : filterContainerVariants}
          className="mb-16"
        >
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground font-medium">
              Filter by Technology
            </p>

            {/* Desktop Filter Layout */}
            <div className="hidden md:flex flex-wrap items-center justify-center gap-2 lg:gap-3 max-w-4xl mx-auto">
              {availableFilters.map((filter, index) => (
                <motion.div
                  key={filter}
                  variants={shouldReduceMotion ? {} : filterButtonVariants}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  <Button
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSetFilter(filter)}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:shadow-md",
                      activeFilter === filter
                        ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                        : "bg-background/50 border-border/50 text-muted-foreground hover:bg-background hover:text-foreground hover:border-border backdrop-blur-sm",
                    )}
                  >
                    {filter}
                    {activeFilter === filter && (
                      <motion.div
                        layoutId="activeFilterIndicator"
                        className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Mobile Filter Layout - Horizontal Scroll */}
            <div className="md:hidden w-full">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 pb-2">
                <div className="flex items-center gap-2 min-w-max">
                  {availableFilters.map((filter, index) => (
                    <motion.div
                      key={filter}
                      variants={shouldReduceMotion ? {} : filterButtonVariants}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    >
                      <Button
                        variant={
                          activeFilter === filter ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleSetFilter(filter)}
                        className={cn(
                          "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                          activeFilter === filter
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-background/80 border-border/60 text-muted-foreground hover:bg-background hover:text-foreground backdrop-blur-sm",
                        )}
                      >
                        {filter}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile scroll hint */}
              <div className="flex justify-center mt-2">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span>•</span>
                  <span>Swipe to see more</span>
                  <span>•</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <LayoutGroup>
          <motion.div
            key={`${activeFilter}-${displayedCount}`}
            initial={shouldReduceMotion ? false : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
            variants={shouldReduceMotion ? {} : cardContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 lg:gap-x-10 lg:gap-y-12"
            style={{
              transform: "translateZ(0)",
              willChange: "contents",
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {currentDisplayedProjects.map((project, index) => (
                <motion.div
                  key={project.id || `project-${project.name}-${activeFilter}`}
                  variants={shouldReduceMotion ? {} : cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  layoutId={`project-${project.id || project.name}`}
                  className="h-full"
                  style={{
                    backfaceVisibility: "hidden",
                    perspective: 1000,
                  }}
                >
                  <ProjectCard
                    project={project}
                    data-project-id={String(project.id || project.name)}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {currentDisplayedProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground">
              Try selecting a different filter to see more projects.
            </p>
          </motion.div>
        )}

        {canShowMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <Button
              size="lg"
              onClick={handleShowMore}
              className="min-w-[240px] px-10 py-3.5 text-lg rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              <span>Discover More</span>
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
