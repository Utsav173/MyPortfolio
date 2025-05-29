"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { ProjectCard, type Project } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { getFeaturedProjects, getRemainingPublicProjects } from "@/lib/github";
import { Loader2 } from "lucide-react";
import { animate, stagger } from "animejs";
import { cn } from "@/lib/utils";

const PROJECTS_INITIAL_DISPLAY_COUNT = 8;
const PROJECTS_INCREMENT = 7;

export function ProjectsSection({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const projectCardsContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [featuredProjectsData, setFeaturedProjectsData] = useState<Project[]>(
    []
  );
  const [additionalProjectsData, setAdditionalProjectsData] = useState<
    Project[]
  >([]);

  const [displayedCount, setDisplayedCount] = useState<number>(
    PROJECTS_INITIAL_DISPLAY_COUNT
  );

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasAttemptedFetchRemaining, setHasAttemptedFetchRemaining] =
    useState(false);

  const animatedCards = useRef(new Set<string>());

  const allAvailableProjects = useMemo(() => {
    const combined = [...featuredProjectsData, ...additionalProjectsData];
    const uniqueProjects = Array.from(
      new Map(combined.map((p) => [p.id || p.name, p])).values()
    );
    return uniqueProjects;
  }, [featuredProjectsData, additionalProjectsData]);

  const currentDisplayedProjects = useMemo(() => {
    return allAvailableProjects.slice(0, displayedCount);
  }, [allAvailableProjects, displayedCount]);

  const animateInCards = useCallback((targets: HTMLElement[]) => {
    if (targets.length > 0) {
      targets.forEach((t) => {
        if (t) t.style.opacity = "0";
      });
      animate(
        targets.filter((t) => t),
        {
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.97, 1],
          duration: 500,
          easing: "easeOutExpo",
          delay: stagger(100, { from: "first" }),
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchInitialProjects = async () => {
      setIsLoadingInitial(true);
      try {
        const projects = await getFeaturedProjects();
        setFeaturedProjectsData(projects);
      } catch (error) {
        console.error("Failed to fetch featured projects on client:", error);
        setFeaturedProjectsData([]);
      }
      setIsLoadingInitial(false);
    };
    fetchInitialProjects();
  }, []);

  useEffect(() => {
    const currentHeadingRef = headingRef.current;
    if (
      currentHeadingRef &&
      !animatedCards.current.has("heading") &&
      !isLoadingInitial
    ) {
      currentHeadingRef.style.opacity = "0";
      const headingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              currentHeadingRef &&
              !animatedCards.current.has("heading")
            ) {
              animate(currentHeadingRef, {
                opacity: [0, 1],
                translateY: [20, 0],
                filter: ["blur(2px)", "blur(0px)"],
                duration: 700,
                easing: "easeOutExpo",
              });
              animatedCards.current.add("heading");
              headingObserver.unobserve(currentHeadingRef);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
      );
      headingObserver.observe(currentHeadingRef);
      return () => {
        if (currentHeadingRef) headingObserver.unobserve(currentHeadingRef);
      };
    }
  }, [isLoadingInitial]);

  useEffect(() => {
    const cardElements = Array.from(
      projectCardsContainerRef.current?.children || []
    ) as HTMLElement[];

    const newlyDisplayedCardElements = cardElements.filter((card) => {
      const projectId = card.dataset.projectId;
      const isActuallyDisplayed = currentDisplayedProjects.some(
        (p) => String(p.id || p.name) === projectId
      );
      return (
        projectId &&
        isActuallyDisplayed &&
        !animatedCards.current.has(projectId)
      );
    });

    if (newlyDisplayedCardElements.length > 0) {
      animateInCards(newlyDisplayedCardElements);
      newlyDisplayedCardElements.forEach((card) => {
        if (card.dataset.projectId)
          animatedCards.current.add(card.dataset.projectId);
      });
    }
  }, [animateInCards, currentDisplayedProjects]);

  const handleShowMore = async () => {
    if (isLoadingMore) return;

    if (displayedCount < allAvailableProjects.length) {
      setDisplayedCount((prev) =>
        Math.min(prev + PROJECTS_INCREMENT, allAvailableProjects.length)
      );
    } else if (!hasAttemptedFetchRemaining) {
      setIsLoadingMore(true);
      try {
        const remainingProjectsFromApi = await getRemainingPublicProjects();
        setHasAttemptedFetchRemaining(true);

        const existingProjectIds = new Set(
          allAvailableProjects.map((p) => p.id)
        );
        const newUniqueProjects = remainingProjectsFromApi.filter(
          (rp) => !existingProjectIds.has(rp.id)
        );

        if (newUniqueProjects.length > 0) {
          setAdditionalProjectsData((prev) => [...prev, ...newUniqueProjects]);
          setDisplayedCount((prev) =>
            Math.min(
              prev + PROJECTS_INCREMENT,
              allAvailableProjects.length + newUniqueProjects.length
            )
          );
        }
      } catch (error) {
        console.error("Failed to fetch remaining projects:", error);
        setHasAttemptedFetchRemaining(true);
      }
      setIsLoadingMore(false);
    }
  };

  const canShowMore =
    displayedCount < allAvailableProjects.length ||
    (!hasAttemptedFetchRemaining && !isLoadingInitial);

  if (isLoadingInitial && featuredProjectsData.length === 0) {
    return (
      <section
        id="projects"
        ref={sectionRef}
        className="py-16 md:py-24 min-h-[400px] flex items-center justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="mx-auto size-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading Projects...</p>
        </div>
      </section>
    );
  }

  if (!isLoadingInitial && allAvailableProjects.length === 0) {
    return (
      <section id="projects" ref={sectionRef} className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2
            ref={headingRef}
            className="mb-16 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
          >
            Selected <span className="text-primary">Works</span>
          </h2>
          <p className="text-center text-muted-foreground">
            No public projects found. Check back later!
          </p>
        </div>
      </section>
    );
  }

  const getCardClassName = (index: number): string => {
    const patternIndex = index % 7;
    switch (patternIndex) {
      case 0:
        return "md:col-span-2";
      case 1:
        return "md:col-span-1";
      case 2:
        return "md:col-span-1";
      case 3:
        return "md:col-span-1";
      case 4:
        return "md:col-span-1";
      case 5:
        return "md:col-span-2";
      case 6:
        return "md:col-span-1";
      default:
        return "md:col-span-1";
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={cn(className, "py-16 md:py-24")}
    >
      <div className="container mx-auto px-4">
        <h2
          ref={headingRef}
          className="mb-16 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
        >
          Selected <span className="text-primary">Works</span>
        </h2>
        <div
          ref={projectCardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(280px,_auto)]"
        >
          {currentDisplayedProjects.map((project, index) => (
            <ProjectCard
              key={project.id || `project-${project.name}-${index}`}
              project={project}
              data-project-id={String(
                project.id || `project-${project.name}-${index}`
              )}
              className={cn("min-h-[280px]", getCardClassName(index))}
            />
          ))}
        </div>
        {canShowMore && (
          <div className="mt-12 text-center">
            <Button
              size="lg"
              onClick={handleShowMore}
              disabled={isLoadingMore}
              className="min-w-[220px] px-8 py-3 text-base"
            >
              {isLoadingMore ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : (
                "Show More Projects"
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
