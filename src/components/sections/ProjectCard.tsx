import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import type { CSSProperties, MouseEvent, FC } from "react";
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

interface SpotlightCSSProperties extends CSSProperties {
  "--mouse-x"?: string;
  "--mouse-y"?: string;
}

type TechDetails = Record<
  string,
  { icon: string; color: string; name: string; lightBg?: string }
>;

const TECH_DETAILS: TechDetails = {
  "next.js": { icon: "nextdotjs", color: "oklch(0% 0 0)", name: "Next.js" },
  react: { icon: "react", color: "oklch(67.8% 0.17 229.7)", name: "React" },
  "react native": {
    icon: "react",
    color: "oklch(67.8% 0.17 229.7)",
    name: "React Native",
  },
  typescript: {
    icon: "typescript",
    color: "oklch(57.1% 0.14 260.3)",
    name: "TypeScript",
  },
  javascript: {
    icon: "javascript",
    color: "oklch(88.2% 0.22 91.2)",
    name: "JavaScript",
  },
  "node.js": {
    icon: "nodedotjs",
    color: "oklch(61.8% 0.16 147.8)",
    name: "Node.js",
  },
  tailwindcss: {
    icon: "tailwindcss",
    color: "oklch(67.8% 0.15 211.5)",
    name: "Tailwind CSS",
  },
  html5: { icon: "html5", color: "oklch(62% 0.23 30.1)", name: "HTML5" },
  css3: { icon: "css3", color: "oklch(57.6% 0.2 260.6)", name: "CSS3" },
  python: { icon: "python", color: "oklch(58.6% 0.16 264.7)", name: "Python" },
  postgresql: {
    icon: "postgresql",
    color: "oklch(47.8% 0.11 260.7)",
    name: "PostgreSQL",
  },
  mongodb: {
    icon: "mongodb",
    color: "oklch(58.4% 0.17 149.5)",
    name: "MongoDB",
  },
  docker: { icon: "docker", color: "oklch(69.8% 0.16 237.6)", name: "Docker" },
  git: { icon: "git", color: "oklch(56.1% 0.22 25.7)", name: "Git" },
  vercel: { icon: "vercel", color: "oklch(0% 0 0)", name: "Vercel" },
  "cloudflare pages": {
    icon: "cloudflare",
    color: "oklch(65.9% 0.23 41.5)",
    name: "Cloudflare Pages",
  },
  "cloudflare workers": {
    icon: "cloudflare",
    color: "oklch(65.9% 0.23 41.5)",
    name: "Cloudflare Workers",
  },
  aws: { icon: "amazonaws", color: "oklch(62.5% 0.22 43.1)", name: "AWS" },
  "drizzle orm": {
    icon: "drizzle",
    color: "oklch(79.2% 0.21 160.7)",
    name: "Drizzle ORM",
  },
  "hono.js": { icon: "hono", color: "oklch(65.9% 0.23 41.5)", name: "Hono.js" },
  "three.js": {
    icon: "threedotjs",
    color: "oklch(15.5% 0 0)",
    name: "Three.js",
  },
  mdx: { icon: "mdx", color: "oklch(15.5% 0 0)", name: "MDX" },
  ai: { icon: "openai", color: "oklch(65.1% 0.15 178.8)", name: "AI" },
  "gemini ai": {
    icon: "googlebigquery",
    color: "oklch(62.6% 0.18 262.1)",
    name: "Gemini AI",
  },
  "fal.ai api": {
    icon: "poucos",
    color: "oklch(65.1% 0.15 178.8)",
    name: "Fal.ai API",
  },
};

const getTechDetails = (techName: string) => {
  return (
    TECH_DETAILS[techName.toLowerCase()] || {
      icon: "help",
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
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const [spotlightStyle, setSpotlightStyle] = useState<SpotlightCSSProperties>({
    opacity: 0,
  });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardWrapperRef.current || shouldReduceMotion) return;
    const rect = cardWrapperRef.current.getBoundingClientRect();
    setSpotlightStyle({
      "--mouse-x": `${e.clientX - rect.left}px`,
      "--mouse-y": `${e.clientY - rect.top}px`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return;
    setSpotlightStyle({ opacity: 0 });
  };

  const techToDisplay = (
    project.techStack?.length
      ? project.techStack
      : project.language
      ? [project.language, ...project.topics.slice(0, 4)]
      : project.topics
  ).slice(0, 5);
  const displayDescription =
    project.description ||
    "A project exploring modern web development concepts.";
  const projectLink = project.homepage || project.html_url;

  return (
    <motion.div
      ref={cardWrapperRef}
      className={cn("h-full", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={shouldReduceMotion ? false : { y: 0 }}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -4,
              transition: { type: "spring", stiffness: 350, damping: 20 },
            }
      }
      {...props}
    >
      <Card
        className={cn(
          "group/card relative flex h-full flex-col overflow-hidden rounded-lg",
          "border border-border/50 bg-card/90 shadow-lg dark:border-border/60 dark:bg-card/95 dark:shadow-lg",
          "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          "hover:border-primary/70 hover:shadow-xl hover:shadow-primary/20 dark:hover:border-primary/70 dark:hover:shadow-xl dark:hover:shadow-primary/25",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
        )}
      >
        <div
          className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
          style={{
            ...spotlightStyle,
            background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), oklch(var(--primary-oklch-values) / 0.08), transparent 70%)`,
          }}
          aria-hidden="true"
        />

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
          <div className="mb-2 flex items-start justify-between">
            <CardTitle className="text-xl font-semibold leading-tight text-foreground/90 transition-colors duration-200 group-hover/card:text-primary">
              <Link
                href={projectLink}
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
            {(project.stargazers_count ?? 0) > 0 && (
              <span className="flex shrink-0 items-center gap-1 pt-1 text-sm text-muted-foreground transition-colors duration-200 group-hover/card:text-amber-500">
                <Star className="size-4 group-hover/card:fill-amber-400" />
                {project.stargazers_count}
              </span>
            )}
          </div>

          <CardDescription className="flex-grow text-sm leading-relaxed text-muted-foreground line-clamp-3 transition-colors duration-200 group-hover/card:text-foreground/85">
            {displayDescription}
          </CardDescription>

          {techToDisplay.length > 0 && (
            <div className="mt-auto pt-3">
              <div className="mb-1 flex min-h-[2em] flex-wrap items-center gap-2">
                {techToDisplay.map((techName) => {
                  const tech = getTechDetails(techName);
                  return (
                    <Badge
                      key={tech.name}
                      variant="outline"
                      className={cn(
                        "group/badge relative flex cursor-default items-center gap-1.5 rounded-md border-border/60 bg-secondary/40 px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground",
                        "transition-all duration-200 ease-out hover:scale-105 hover:shadow-md group-hover/card:border-transparent"
                      )}
                      style={
                        { "--tech-brand-color": tech.color } as CSSProperties
                      }
                    >
                      <span className="absolute inset-0 rounded-md border-2 border-transparent opacity-0 transition-all duration-200 group-hover/badge:border-[--tech-brand-color] group-hover/badge:opacity-100"></span>
                      <Icon
                        icon={`simple-icons:${tech.icon}`}
                        className="relative z-10 size-3.5 text-[--tech-brand-color]"
                      />
                      <span className="relative z-10 transition-colors group-hover/badge:text-foreground">
                        {tech.name}
                      </span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter
          className={cn(
            "relative z-10 flex items-center justify-end gap-2 border-t p-3",
            "border-border/50 transition-colors duration-300 group-hover/card:border-primary/30"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="group/button h-8 rounded-md px-2.5 text-muted-foreground transition-all duration-200 hover:text-primary"
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
              className="group/button h-8 rounded-md px-2.5 shadow transition-all duration-200 hover:shadow-md"
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "SoftwareApplication",
              name: project.name,
              description: displayDescription,
              url: projectLink,
              image: project.imageUrl,
              operatingSystem: "Web",
              applicationCategory: "WebApplication",
              programmingLanguage: project.language,
              keywords: project.topics.join(", "),
              author: {
                "@type": "Person",
                name: project.owner || "Utsav Khatri",
              },
              ...(project.stargazers_count && {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: project.stargazers_count,
                  reviewCount: project.stargazers_count,
                },
              }),
            }),
          }}
        />
      </Card>
    </motion.div>
  );
};
