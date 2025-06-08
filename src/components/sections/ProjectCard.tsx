'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type FC, unstable_ViewTransition as ViewTransition } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, CheckCircle } from 'lucide-react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { TECH_STACK_DETAILS } from '@/lib/tech-stack-data';

export interface Project {
  id: number | string;
  name: string;
  description: string;
  repoUrl: string;
  liveUrl?: string | null;
  imageUrl?: string;
  projectType: string;
  techStack: string[];
  keyFeatures: string[];
  githubStats: {
    stars: number;
    forks: number;
  };
}

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const getTechDetails = (techName: string) => {
  return (
    TECH_STACK_DETAILS[techName.toLowerCase()] || {
      icon: 'lucide:code',
      color: 'hsl(var(--muted-foreground))',
      name: techName,
    }
  );
};

export const ProjectCard: FC<ProjectCardProps> = ({ project, className }) => {
  const shouldReduceMotion = useReducedMotion();

  const techToDisplay = project.techStack.slice(0, 5);
  const hasImage = !!project.imageUrl;

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <motion.div
          whileHover={
            shouldReduceMotion
              ? {}
              : { y: -6, transition: { type: 'spring', stiffness: 350, damping: 20 } }
          }
          className={cn('h-full', className)}
        >
          <Card
            className={cn(
              'group/card relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl',
              'border border-border/50 bg-card/90 shadow-md transition-all duration-300',
              'hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10'
            )}
          >
            {hasImage && (
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/50">
                <Image
                  src={project.imageUrl!}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
              </div>
            )}
            <div className="flex flex-col flex-grow p-5 gap-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-semibold leading-tight text-foreground transition-colors group-hover/card:text-primary">
                  {project.name}
                </CardTitle>
                {project.githubStats.stars > 0 && (
                  <span className="flex shrink-0 items-center gap-1 pt-1 text-sm text-muted-foreground transition-colors group-hover/card:text-amber-500">
                    <Star className="size-4 group-hover/card:fill-amber-400" />
                    {project.githubStats.stars}
                  </span>
                )}
              </div>
              <CardDescription className="flex-grow text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {project.description}
              </CardDescription>
              <div className="mt-auto flex min-h-[2.25rem] flex-wrap items-center gap-2">
                {techToDisplay.map((techName) => {
                  const tech = getTechDetails(techName);
                  return (
                    <Badge
                      key={tech.name}
                      variant="outline"
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs "
                    >
                      <Icon icon={tech.icon} className="size-3.5" style={{ color: tech.color }} />
                      <span>{tech.name}</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>
      </DialogTrigger>

      <DialogContent
        className={cn(
          'p-0 w-[98vw] max-w-sm h-fit max-h-[95vh] flex flex-col',
          'sm:w-[92vw] sm:max-w-2xl ',
          'lg:w-[85vw] lg:max-w-4xl ',
          'xl:max-w-5xl',
          'bg-background border-none shadow-2xl',
          'dark:bg-background dark:border-border',
          'overflow-hidden'
        )}
      >
        <div
          className={cn('flex-grow flex flex-col w-full overflow-hidden max-h-fit', 'lg:flex-row')}
        >
          {hasImage && (
            <div
              className={cn(
                'relative w-full flex-shrink-0 overflow-hidden',
                'h-32 xs:h-40 sm:h-48',
                'lg:w-1/2 lg:h-auto'
              )}
            >
              <Image
                src={project.imageUrl!}
                alt={project.name}
                fill
                className={cn('object-cover transition-all duration-300', 'dark:brightness-90')}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent lg:hidden" />
            </div>
          )}
          <ScrollArea className={cn('flex-grow', 'h-full overflow-y-auto')}>
            <div className={cn('space-y-3', 'p-3 xs:p-4 sm:p-5 lg:p-6 xl:p-8')}>
              <DialogHeader className="text-left space-y-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    'w-fit text-xs',
                    'bg-secondary/80 text-secondary-foreground',
                    'dark:bg-secondary/60 dark:text-secondary-foreground'
                  )}
                >
                  {project.projectType}
                </Badge>
                <DialogTitle
                  className={cn(
                    'font-bold leading-tight',
                    'text-lg xs:text-xl sm:text-2xl lg:text-3xl',
                    'text-foreground dark:text-foreground'
                  )}
                >
                  {project.name}
                </DialogTitle>
                <DialogDescription
                  className={cn(
                    'leading-relaxed',

                    'text-xs xs:text-sm sm:text-base',
                    'text-muted-foreground dark:text-muted-foreground/90'
                  )}
                >
                  {project.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <h4
                    className={cn(
                      'font-semibold mb-2 sm:mb-3',
                      'text-sm sm:text-base',
                      'text-foreground dark:text-foreground'
                    )}
                  >
                    Key Features
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {project.keyFeatures.map((feature, i) => (
                      <li
                        key={i}
                        className={cn(
                          'flex items-start gap-2 sm:gap-3',
                          'text-xs sm:text-sm',
                          'text-muted-foreground dark:text-muted-foreground/90'
                        )}
                      >
                        <CheckCircle
                          className={cn(
                            'mt-0.5 shrink-0',
                            'size-3 sm:size-4',
                            'text-primary dark:text-primary'
                          )}
                        />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4
                    className={cn(
                      'font-semibold mb-2 sm:mb-3',
                      'text-sm sm:text-base',
                      'text-foreground dark:text-foreground'
                    )}
                  >
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {project.techStack.map((techName) => {
                      const tech = getTechDetails(techName);
                      return (
                        <Badge
                          key={tech.name}
                          variant="none"
                          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs"
                        >
                          <Icon
                            icon={tech.icon}
                            className="size-3.5"
                            style={{ color: tech.color }}
                          />
                          <span>{tech.name}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Action buttons footer */}
        <div
          className={cn(
            'flex-shrink-0 flex gap-2 sm:gap-3 border-t',
            'p-3 xs:p-4 sm:p-5 lg:p-6',
            'flex-col xs:flex-row',
            'bg-background/95 backdrop-blur-sm',
            'border-border/50 dark:border-border/30',
            'dark:bg-background/90'
          )}
        >
          <Button
            asChild
            className={cn(
              'flex-1 min-h-9 sm:min-h-10',
              'bg-primary text-white hover:bg-slate-900',
              'shadow-sm bg-black group'
            )}
          >
            <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Icon
                icon={'simple-icons:github'}
                color="white"
                className="mr-2 size-3.5 sm:size-4"
              />
              <span className="text-xs sm:text-sm">Source Code</span>
            </Link>
          </Button>
          {project.liveUrl && (
            <Button
              asChild
              variant="secondary"
              className={cn(
                'flex-1 min-h-9 sm:min-h-10',
                'bg-secondary text-secondary-foreground',
                'hover:bg-secondary/80 dark:hover:bg-secondary/70',
                'border border-border/50 dark:border-border/30',
                'shadow-sm'
              )}
            >
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 size-3.5 sm:size-4" />
                <span className="text-xs sm:text-sm">Live Demo</span>
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
