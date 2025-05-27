'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ProjectCard, type Project } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { getRemainingPublicProjects } from '@/lib/github';
import { Loader2 } from 'lucide-react';
import { animate, stagger } from 'animejs';
import { cn } from '@/lib/utils';

interface ProjectsSectionProps {
  projects: Project[];
}

const PROJECTS_INITIAL_DISPLAY_COUNT = 7; // To show one full pattern cycle
const PROJECTS_INCREMENT = 6; // How many to load on "Show More"

export function ProjectsSection({
  projects: initialProjects,
}: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const projectCardsContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [allLoadedProjects, setAllLoadedProjects] =
    useState<Project[]>(initialProjects);
  const [displayedProjectsCount, setDisplayedProjectsCount] = useState<number>(
    Math.min(initialProjects.length, PROJECTS_INITIAL_DISPLAY_COUNT)
  );

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allRemainingFetchedFromApi, setAllRemainingFetchedFromApi] = useState(
    initialProjects.length < PROJECTS_INITIAL_DISPLAY_COUNT &&
      initialProjects.length > 0
      ? true
      : initialProjects.length === 0
  );

  const animatedCards = useRef(new Set<string>());

  const animateInCards = useCallback((targets: HTMLElement[]) => {
    if (targets.length > 0) {
      targets.forEach((t) => {
        if (t) t.style.opacity = '0';
      });
      animate(
        targets.filter((t) => t),
        {
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.97, 1],
          duration: 500,
          easing: 'easeOutExpo',
          delay: stagger(100, { from: 'first' }),
        }
      );
    }
  }, []);

  useEffect(() => {
    const currentHeadingRef = headingRef.current;
    if (currentHeadingRef && !animatedCards.current.has('heading')) {
      currentHeadingRef.style.opacity = '0';
      const headingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              currentHeadingRef &&
              !animatedCards.current.has('heading')
            ) {
              animate(currentHeadingRef, {
                opacity: [0, 1],
                translateY: [20, 0],
                filter: ['blur(2px)', 'blur(0px)'],
                duration: 700,
                easing: 'easeOutExpo',
              });
              animatedCards.current.add('heading');
              headingObserver.unobserve(currentHeadingRef);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
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
        const existingProjectIds = new Set(allLoadedProjects.map((p) => p.id));
        const newUniqueProjects = remainingProjectsFromApi.filter(
          (rp) => !existingProjectIds.has(rp.id)
        );
        if (newUniqueProjects.length > 0) {
          currentTotalProjects = [...allLoadedProjects, ...newUniqueProjects];
          setAllLoadedProjects(currentTotalProjects);
        }
        setAllRemainingFetchedFromApi(true);
      } catch (error) {
        console.error('Failed to fetch remaining projects:', error);
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
    displayedProjectsCount < allLoadedProjects.length ||
    !allRemainingFetchedFromApi;

  if (
    !currentDisplayedProjects ||
    (currentDisplayedProjects.length === 0 && !canShowMore && !isLoadingMore)
  ) {
    return (
      <section id="projects" ref={sectionRef} className="py-16 md:py-24">
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

  const getCardClassName = (index: number): string => {
    const patternIndex = index % 7;
    switch (patternIndex) {
      case 0:
        return 'md:col-span-2 md:row-span-2';
      case 1:
        return 'md:col-span-1 md:row-span-1';
      case 2:
        return 'md:col-span-1 md:row-span-1';
      case 3:
        return 'md:col-span-1 md:row-span-1';
      case 4:
        return 'md:col-span-1 md:row-span-1';
      case 5:
        return 'md:col-span-1 md:row-span-1';
      case 6:
        return 'md:col-span-3 md:row-span-1';
      default:
        return 'md:col-span-1 md:row-span-1';
    }
  };

  return (
    <section id="projects" ref={sectionRef} className="py-16 md:py-24">
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
              className={cn('min-h-[280px]', getCardClassName(index))}
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
                'Show More Projects'
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
