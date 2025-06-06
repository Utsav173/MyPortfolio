import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Star } from "lucide-react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { TECH_STACK_DETAILS } from "@/lib/tech-stack-data";

export interface Project {
  id: number | string;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count?: number;
  forks_count?: number;
  language: string | null;
  topics: string[];
  imageUrl?: string;
  techStack?: string[];
  owner?: string;
  full_name?: string;
}

interface ProjectCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  project: Project;
}

const getTechDetails = (techName: string) => {
  return (
    TECH_STACK_DETAILS[techName.toLowerCase()] || {
      icon: "lucide:code",
      color: "var(--color-muted-foreground)",
      name: techName,
    }
  );
};

export const ProjectCard: FC<ProjectCardProps> = ({
  project,
  className,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const techToDisplay = (
    project.techStack?.length
      ? project.techStack
      : project.language
      ? [project.language, ...project.topics.slice(0, 4)]
      : project.topics
  ).slice(0, 6);

  const displayDescription =
    project.description ||
    "A project exploring modern web development concepts.";
  const projectLink = project.homepage || project.html_url;

  return (
    <motion.div
      className={cn("h-full", className)}
      initial={shouldReduceMotion ? false : { y: 0 }}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -6,
              transition: { type: "spring", stiffness: 350, damping: 20 },
            }
      }
      {...props}
    >
      <Card
        className={cn(
          "group/card relative flex h-full flex-col overflow-hidden rounded-xl",
          "border border-border/50 bg-card/90 shadow-md dark:border-border/60 dark:bg-card/95 dark:shadow-md",
          "transition-all duration-300 ease-in-out",
          "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 dark:hover:border-primary/50 dark:hover:shadow-xl dark:hover:shadow-primary/20",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          !project.imageUrl && "h-fit"
        )}
      >
        {project.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden border-b border-border/50">
            <Image
              src={project.imageUrl}
              alt={`Screenshot of ${project.name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <CardContent className="relative z-10 flex flex-grow flex-col gap-4 p-5">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl font-semibold leading-tight text-foreground/90 transition-colors duration-200 group-hover/card:text-primary">
              <Link
                href={projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="focus:outline-none"
              >
                <span
                  className="absolute inset-0 top-0 left-0 rounded-lg"
                  aria-hidden="true"
                />
                {project.name}
              </Link>
            </CardTitle>
            {(project.stargazers_count ?? 0) > 0 && (
              <span className="flex shrink-0 items-center gap-1 pt-1 text-sm text-muted-foreground transition-colors duration-200 group-hover/card:text-amber-500">
                <Star className="size-4 group-hover/card:fill-amber-400" />
                {project.stargazers_count}
              </span>
            )}
          </div>

          <CardDescription className="flex-grow text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {displayDescription}
          </CardDescription>

          {techToDisplay.length > 0 && (
            <div className="mt-auto pt-3">
              <div className="flex min-h-[2.25rem] flex-wrap items-center gap-2">
                {techToDisplay.map((techName) => {
                  const tech = getTechDetails(techName);
                  return (
                    <Badge
                      key={tech.name}
                      variant="outline"
                      className={cn(
                        "flex cursor-default items-center gap-1.5 rounded-md border-border/60 bg-secondary/70 px-2 py-1 text-xs font-medium text-muted-foreground"
                      )}
                    >
                      <Icon
                        icon={tech.icon}
                        className={cn("size-3.5", {
                          "dark:invert": tech.name === "Vercel",
                        })}
                        style={{ color: tech.color }}
                      />
                      <span>{tech.name}</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter
          className={cn(
            "relative z-10 flex items-center justify-end gap-2 border-t p-4",
            "border-border/50"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="group/button h-9 rounded-md px-3 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-primary"
          >
            <Link
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-1.5 size-4 transition-transform duration-200 group-hover/button:scale-110" />
              Source
            </Link>
          </Button>
          {project.homepage && (
            <Button
              size="sm"
              asChild
              className="group/button h-9 rounded-md px-3 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Link
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-1.5 size-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
                Demo
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
