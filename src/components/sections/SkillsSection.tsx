"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Server,
  Database,
  Cloud,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const skillsData = [
  {
    category: "Frontend",
    icon: <Code2 className="size-10 mb-4 text-primary" />,
    skills: [
      "React.js",
      "Next.js",
      "Redux",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Shadcn/UI",
      "Material-UI",
      "Responsive Design",
      "UI/UX Optimization",
    ],
  },
  {
    category: "Backend",
    icon: <Server className="size-10 mb-4 text-primary" />,
    skills: [
      "Node.js",
      "Bun.js",
      "Hono.js",
      "Express.js",
      "RESTful APIs",
      "GraphQL",
      "Microservices",
      "WebSockets",
      "Serverless (AWS Lambda, Cloudflare Workers)",
    ],
  },
  {
    category: "Databases",
    icon: <Database className="size-10 mb-4 text-primary" />,
    skills: [
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "SQL",
      "NoSQL",
      "Drizzle ORM",
      "Prisma",
      "Data Modeling",
      "Caching (Redis)",
    ],
  },
  {
    category: "Cloud & DevOps",
    icon: <Cloud className="size-10 mb-4 text-primary" />,
    skills: [
      "AWS",
      "Cloudflare Workers",
      "Vercel",
      "Netlify",
      "CI/CD (GitHub Actions, Jenkins)",
      "Docker",
      "Git",
    ],
  },
  {
    category: "Security & Performance",
    icon: <ShieldCheck className="size-10 mb-4 text-primary" />,
    skills: [
      "API Security",
      "Data Encryption",
      "APM",
      "Load Balancing",
      "Code Optimization",
      "WAF",
    ],
  },
  {
    category: "Tools & Methodologies",
    icon: <Wrench className="size-10 mb-4 text-primary" />,
    skills: [
      "VS Code",
      "Postman",
      "Swagger/OpenAPI",
      "Figma",
      "Jira",
      "Agile/Scrum",
      "TDD",
      "Unit & Integration Testing",
    ],
  },
];

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skillCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    skillCardsRef.current = skillCardsRef.current.slice(0, skillsData.length);
    const currentSectionRef = sectionRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = anime.timeline({
              easing: "easeOutExpo",
            });

            if (
              headingRef.current &&
              headingRef.current.style.opacity === "0"
            ) {
              tl.add({
                targets: headingRef.current,
                opacity: [0, 1],
                translateY: [25, 0],
                filter: ["blur(3px)", "blur(0px)"],
                duration: 750,
              });
            }

            const validCards = skillCardsRef.current.filter(
              (el) => el !== null && el.style.opacity === "0"
            ) as HTMLDivElement[];
            if (validCards.length > 0) {
              tl.add(
                {
                  targets: validCards,
                  opacity: [0, 1],
                  translateY: [40, 0],
                  scale: [0.92, 1],
                  rotateX: [-15, 0],
                  duration: 650,
                  delay: anime.stagger(80, { start: 0 }),
                },
                "-=500"
              );
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    if (currentSectionRef) {
      if (headingRef.current) headingRef.current.style.opacity = "0";
      skillCardsRef.current.forEach((card) => {
        if (card) card.style.opacity = "0";
      });
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
      anime.remove([
        headingRef.current,
        ...skillCardsRef.current.filter((el) => el),
      ]);
    };
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="bg-background dark:bg-secondary/5"
    >
      <div className="container mx-auto px-4">
        <h2
          ref={headingRef}
          className="mb-20 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
        >
          My <span className="text-primary">Technical Toolkit</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {skillsData.map((categoryItem, index) => (
            <div
              key={categoryItem.category}
              ref={(el) => {
                skillCardsRef.current[index] = el;
              }}
              className="bg-card p-6 md:p-8 rounded-xl border border-border/70 shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-2 hover:border-primary/50"
            >
              <div className="mb-5 p-3 bg-primary/10 rounded-full inline-block">
                {React.cloneElement(categoryItem.icon, {
                  className: "size-8 md:size-10 text-primary",
                })}
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-5 text-card-foreground">
                {categoryItem.category}
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {categoryItem.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-sm font-medium px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
