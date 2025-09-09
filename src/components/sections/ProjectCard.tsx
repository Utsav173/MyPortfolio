'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type FC } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { TECH_STACK_DETAILS } from '@/lib/tech-stack-data';
import { useTheme } from 'next-themes';
import { useReducedMotion, motion } from 'motion/react';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  className?: string;
  theme?: string | undefined;
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
  const { theme } = useTheme();
  const techToDisplay = project.techStack.slice(0, 5);
  const hasImage = !!project.imageUrl;

  return (
    <Link href={`/projects/${project.id}`} scroll={false} className="h-full">
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
                    <Icon
                      icon={tech.icon}
                      className="size-3.5"
                      style={{
                        color:
                          theme === 'dark' && tech.darkmodecolor ? tech.darkmodecolor : tech.color,
                      }}
                    />
                    <span>{tech.name}</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};
