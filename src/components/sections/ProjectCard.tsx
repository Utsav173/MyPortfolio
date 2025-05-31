import Link from "next/link";
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
  topics: string[];
  imageUrl?: string;
  techStack?: string[];
  owner?: string;
  full_name?: string;
  className?: string;
}

interface ProjectCardProps extends HTMLAttributes<HTMLDivElement> {
  project: Project;
}

interface SpotlightCSSProperties extends React.CSSProperties {
  "--mouse-x"?: string;
  "--mouse-y"?: string;
}

const TECH_DETAILS: Record<
  string,
  { icon: string; color: string; name: string; lightBg?: string }
> = {
  "next.js": {
    icon: "nextdotjs",
    color: "oklch(0% 0 0)",
    name: "Next.js",
    lightBg: "oklch(0% 0 0 / 0.03)",
  },
  react: {
    icon: "react",
    color: "oklch(67.8% 0.17 229.7)",
    name: "React",
    lightBg: "oklch(67.8% 0.17 229.7 / 0.07)",
  },
  "react native": {
    icon: "react",
    color: "oklch(67.8% 0.17 229.7)",
    name: "React Native",
    lightBg: "oklch(67.8% 0.17 229.7 / 0.07)",
  },
  typescript: {
    icon: "typescript",
    color: "oklch(57.1% 0.14 260.3)",
    name: "TypeScript",
    lightBg: "oklch(57.1% 0.14 260.3 / 0.07)",
  },
  javascript: {
    icon: "javascript",
    color: "oklch(88.2% 0.22 91.2)",
    name: "JavaScript",
    lightBg: "oklch(88.2% 0.22 91.2 / 0.1)",
  },
  "node.js": {
    icon: "nodedotjs",
    color: "oklch(61.8% 0.16 147.8)",
    name: "Node.js",
    lightBg: "oklch(61.8% 0.16 147.8 / 0.07)",
  },
  tailwindcss: {
    icon: "tailwindcss",
    color: "oklch(67.8% 0.15 211.5)",
    name: "Tailwind CSS",
    lightBg: "oklch(67.8% 0.15 211.5 / 0.07)",
  },
  html5: {
    icon: "html5",
    color: "oklch(62% 0.23 30.1)",
    name: "HTML5",
    lightBg: "oklch(62% 0.23 30.1 / 0.07)",
  },
  css3: {
    icon: "css3",
    color: "oklch(57.6% 0.2 260.6)",
    name: "CSS3",
    lightBg: "oklch(57.6% 0.2 260.6 / 0.07)",
  },
  python: {
    icon: "python",
    color: "oklch(58.6% 0.16 264.7)",
    name: "Python",
    lightBg: "oklch(58.6% 0.16 264.7 / 0.07)",
  },
  postgresql: {
    icon: "postgresql",
    color: "oklch(47.8% 0.11 260.7)",
    name: "PostgreSQL",
    lightBg: "oklch(47.8% 0.11 260.7 / 0.07)",
  },
  mongodb: {
    icon: "mongodb",
    color: "oklch(58.4% 0.17 149.5)",
    name: "MongoDB",
    lightBg: "oklch(58.4% 0.17 149.5 / 0.07)",
  },
  docker: {
    icon: "docker",
    color: "oklch(69.8% 0.16 237.6)",
    name: "Docker",
    lightBg: "oklch(69.8% 0.16 237.6 / 0.07)",
  },
  git: {
    icon: "git",
    color: "oklch(56.1% 0.22 25.7)",
    name: "Git",
    lightBg: "oklch(56.1% 0.22 25.7 / 0.07)",
  },
  github: {
    icon: "github",
    color: "oklch(15.5% 0 0)",
    name: "GitHub",
    lightBg: "oklch(15.5% 0 0 / 0.03)",
  },
  vercel: {
    icon: "vercel",
    color: "oklch(0% 0 0)",
    name: "Vercel",
    lightBg: "oklch(0% 0 0 / 0.03)",
  },
  cloudflare: {
    icon: "cloudflare",
    color: "oklch(65.9% 0.23 41.5)",
    name: "Cloudflare",
    lightBg: "oklch(65.9% 0.23 41.5 / 0.07)",
  },
  "cloudflare pages": {
    icon: "cloudflare",
    color: "oklch(65.9% 0.23 41.5)",
    name: "Cloudflare Pages",
    lightBg: "oklch(65.9% 0.23 41.5 / 0.07)",
  },
  "cloudflare workers": {
    icon: "cloudflare",
    color: "oklch(65.9% 0.23 41.5)",
    name: "Cloudflare Workers",
    lightBg: "oklch(65.9% 0.23 41.5 / 0.07)",
  },
  aws: {
    icon: "amazonaws",
    color: "oklch(62.5% 0.22 43.1)",
    name: "AWS",
    lightBg: "oklch(62.5% 0.22 43.1 / 0.07)",
  },
  firebase: {
    icon: "firebase",
    color: "oklch(78.8% 0.26 60.7)",
    name: "Firebase",
    lightBg: "oklch(78.8% 0.26 60.7 / 0.07)",
  },
  "drizzle orm": {
    icon: "drizzle",
    color: "oklch(79.2% 0.21 160.7)",
    name: "Drizzle ORM",
    lightBg: "oklch(79.2% 0.21 160.7 / 0.07)",
  },
  "hono.js": {
    icon: "hono",
    color: "oklch(65.9% 0.23 41.5)",
    name: "Hono.js",
    lightBg: "oklch(65.9% 0.23 41.5 / 0.07)",
  },
  "three.js": {
    icon: "threedotjs",
    color: "oklch(15.5% 0 0)",
    name: "Three.js",
    lightBg: "oklch(15.5% 0 0 / 0.03)",
  },
  mdx: {
    icon: "mdx",
    color: "oklch(15.5% 0 0)",
    name: "MDX",
    lightBg: "oklch(15.5% 0 0 / 0.03)",
  },
  prisma: {
    icon: "prisma",
    color: "oklch(34.7% 0.06 242.4)",
    name: "Prisma",
    lightBg: "oklch(34.7% 0.06 242.4 / 0.07)",
  },
  trpc: {
    icon: "trpc",
    color: "oklch(71.4% 0.18 237.5)",
    name: "tRPC",
    lightBg: "oklch(71.4% 0.18 237.5 / 0.07)",
  },
  "socket.io": {
    icon: "socketdotio",
    color: "oklch(15.5% 0 0)",
    name: "Socket.IO",
    lightBg: "oklch(15.5% 0 0 / 0.03)",
  },
  vite: {
    icon: "vite",
    color: "oklch(71.4% 0.28 285.6)",
    name: "Vite",
    lightBg: "oklch(71.4% 0.28 285.6 / 0.07)",
  },
  expo: {
    icon: "expo",
    color: "oklch(15.5% 0 0)",
    name: "Expo",
    lightBg: "oklch(15.5% 0 0 / 0.03)",
  },
  ai: {
    icon: "openai",
    color: "oklch(65.1% 0.15 178.8)",
    name: "AI",
    lightBg: "oklch(65.1% 0.15 178.8 / 0.07)",
  },
  "gemini ai": {
    icon: "googlebigquery",
    color: "oklch(62.6% 0.18 262.1)",
    name: "Gemini AI",
    lightBg: "oklch(62.6% 0.18 262.1 / 0.07)",
  },
  "fal.ai api": {
    icon: " poucos",
    color: "oklch(65.1% 0.15 178.8)",
    name: "Fal.ai API",
    lightBg: "oklch(65.1% 0.15 178.8 / 0.07)",
  },
};

const getTechDetails = (techName: string) => {
  const lowerTechName = techName.toLowerCase();
  return (
    TECH_DETAILS[lowerTechName] || {
      icon: "help",
      color: "var(--color-muted-foreground)",
      name: techName,
      lightBg: "var(--color-secondary / 0.5)",
    }
  );
};

export function ProjectCard({
  project,
  className,
  ...props
}: ProjectCardProps) {
  const displayDescription =
    project.description ||
    "A project exploring modern web development concepts.";
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightStyle, setSpotlightStyle] = useState<SpotlightCSSProperties>({
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightStyle({
      "--mouse-x": `${e.clientX - rect.left}px`,
      "--mouse-y": `${e.clientY - rect.top}px`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => setSpotlightStyle({ opacity: 0 });

  const techToDisplay = (
    project.techStack && project.techStack.length > 0
      ? project.techStack
      : project.language
      ? [project.language, ...project.topics.slice(0, 4)]
      : project.topics
  ).slice(0, 5);

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group/card relative flex flex-col h-full overflow-hidden rounded-lg",
        "bg-card/90 dark:bg-card/95",
        "border border-border/50 dark:border-border/60",
        "shadow-lg dark:shadow-lg",
        "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        "hover:border-primary/70 dark:hover:border-primary/70",
        "hover:shadow-xl dark:hover:shadow-xl hover:shadow-primary/20 dark:hover:shadow-primary/25",
        "hover:-translate-y-1",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        className
      )}
      style={{ ...props.style } as React.CSSProperties}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={
          {
            ...spotlightStyle,
            background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), oklch(var(--primary-oklch-values) / 0.08), transparent 70%)`,
          } as SpotlightCSSProperties
        }
      />

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
            programmingLanguage: project.language || "JavaScript",
            keywords: project.topics.join(", ") || techToDisplay.join(", "),
            author: {
              "@type": "Person",
              name: project.owner || "Utsav Khatri",
            },
            aggregateRating: project.stargazers_count
              ? {
                  "@type": "AggregateRating",
                  ratingValue: project.stargazers_count,
                  reviewCount: project.stargazers_count,
                }
              : undefined,
          }),
        }}
      />

      <CardContent className="p-6 flex-grow flex flex-col gap-4 relative z-[1]">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl lg:text-2xl font-semibold leading-tight text-foreground/90 group-hover/card:text-primary transition-colors duration-200">
            <Link
              href={project.homepage || project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-none"
            >
              <span
                className="absolute inset-0 rounded-lg"
                aria-hidden="true"
              />
              {project.name}
            </Link>
          </CardTitle>
          {(project.stargazers_count || 0) > 0 && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground group-hover/card:text-amber-500 transition-colors duration-200 shrink-0 pt-1">
              <Star className="size-4 group-hover/card:fill-amber-400" />
              {project.stargazers_count}
            </span>
          )}
        </div>

        <CardDescription className="text-muted-foreground text-[0.9rem] md:text-base leading-relaxed line-clamp-3 flex-grow min-h-[4.2em] group-hover/card:text-foreground/80 dark:group-hover/card:text-foreground/85 transition-colors duration-200">
          {displayDescription}
        </CardDescription>

        <div className="mt-auto pt-3">
          {techToDisplay.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center min-h-[2em] mb-1">
              {techToDisplay.map((techName) => {
                const tech = getTechDetails(techName);
                return (
                  <Badge
                    key={tech.name}
                    variant="outline"
                    className={cn(
                      "group/badge relative flex items-center gap-1.5 text-[0.7rem] px-2.5 py-[3px] font-medium rounded-md cursor-default",
                      "border-border/60 bg-secondary/40 text-muted-foreground",
                      "transition-all duration-200 ease-out",
                      "hover:scale-105 hover:shadow-md", // Individual badge hover: scale and shadow
                      "group-hover/card:border-transparent"
                    )}
                    style={
                      {
                        "--tech-brand-color": tech.color,
                        "--tech-light-bg":
                          tech.lightBg || "var(--color-accent / 0.1)",
                      } as React.CSSProperties
                    }
                  >
                    <span className="absolute inset-0 rounded-md border-2 border-transparent transition-all duration-200 group-hover/badge:border-[--tech-brand-color] opacity-0 group-hover/badge:opacity-100"></span>

                    <span
                      className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 group-hover/badge:opacity-100"
                      style={{ backgroundColor: "var(--tech-light-bg)" }}
                    ></span>

                    <Icon
                      icon={`simple-icons:${tech.icon}`}
                      className="size-3.5 relative z-[1] transition-colors group-hover/card:text-[--tech-brand-color]"
                      style={{ color: "var(--tech-brand-color)" }}
                    />
                    <span className="relative z-[1] transition-colors group-hover/card:text-foreground/80 group-hover/badge:text-foreground">
                      {tech.name}
                    </span>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          "p-4 pt-3 flex items-center justify-end gap-3 border-t relative z-[1]",
          "border-border/50 dark:border-border/60",
          "transition-colors duration-300 group-hover/card:border-primary/30"
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="group/button text-muted-foreground hover:text-primary rounded-md px-3 py-1.5 transition-all duration-200"
        >
          <Link
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-1.5 size-4 transition-transform duration-200 group-hover/button:scale-110" />{" "}
            Source
          </Link>
        </Button>
        {project.homepage && (
          <Button
            variant="default"
            size="sm"
            asChild
            className="group/button bg-primary/90 hover:bg-primary text-primary-foreground rounded-md shadow hover:shadow-md px-3 py-1.5 transition-all duration-200"
          >
            <Link
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-1.5 size-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />{" "}
              Live Demo
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
