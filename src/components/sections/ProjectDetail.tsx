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
        'p-0 w-[98vw] max-w-sm h-fit max-h-[95vh] flex flex-col',
        'sm:w-[92vw] sm:max-w-2xl ',
        'lg:w-[85vw] lg:max-w-4xl ',
        'xl:max-w-5xl',
        'bg-background border-none shadow-2xl',
        'dark:bg-background dark:border-border',
        'overflow-hidden'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="absolute top-2 left-2 z-10"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
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
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent lg:hidden" />
          </div>
        )}
        <ScrollArea className={cn('flex-grow', 'h-full overflow-y-auto')}>
          <div className={cn('space-y-3', 'p-3 xs:p-4 sm:p-5 lg:p-6 xl:p-8')}>
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
                  'text-lg xs:text-xl sm:text-2xl lg:text-3xl',
                  'text-foreground dark:text-foreground'
                )}
              >
                {project.name}
              </h1>
              <h3
                className={cn(
                  'leading-relaxed',
                  'text-xs xs:text-sm sm:text-base',
                  'text-muted-foreground dark:text-muted-foreground/90'
                )}
              >
                {project.description}
              </h3>
            </div>

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
                        <Icon icon={tech.icon} className="size-3.5" style={{ color: tech.color }} />
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
          'flex-shrink-0 flex gap-2 sm:gap-3 border-t',
          'p-3 xs:p-4 sm:p-5 lg:p-6',
          'flex-col xs:flex-row',
          'bg-background/95 backdrop-blur-sm',
          'border-border/50 dark:border-border/30',
          'dark:bg-background/90'
        )}
      >
        {project.repoUrl ? (
          <Button
            asChild
            className={cn(
              'flex-1 min-h-9 sm:min-h-10',
              'shadow-sm group',
              'bg-black text-white hover:bg-black/90',
              'dark:bg-white dark:text-black dark:hover:bg-white/90'
            )}
          >
            <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Icon
                icon={'simple-icons:github'}
                color={theme === 'dark' ? 'black' : 'white'}
                className="mr-2 size-3.5 sm:size-4"
              />
              <span className="text-xs sm:text-sm">Source Code</span>
            </Link>
          </Button>
        ) : (
          <Badge
            variant="outline"
            className={cn(
              'flex-1 min-h-9 sm:min-h-10 justify-center',
              'text-xs sm:text-sm',
              'bg-muted text-muted-foreground',
              'border border-border/50 dark:border-border/30',
              'shadow-sm',
              'flex items-center gap-1.5'
            )}
          >
            <Icon icon={'lucide:lock'} className="size-3.5 sm:size-4" />
            <span>Private Project (Contact for source code)</span>
          </Badge>
        )}
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
    </div>
  );
};

export default ProjectDetail;
