'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, ArrowLeft } from 'lucide-react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { TECH_STACK_DETAILS } from '@/lib/tech-stack-data';
import { useTheme } from 'next-themes';
import { Project } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ProjectDetailProps {
  project: Project;
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

export const ProjectDetail: FC<ProjectDetailProps> = ({ project }) => {
  const { theme } = useTheme();
  const hasImage = !!project.imageUrl;
  const router = useRouter();

  return (
    <div
      className={cn(
        'p-0 w-full flex flex-col',
        'bg-background border-none shadow-2xl',
        'dark:bg-background dark:border-border',
        'overflow-hidden rounded-lg'
      )}
    >
      <div className="p-4 flex items-center border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          aria-label="Go back to projects"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      <div className={cn('flex-grow flex flex-col w-full overflow-hidden', 'lg:flex-row')}>
        {hasImage && (
          <div
            className={cn(
              'relative w-full flex-shrink-0 overflow-hidden',
              'h-48 sm:h-64 md:h-72',
              'lg:w-1/2 lg:h-auto'
            )}
          >
            <Image
              src={project.imageUrl!}
              alt={`Screenshot of the ${project.name} project`}
              fill
              className={cn('object-cover transition-all duration-300', 'dark:brightness-90')}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent lg:hidden" />
          </div>
        )}
        <ScrollArea className={cn('flex-grow', 'h-full overflow-y-auto')}>
          <div className={cn('space-y-4', 'p-4 sm:p-6 lg:p-8')}>
            <div className="text-left space-y-2">
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
              <h1
                className={cn(
                  'font-bold leading-tight',
                  'text-2xl sm:text-3xl lg:text-4xl',
                  'text-foreground dark:text-foreground'
                )}
              >
                {project.name}
              </h1>
              <h3
                className={cn(
                  'leading-relaxed',
                  'text-sm sm:text-base',
                  'text-muted-foreground dark:text-muted-foreground/90'
                )}
              >
                {project.description}
              </h3>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <div>
                <h4
                  className={cn(
                    'font-semibold mb-3',
                    'text-base sm:text-lg',
                    'text-foreground dark:text-foreground'
                  )}
                >
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {project.keyFeatures.map((feature, i) => (
                    <li
                      key={i}
                      className={cn(
                        'flex items-start gap-3',
                        'text-sm',
                        'text-muted-foreground dark:text-muted-foreground/90'
                      )}
                    >
                      <CheckCircle
                        className={cn(
                          'mt-0.5 shrink-0',
                          'size-4',
                          'text-primary dark:text-primary'
                        )}
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4
                  className={cn(
                    'font-semibold mb-3',
                    'text-base sm:text-lg',
                    'text-foreground dark:text-foreground'
                  )}
                >
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
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
                          aria-hidden="true"
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

      <div
        className={cn(
          'flex-shrink-0 flex gap-3 border-t',
          'p-4 sm:p-6',
          'flex-col sm:flex-row',
          'bg-background/95 backdrop-blur-sm',
          'border-border/50 dark:border-border/30',
          'dark:bg-background/90'
        )}
      >
        {project.repoUrl ? (
          <Button
            asChild
            className={cn(
              'flex-1 min-h-10',
              'shadow-sm group',
              'bg-black text-white hover:bg-black/90',
              'dark:bg-white dark:text-black dark:hover:bg-white/90'
            )}
          >
            <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Icon
                icon={'simple-icons:github'}
                color={theme === 'dark' ? 'black' : 'white'}
                className="mr-2 size-4"
                aria-hidden="true"
              />
              <span className="text-sm">Source Code</span>
            </Link>
          </Button>
        ) : (
          <Badge
            variant="outline"
            className={cn(
              'flex-1 min-h-10 justify-center',
              'text-sm',
              'bg-muted text-muted-foreground',
              'border border-border/50 dark:border-border/30',
              'shadow-sm',
              'flex items-center gap-1.5'
            )}
          >
            <Icon icon={'lucide:lock'} className="size-4" aria-hidden="true" />
            <span>Private Project</span>
          </Badge>
        )}
        {project.liveUrl && (
          <Button
            asChild
            variant="secondary"
            className={cn(
              'flex-1 min-h-10',
              'bg-secondary text-secondary-foreground',
              'hover:bg-secondary/80 dark:hover:bg-secondary/70',
              'border border-border/50 dark:border-border/30',
              'shadow-sm'
            )}
          >
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 size-4" aria-hidden="true" />
              <span className="text-sm">Live Demo</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
