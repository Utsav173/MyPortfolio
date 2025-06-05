"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { ProjectCard, type Project } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  Variants,
} from "motion/react";

const PROJECTS_INITIAL_DISPLAY_COUNT = 6;
const PROJECTS_INCREMENT = 4;

const FEATURED_PROJECT_IDS: (number | string)[] = [
  727342843, 657660151, 952619337, 922037774, 904861772, 583853098,
];

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] },
  },
};

const cardContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2, // Delay after heading might be visible
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export function ProjectsSection({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [allProjectsData, setAllProjectsData] = useState<Project[]>([]);
  const [displayedCount, setDisplayedCount] = useState<number>(
    PROJECTS_INITIAL_DISPLAY_COUNT
  );
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingInitial(true);
      try {
        const response = await fetch("/projects-data.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let projects: Project[] = await response.json();

        projects.sort((a, b) => {
          const aFeaturedIndex = FEATURED_PROJECT_IDS.indexOf(a.id);
          const bFeaturedIndex = FEATURED_PROJECT_IDS.indexOf(b.id);

          if (aFeaturedIndex !== -1 && bFeaturedIndex !== -1) {
            return aFeaturedIndex - bFeaturedIndex;
          }
          if (aFeaturedIndex !== -1) return -1;
          if (bFeaturedIndex !== -1) return 1;

          const aHasImage = !!a.imageUrl;
          const bHasImage = !!b.imageUrl;
          if (aHasImage && !bHasImage) return -1;
          if (!aHasImage && bHasImage) return 1;

          if ((b.stargazers_count || 0) !== (a.stargazers_count || 0)) {
            return (b.stargazers_count || 0) - (a.stargazers_count || 0);
          }
          return a.name.localeCompare(b.name);
        });

        setAllProjectsData(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setAllProjectsData([]);
      }
      setIsLoadingInitial(false);
    };
    fetchProjects();
  }, []);

  const currentDisplayedProjects = useMemo(() => {
    return allProjectsData.slice(0, displayedCount);
  }, [allProjectsData, displayedCount]);

  const handleShowMore = () => {
    setDisplayedCount((prev) =>
      Math.min(prev + PROJECTS_INCREMENT, allProjectsData.length)
    );
  };

  const canShowMore = displayedCount < allProjectsData.length;

  if (isLoadingInitial && allProjectsData.length === 0) {
    return (
      <section
        id={id}
        ref={sectionRef}
        className={cn(
          "py-20 md:py-28 min-h-[500px] flex items-center justify-center",
          className
        )}
      >
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="mx-auto size-12 animate-spin text-primary mb-6" />
          <p className="text-lg text-muted-foreground">Curating Projects...</p>
        </div>
      </section>
    );
  }

  if (!isLoadingInitial && allProjectsData.length === 0) {
    return (
      <section
        id={id}
        ref={sectionRef}
        className={cn("py-20 md:py-28", className)}
      >
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
      ref={sectionRef}
      className={cn("py-20 md:py-28", className)}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? {} : headingVariants}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-20 text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter"
        >
          Selected <span className="text-primary">Creations</span>
        </motion.h2>
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? {} : cardContainerVariants}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 lg:gap-x-10 lg:gap-y-12 auto-rows-fr"
        >
          <AnimatePresence initial={false}>
            {currentDisplayedProjects.map((project) => (
              <motion.div
                key={project.id || `project-${project.name}`}
                variants={shouldReduceMotion ? {} : cardVariants}
                initial={shouldReduceMotion ? false : "hidden"}
                animate={shouldReduceMotion ? undefined : "visible"}
                exit={shouldReduceMotion ? undefined : "exit"}
                layout // Enables layout animation for when items are added/removed
                className="h-full" // Ensure motion.div takes up card space
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
        {canShowMore && (
          <div className="mt-16 text-center">
            <Button
              size="lg"
              onClick={handleShowMore}
              className="min-w-[240px] px-10 py-3.5 text-lg rounded-lg"
            >
              Discover More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
