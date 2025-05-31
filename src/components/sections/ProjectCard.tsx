import Link from "next/link";
import {
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Star, GitFork, PackagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef, useState, HTMLAttributes } from "react";

export interface Project {
  id: number | string;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count?: number;
  forks_count?: number;
  language: string | null;
  languages_url?: string;
  topics: string[];
  imageUrl?: string;
  techStack?: string[];
  className?: string;
}

interface ProjectCardProps extends HTMLAttributes<HTMLDivElement> {
  project: Project;
}

export function ProjectCard({
  project,
  className,
  ...props
}: ProjectCardProps) {
  const displayDescription =
    project.description ||
    "A personal project exploring web development concepts and technologies.";

  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightStyle, setSpotlightStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlightStyle({
      "--mouse-x": `${x}px`,
      "--mouse-y": `${y}px`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setSpotlightStyle({ opacity: 0 });
  };

  const primaryLanguage = project.language;
  const techToDisplay =
    project.techStack && project.techStack.length > 0
      ? project.techStack
      : primaryLanguage
      ? [primaryLanguage]
      : project.topics.slice(0, 1);

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex flex-col h-full overflow-hidden rounded-xl border bg-card shadow-md",
        "transition-shadow duration-300 ease-in-out hover:shadow-primary/20",
        "focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 focus-within:ring-offset-background",
        className
      )}
      style={{ ...props.style } as React.CSSProperties}
      {...props}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "SoftwareApplication",
            name: project.name,
            description: displayDescription,
            url: project.homepage || project.html_url,
            image: project.imageUrl || "/images/default-project-image.png",
            operatingSystem: "Web",
            applicationCategory: "WebApplication",
            programmingLanguage: primaryLanguage || "JavaScript",
            keywords: project.topics.join(", ") || techToDisplay.join(", "),
          }),
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={
          {
            ...spotlightStyle,
            background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(var(--primary-oklch-values-raw, 0.58 0.23 225), 0.15), transparent 80%)`,
          } as React.CSSProperties
        }
      />

      <CardContent className="p-5 flex-grow flex flex-col gap-3 relative z-[1]">
        <div className="flex justify-between items-start">
          <PackagePlus size={36} className="text-primary/70 mb-2 shrink-0" />
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            {typeof project.stargazers_count === "number" &&
              project.stargazers_count > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-yellow-400 text-yellow-500" />
                  {project.stargazers_count}
                </span>
              )}
            {typeof project.forks_count === "number" &&
              project.forks_count > 0 && (
                <span className="flex items-center gap-1">
                  <GitFork className="size-3.5" />
                  {project.forks_count}
                </span>
              )}
          </div>
        </div>
        <CardTitle className="text-lg lg:text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-200">
          <Link
            href={project.homepage || project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none"
          >
            <span className="absolute inset-0" aria-hidden="true" />
            {project.name}
          </Link>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-grow min-h-[3.9em]">
          {displayDescription}
        </CardDescription>
        <div className="mt-auto pt-2">
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">
            Tech Stack:
          </p>
          <div className="flex flex-wrap gap-1.5 min-h-[1.5em]">
            {techToDisplay.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-[0.7rem] px-2 py-0.5 font-medium border-primary/30 text-primary/90 bg-primary/5 group-hover:bg-primary/15 transition-colors duration-200"
              >
                {tech}
              </Badge>
            ))}
            {techToDisplay.length > 4 && (
              <Badge
                variant="secondary"
                className="text-[0.7rem] px-1.5 py-0.5 font-medium group-hover:bg-muted/70 transition-colors duration-200"
              >
                + {techToDisplay.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-2 flex items-center justify-end gap-2 border-t mt-auto relative z-[1]">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-primary hover:bg-accent/50 dark:hover:bg-accent/10 px-2.5 py-1.5 text-xs group-hover:border-primary/20 transition-colors"
        >
          <Link
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View source code for ${project.name} on GitHub`}
          >
            <Github className="mr-1.5 size-3.5" /> GitHub
          </Link>
        </Button>
        {project.homepage && (
          <Button
            variant="default"
            size="sm"
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 text-xs shadow hover:shadow-md transition-all group-hover:scale-[1.02]"
          >
            <Link
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View live demo for ${project.name}`}
            >
              <ExternalLink className="mr-1.5 size-3.5" /> Demo
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
