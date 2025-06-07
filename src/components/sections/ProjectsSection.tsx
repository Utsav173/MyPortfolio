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

const indicatorVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
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

interface IndicatorStyle {
  left: number;
  width: number;
  opacity: number;
}

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
    PROJECTS_INITIAL_DISPLAY_COUNT
  );

  const filterButtonsRef = useRef<Map<string, HTMLButtonElement | null>>(
    new Map()
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
    opacity: 0,
  });

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
          (tech) => tech.toLowerCase() === filter.toLowerCase()
        )
      ),
    ];
  }, [initialProjects]);

  const updateIndicator = useCallback(() => {
    const activeButton = filterButtonsRef.current.get(activeFilter);

    if (activeButton) {
      requestAnimationFrame(() => {
        setIndicatorStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
          opacity: 1,
        });
      });
    }
  }, [activeFilter]);

  useEffect(() => {
    updateIndicator();

    const handleResize = () => updateIndicator();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicator]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") {
      return initialProjects;
    }
    return initialProjects.filter(
      (p) =>
        p.techStack?.some(
          (tech) => tech.toLowerCase() === activeFilter.toLowerCase()
        ) ||
        p.topics?.some(
          (topic) => topic.toLowerCase() === activeFilter.toLowerCase()
        )
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
    [activeFilter]
  );

  const handleShowMore = useCallback(() => {
    setDisplayedCount((prev) =>
      Math.min(prev + PROJECTS_INCREMENT, filteredProjects.length)
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

        <div
          role="group"
          aria-label="Project technology filters"
          className="relative mb-16 flex flex-wrap items-center justify-center gap-2 md:gap-3 p-1"
        >
          {!shouldReduceMotion && (
            <motion.div
              className="absolute h-full bg-primary/10 dark:bg-primary/20 rounded-full"
              initial="initial"
              animate="animate"
              variants={indicatorVariants}
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
              }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
                layout: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
              }}
            />
          )}
          {availableFilters.map((filter) => (
            <Button
              key={filter}
              ref={(el) => {
                filterButtonsRef.current.set(filter, el);
                return undefined;
              }}
              variant="ghost"
              size="sm"
              onClick={() => handleSetFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={cn(
                "relative rounded-full px-4 text-sm transition-colors duration-200 py-0.5",
                activeFilter === filter
                  ? "text-primary-foreground dark:text-primary z-10"
                  : "text-muted-foreground hover:text-primary"
              )}
              style={{
                willChange: activeFilter === filter ? "auto" : "color",
              }}
            >
              {filter}
            </Button>
          ))}
        </div>

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
            className="mt-12 text-center text-muted-foreground"
          >
            No projects found for the "{activeFilter}" filter.
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
              className="min-w-[240px] px-10 py-3.5 text-lg rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Discover More
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
