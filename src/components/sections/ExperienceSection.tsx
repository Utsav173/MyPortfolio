"use client";

import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface ExperienceSectionProps {
  className?: string;
  id?: string;
}

const experiencesData = [
  {
    role: "Web Developer",
    company: "Zignuts Technolab, Gujarat, India",
    duration: "January 2023 - Present",
    responsibilities: [
      "Spearheaded development of critical project components, demonstrating advanced technical leadership.",
      "Engineered and deployed robust, high-availability RESTful APIs using Node.js and Express.js, achieving significant improvements in API response times via query optimization (PostgreSQL) and caching (Redis).",
      "Developed highly scalable backend services and microservices, efficiently processing substantial daily data transaction volumes.",
      "Led end-to-end design and implementation of complex, intuitive UIs with React.js, Redux, and Material-UI.",
      "Integrated comprehensive security modules, including JWT-based authentication and RBAC.",
      "Mentored junior developers and championed CI/CD pipeline improvements (GitHub Actions, Jenkins).",
    ],
    keyProjects: [
      {
        name: "Restaurant Inventory Management System",
        tech: ["Node.js", "Strapi v4", "PostgreSQL", "JWT", "RBAC"],
      },
      {
        name: "Comprehensive Education Management Platform",
        tech: ["Node.js", "Sails.js", "PostgreSQL", "AWS SQS"],
      },
      {
        name: "Financial Transaction Management System",
        tech: ["Node.js", "Sails.js", "SQL", "Recharts"],
      },
      {
        name: "Cloud Procurement & Bidding Platform",
        tech: ["Node.js", "Express.js", "Socket.io", "AWS"],
      },
    ],
  },
];

export function ExperienceSection({ className, id }: ExperienceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !timelineContainerRef.current ||
        !timelineLineRef.current
      )
        return;

      const heading = headingRef.current;
      const line = timelineLineRef.current;
      const items = gsap.utils.toArray<HTMLElement>(
        ".experience-item",
        timelineContainerRef.current
      );

      // Heading animation
      if (heading) {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 30, filter: "blur(3px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Timeline items animation
      items.forEach((itemEl, index) => {
        const dotElement = itemEl.querySelector(
          ".css-timeline-dot"
        ) as HTMLElement | null;
        const contentElement = itemEl.querySelector(
          ".timeline-content-animated"
        ) as HTMLElement | null;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: itemEl,
            start: "top 85%",
            once: true,
          },
        });

        if (contentElement) {
          tl.fromTo(
            contentElement,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          );
        }
        if (dotElement) {
          tl.fromTo(
            dotElement,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
            contentElement ? "-=0.3" : 0
          );
        }
      });

      // Fixed timeline line animation
      if (line && items.length > 0) {
        // Set initial state
        gsap.set(line, {
          height: 0,
          transformOrigin: "top center",
        });

        // Get the total height of timeline container
        const timelineContainer = timelineContainerRef.current;
        const containerHeight = timelineContainer.scrollHeight;

        // Set the line to full height but hidden initially
        gsap.set(line, { height: containerHeight });

        // Create the scroll-triggered animation
        gsap.fromTo(
          line,
          {
            scaleY: 0,
            transformOrigin: "top center",
          },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timelineContainer,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
              invalidateOnRefresh: true,
              onRefresh: () => {
                // Recalculate height on refresh
                const newHeight = timelineContainer.scrollHeight;
                gsap.set(line, { height: newHeight });
              },
            },
          }
        );
      }
    },
    {
      scope: sectionRef,
      dependencies: [experiencesData.length],
      revertOnUpdate: true,
    }
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        "bg-secondary/20 dark:bg-secondary/5 py-20 md:py-28 lg:py-32 w-full",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <h2
          ref={headingRef}
          className="mb-16 sm:mb-20 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
        >
          Professional <span className="text-primary">Journey</span>
        </h2>
        <div ref={timelineContainerRef} className="relative max-w-3xl mx-auto">
          <div
            ref={timelineLineRef}
            className="absolute top-0 left-[calc(0.75rem-1px)] sm:left-[calc(0.875rem-1px)] md:left-[calc(1rem-1.5px)] w-[2px] md:w-[3px] bg-primary/50"
            aria-hidden="true"
          ></div>
          {experiencesData.map((exp, index) => {
            return (
              <div
                key={`${exp.company}-${index}`}
                className="experience-item relative pl-8 sm:pl-10 md:pl-12 mb-10 sm:mb-12 last:mb-0 group/expitem"
              >
                <div
                  className="css-timeline-dot absolute left-0 top-1 size-6 sm:size-7 md:size-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-background z-10"
                  style={{ transformOrigin: "center center" }}
                >
                  <Briefcase className="size-3 sm:size-3.5 md:size-4 text-primary-foreground" />
                </div>
                <div className="timeline-content-animated ml-1 sm:ml-2">
                  <p className="text-xs text-muted-foreground mb-1 sm:mb-1.5 font-mono tracking-wide">
                    {exp.duration}
                  </p>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-0.5 sm:mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-primary font-medium text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                    {exp.company}
                  </p>
                  <ul className="list-disc list-outside ml-4 sm:ml-5 space-y-1.5 sm:space-y-2 text-muted-foreground mb-4 sm:mb-6 text-[0.85rem] sm:text-[0.9rem] md:text-[0.95rem] leading-relaxed">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                  {exp.keyProjects && exp.keyProjects.length > 0 && (
                    <>
                      <h4 className="text-sm md:text-md font-semibold text-foreground mb-2 sm:mb-2.5 mt-4 sm:mt-5">
                        Key Projects:
                      </h4>
                      <div className="space-y-2.5 sm:space-y-3">
                        {exp.keyProjects.map((project, projectIndex) => (
                          <div
                            key={`${project.name}-${projectIndex}`}
                            className="p-2.5 sm:p-3 md:p-4 border rounded-md md:rounded-lg bg-card/60 dark:bg-card/30 shadow-sm hover:border-primary/40 transition-colors duration-200 group/projectcard"
                          >
                            <p className="font-semibold text-card-foreground text-[0.85rem] sm:text-sm md:text-base">
                              {project.name}
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                              {project.tech.map((t, techIndex) => (
                                <Badge
                                  key={`${t}-${techIndex}`}
                                  variant="outline"
                                  className="text-[0.65rem] sm:text-[0.7rem] md:text-xs px-1.5 sm:px-2 py-0.5 border-primary/40 text-primary/80 bg-primary/5 hover:bg-primary/10 transition-all duration-150 group-hover/projectcard:scale-[1.03] group-hover/projectcard:shadow-sm"
                                >
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
