"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

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

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const experienceItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animatedElements = useRef(new Set<HTMLElement>());

  useEffect(() => {
    if (!sectionRef.current) return;
    experienceItemRefs.current = experienceItemRefs.current.slice(
      0,
      experiencesData.length
    );

    const initAndObserve = (
      targetRef: React.RefObject<HTMLElement>,
      animationConfig: anime.AnimeParams,
      isLine: boolean = false
    ) => {
      const element = targetRef.current;
      if (element && !animatedElements.current.has(element)) {
        element.style.opacity = "0";
        if (isLine) {
          element.style.transform = "scaleY(0)";
          element.style.opacity = "0.5";
        } else if (animationConfig.translateY) {
          element.style.transform = `translateY(${
            (animationConfig.translateY as number[])[0]
          }px)`;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                entry.isIntersecting &&
                !animatedElements.current.has(element)
              ) {
                anime({
                  targets: element,
                  opacity: [0, 1],
                  ...animationConfig,
                });
                animatedElements.current.add(element);
                observer.unobserve(element);
              }
            });
          },
          {
            threshold: isLine ? 0.05 : 0.15,
            rootMargin: isLine ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
          }
        );
        observer.observe(element);
      }
    };

    initAndObserve(headingRef as React.RefObject<HTMLElement>, {
      translateY: [30, 0],
      filter: ["blur(3px)", "blur(0px)"],
      duration: 800,
      easing: "easeOutExpo",
    });

    if (timelineContainerRef.current) {
      const timelineLineEl = timelineContainerRef.current.querySelector(
        ".timeline-line-animated"
      ) as HTMLElement | null;
      if (timelineLineEl) {
        const lineRef = { current: timelineLineEl };
        initAndObserve(
          lineRef,
          {
            scaleY: [0, 1],
            opacity: [0.5, 1],
            duration: 2000,
            easing: "easeInOutSine",
          },
          true
        );
      }
    }

    experienceItemRefs.current.forEach((itemElRef, index) => {
      const itemEl = itemElRef;
      if (itemEl) {
        const cssDotElement = itemEl.querySelector(
          ".css-timeline-dot"
        ) as HTMLElement | null;
        const contentElement = itemEl.querySelector(
          ".timeline-content-animated"
        ) as HTMLElement | null;

        if (cssDotElement) {
          cssDotElement.style.opacity = "0";
          cssDotElement.style.transform = "scale(0)";
        }
        if (contentElement) {
          contentElement.style.opacity = "0";
          contentElement.style.transform = "translateY(30px)";
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                entry.isIntersecting &&
                !animatedElements.current.has(itemEl)
              ) {
                const tl = anime.timeline({
                  easing: "easeOutExpo",
                  delay: index * 100,
                });
                if (contentElement) {
                  tl.add({
                    targets: contentElement,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                  });
                }
                if (cssDotElement) {
                  tl.add(
                    {
                      targets: cssDotElement,
                      opacity: [0, 1],
                      scale: [0, 1],
                      duration: 500,
                      easing: "spring(1, 70, 12, 0)",
                    },
                    "-=500"
                  );
                }
                animatedElements.current.add(itemEl);
                observer.unobserve(itemEl);
              }
            });
          },
          { threshold: 0.2, rootMargin: "0px 0px -30px 0px" }
        );
        observer.observe(itemEl);
      }
    });

    return () => {
      animatedElements.current.clear();
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="bg-secondary/20 dark:bg-secondary/5"
    >
      <div className="container mx-auto px-4">
        <h2
          ref={headingRef}
          className="mb-20 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
        >
          Professional <span className="text-primary">Journey</span>
        </h2>
        <div ref={timelineContainerRef} className="relative max-w-3xl mx-auto">
          {/* Adjusted left positioning: 
              - For left-3.5 (14px), dot is size-7 (28px). (14 - 28/2) = 0.
              - For left-4 (16px), dot is size-8 (32px). (16 - 32/2) = 0.
              The line should be in the center of the dot. Dot width/2 - line width/2.
              If dot is size-7 (28px) and line is w-0.5 (2px), center is 14px - 1px = 13px.
              If dot is size-8 (32px) and line is w-1 (4px), center is 16px - 2px = 14px.
          */}
          <div
            className="timeline-line-animated absolute top-0 left-[calc(0.875rem-1px)] md:left-[calc(1rem-2px)] w-0.5 md:w-1 bg-primary/50 origin-top"
            style={{ height: "calc(100% - 2rem)" }}
            aria-hidden="true"
          ></div>

          {experiencesData.map((exp, index) => {
            return (
              <div
                key={exp.company + exp.duration}
                ref={(el) => {
                  experienceItemRefs.current[index] = el;
                }}
                className="relative pl-10 md:pl-12 mb-12 group"
              >
                <div
                  className="css-timeline-dot absolute left-0 top-1 size-7 md:size-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-background"
                  style={{ transformOrigin: "center center" }}
                >
                  <Briefcase className="size-3.5 md:size-4 text-primary-foreground" />
                </div>

                <div className="timeline-content-animated ml-2">
                  <p className="text-xs text-muted-foreground mb-1.5 font-mono tracking-wide">
                    {exp.duration}
                  </p>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-primary font-medium text-base md:text-lg mb-4">
                    {exp.company}
                  </p>
                  <ul className="list-disc list-outside ml-5 space-y-2 text-muted-foreground mb-6 text-[0.9rem] md:text-[0.95rem] leading-relaxed">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                  {exp.keyProjects && exp.keyProjects.length > 0 && (
                    <>
                      <h4 className="text-sm md:text-md font-semibold text-foreground mb-2.5 mt-5">
                        Key Projects:
                      </h4>
                      <div className="space-y-3">
                        {exp.keyProjects.map((project) => (
                          <div
                            key={project.name}
                            className="p-3 md:p-4 border rounded-md md:rounded-lg bg-card/60 dark:bg-card/30 shadow-sm hover:border-primary/40 transition-colors duration-200"
                          >
                            <p className="font-semibold text-card-foreground text-sm md:text-base">
                              {project.name}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {project.tech.map((t) => (
                                <Badge
                                  key={t}
                                  variant="outline"
                                  className="text-[0.7rem] md:text-xs px-2 py-0.5 border-primary/40 text-primary/80 bg-primary/5 hover:bg-primary/10"
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
