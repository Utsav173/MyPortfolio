"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import anime from "animejs/lib/anime.es.js";
import { ProjectCard, type Project } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { getRemainingPublicProjects } from "@/lib/github";
import { Loader2 } from "lucide-react";

interface ProjectsSectionProps {
  projects: Project[];
}

const PROJECTS_INCREMENT = 6;

export function ProjectsSection({
  projects: initialProjects,
}: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const projectCardsContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [allLoadedProjects, setAllLoadedProjects] =
    useState<Project[]>(initialProjects);
  const [displayedProjectsCount, setDisplayedProjectsCount] = useState<number>(
    Math.min(initialProjects.length, PROJECTS_INCREMENT)
  );

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allRemainingFetchedFromApi, setAllRemainingFetchedFromApi] = useState(
    initialProjects.length === 0
  );

  const animatedCards = useRef(new Set<string>());

  const animateInCards = useCallback((targets: HTMLElement[]) => {
    if (targets.length > 0) {
      targets.forEach((t) => {
        if (t) t.style.opacity = "0";
      });
      anime({
        targets: targets.filter((t) => t),
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.97, 1],
        duration: 500,
        easing: "easeOutExpo",
        delay: anime.stagger(100, { from: "first" }),
      });
    }
  }, []);

  useEffect(() => {
    const currentHeadingRef = headingRef.current;
    if (currentHeadingRef && !animatedCards.current.has("heading")) {
      currentHeadingRef.style.opacity = "0";
      const headingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              currentHeadingRef &&
              !animatedCards.current.has("heading")
            ) {
              anime({
                targets: currentHeadingRef,
                opacity: [0, 1],
                translateY: [20, 0],
                filter: ["blur(2px)", "blur(0px)"],
                duration: 700,
                easing: "easeOutExpo",
              });
              animatedCards.current.add("heading");
              headingObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
      );
      headingObserver.observe(currentHeadingRef);
    }

    const cardElements = Array.from(
      projectCardsContainerRef.current?.children || []
    ) as HTMLElement[];
    const newlyDisplayedCardElements = cardElements.filter((card) => {
      const projectId = card.dataset.projectId;
      return projectId && !animatedCards.current.has(projectId);
    });

    if (newlyDisplayedCardElements.length > 0) {
      animateInCards(newlyDisplayedCardElements);
      newlyDisplayedCardElements.forEach((card) =>
        animatedCards.current.add(card.dataset.projectId!)
      );
    }
  }, [animateInCards, displayedProjectsCount, allLoadedProjects]);

  const handleShowMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    let currentTotalProjects = allLoadedProjects;

    if (!allRemainingFetchedFromApi) {
      try {
        const remainingProjectsFromApi = await getRemainingPublicProjects();
        const initialProjectIds = new Set(initialProjects.map((p) => p.id));
        const newUniqueProjects = remainingProjectsFromApi.filter(
          (rp) =>
            !initialProjectIds.has(rp.id) &&
            !allLoadedProjects.some((ap) => ap.id === rp.id)
        );

        if (newUniqueProjects.length > 0) {
          currentTotalProjects = [...allLoadedProjects, ...newUniqueProjects];
          setAllLoadedProjects(currentTotalProjects);
        }
        setAllRemainingFetchedFromApi(true);
      } catch (error) {
        console.error("Failed to fetch remaining projects:", error);
        setIsLoadingMore(false);
        return;
      }
    }

    setDisplayedProjectsCount((prevCount) => {
      const newCount = Math.min(
        prevCount + PROJECTS_INCREMENT,
        currentTotalProjects.length
      );
      return newCount;
    });

    setIsLoadingMore(false);
  };

  const currentDisplayedProjects = allLoadedProjects.slice(
    0,
    displayedProjectsCount
  );
  const canShowMore =
    !allRemainingFetchedFromApi ||
    displayedProjectsCount < allLoadedProjects.length;

  if (
    !initialProjects ||
    (initialProjects.length === 0 && !canShowMore && !isLoadingMore)
  ) {
    return (
      <section id="projects" ref={sectionRef}>
        <div className="container mx-auto px-4">
          <h2
            ref={headingRef}
            className="mb-16 text-center text-3xl sm:text-4xl font-bold tracking-tighter"
          >
            Selected <span className="text-primary">Works</span>
          </h2>
          <p className="text-center text-muted-foreground">
            No public projects found or still loading.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2
          ref={headingRef}
          className="mb-16 text-center text-3xl sm:text-4xl font-bold tracking-tighter"
        >
          Selected <span className="text-primary">Works</span>
        </h2>
        <div
          ref={projectCardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {" "}
          {/* Adjusted gap */}
          {currentDisplayedProjects.map((project) => (
            <div
              key={project.id || `project-${project.name}`}
              data-project-id={String(project.id || `project-${project.name}`)}
            >
              <ProjectCard project={project} />
            </div>
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
