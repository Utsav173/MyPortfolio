'use client';

import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  unstable_ViewTransition as ViewTransition,
} from 'react';
import { ProjectCard, type Project } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion, Variants, useInView } from 'framer-motion';
import { Search } from 'lucide-react';
import { useTheme } from 'next-themes';

const PROJECTS_INITIAL_DISPLAY_COUNT = 6;
const PROJECTS_INCREMENT = 3;

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const popularFilters = ['Next.js', 'React', 'AI', 'Three.js', 'Hono.js', 'TypeScript', 'Fintech'];

interface ProjectsSectionProps {
  className?: string;
  id?: string;
  initialProjects: Project[];
}

export function ProjectsSection({ className, id, initialProjects }: ProjectsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [displayedCount, setDisplayedCount] = useState<number>(PROJECTS_INITIAL_DISPLAY_COUNT);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const availableFilters = useMemo(() => {
    const allTechs = new Set<string>();
    initialProjects.forEach((p) => p.techStack?.forEach((tech) => allTechs.add(tech)));
    return ['All', ...popularFilters.filter((filter) => allTechs.has(filter))];
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return initialProjects;
    return initialProjects.filter((p) =>
      p.techStack?.some((tech) => tech.toLowerCase() === activeFilter.toLowerCase())
    );
  }, [initialProjects, activeFilter]);

  const currentDisplayedProjects = useMemo(
    () => filteredProjects.slice(0, displayedCount),
    [filteredProjects, displayedCount]
  );

  const handleSetFilter = useCallback((filter: string) => {
    setActiveFilter(filter);
    setDisplayedCount(PROJECTS_INITIAL_DISPLAY_COUNT);
  }, []);

  const handleShowMore = useCallback(() => {
    setDisplayedCount((prev) => Math.min(prev + PROJECTS_INCREMENT, filteredProjects.length));
  }, [filteredProjects.length]);

  const canShowMore = displayedCount < filteredProjects.length;

  return (
    <section id={id} className={cn('py-20 md:py-28', className)} ref={containerRef}>
      <div className="container mx-auto px-4">
        <motion.h2
          variants={shouldReduceMotion ? {} : headingVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-12 text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter"
        >
          Selected <span className="text-primary">Creations</span>
        </motion.h2>

        <div className="mb-16">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3 max-w-4xl mx-auto">
            {availableFilters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSetFilter(filter)}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
                  activeFilter === filter
                    ? 'shadow-lg'
                    : 'bg-background/50 border-border/50 text-muted-foreground hover:bg-background hover:text-foreground'
                )}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
        <ViewTransition name="project-cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentDisplayedProjects.map((project) => (
              <ViewTransition key={project.id} name={`project-card-${project.id}`}>
                <ProjectCard key={project.id} project={project} theme={resolvedTheme} />
              </ViewTransition>
            ))}
          </div>
        </ViewTransition>

        {!currentDisplayedProjects.length && (
          <div className="mt-16 text-center flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              Try selecting a different filter to see what I've built.
            </p>
          </div>
        )}

        {canShowMore && (
          <div className="mt-16 text-center">
            <Button size="lg" onClick={handleShowMore} className="min-w-[200px]">
              Discover More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
