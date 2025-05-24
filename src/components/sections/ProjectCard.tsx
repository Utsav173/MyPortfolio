import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Star, GitFork, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const displayDescription =
    project.description ||
    "A personal project exploring web development concepts and technologies.";

  const hasImage = !!project.imageUrl;

  return (
    <Card
      className={cn(
        "group flex flex-col h-full overflow-hidden rounded-lg border bg-card shadow-md transition-all duration-300 ease-in-out hover:shadow-primary/15 hover:border-primary/50 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 focus-within:ring-offset-background",
        !hasImage &&
          "border-dashed border-border/60 hover:border-primary/40 dark:bg-card/60"
      )}
    >
      <CardHeader
        className={cn(
          "p-0 relative",
          hasImage
            ? "aspect-[16/9]"
            : "h-52 flex items-center justify-center bg-secondary/20 dark:bg-secondary/5 p-5 border-b"
        )}
      >
        {hasImage ? (
          <Link
            href={project.homepage || project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
            aria-label={`View project: ${project.name}`}
          >
            <Image
              src={project.imageUrl!}
              alt={`${project.name} screenshot`}
              fill
              className="object-cover transition-transform duration-400 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground/80 pointer-events-none">
            <Layers size={44} className="mb-3 text-primary/60" />
            <p className="text-base font-semibold leading-tight max-w-[90%] break-words text-foreground/80">
              {project.name}
            </p>
            <p className="text-xs mt-1.5 opacity-70">Visual Not Available</p>
          </div>
        )}
        {(typeof project.stargazers_count === "number" ||
          typeof project.forks_count === "number") &&
          hasImage && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
              {typeof project.stargazers_count === "number" &&
                project.stargazers_count > 0 && (
                  <Badge
                    variant="secondary"
                    className="backdrop-blur-sm bg-black/45 text-white text-[0.7rem] px-1.5 py-0.5 shadow-lg"
                  >
                    <Star className="mr-1 size-3 fill-yellow-400 text-yellow-400" />
                    {project.stargazers_count}
                  </Badge>
                )}
              {typeof project.forks_count === "number" &&
                project.forks_count > 0 && (
                  <Badge
                    variant="secondary"
                    className="backdrop-blur-sm bg-black/45 text-white text-[0.7rem] px-1.5 py-0.5 shadow-lg"
                  >
                    <GitFork className="mr-1 size-3" /> {project.forks_count}
                  </Badge>
                )}
            </div>
          )}
      </CardHeader>
      <CardContent className="px-4 flex-grow flex flex-col">
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
          <Link
            href={project.homepage || project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus:underline"
          >
            {project.name}
          </Link>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-[0.85rem] leading-relaxed mb-3 line-clamp-4 flex-grow min-h-[5.2em]">
          {displayDescription}
        </CardDescription>
        <div className="mt-auto pt-3">
          <div className="flex flex-wrap gap-1.5 min-h-[2em]">
            {project.techStack && project.techStack.length > 0
              ? project.techStack.slice(0, 5).map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="text-[0.7rem] px-2 py-0.5 font-medium border-primary/30 text-primary/90 bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    {tech}
                  </Badge>
                ))
              : project.language && (
                  <Badge
                    variant="outline"
                    className="text-[0.7rem] px-2 py-0.5 font-medium border-primary/30 text-primary/90 bg-primary/5"
                  >
                    {project.language}
                  </Badge>
                )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex items-center justify-between gap-2 border-t">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-primary hover:bg-accent/50 dark:hover:bg-accent/10 px-2 py-1 text-xs"
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-2.5 py-1 text-xs shadow hover:shadow-md transition-all"
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
        </div>
        {project.language &&
          (!project.techStack ||
            !project.techStack.includes(project.language) ||
            project.techStack.length === 0 ||
            project.techStack.length > 5) && (
            <Badge
              variant="secondary"
              className="text-[0.65rem] bg-muted/70 text-muted-foreground font-medium px-1.5 py-0.5"
            >
              {project.language}
            </Badge>
          )}
      </CardFooter>
    </Card>
  );
}
