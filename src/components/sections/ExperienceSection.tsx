"use client";

import React, { useEffect, useRef, useCallback } from "react";
import {
  animate,
  createTimeline,
  createSpring,
  type JSAnimation,
  type Timeline,
} from "animejs";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export function ExperienceSection({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const experienceItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const animatedElements = useRef(new Set<HTMLElement>());
  const animationInstances = useRef<Map<HTMLElement, JSAnimation | Timeline>>(
    new Map()
  );
  const observerStore = useRef<Map<HTMLElement, IntersectionObserver>>(
    new Map()
  );

  const initAndObserveItem = useCallback(
    (element: HTMLDivElement | null, index: number) => {
      if (element && !animatedElements.current.has(element)) {
        const cssDotElement = element.querySelector(
          ".css-timeline-dot"
        ) as HTMLElement | null;
        const contentElement = element.querySelector(
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
                !animatedElements.current.has(element)
              ) {
                const tl = createTimeline({
                  defaults: { ease: "easeOutExpo" },
                  delay: index * 50,
                });
                if (contentElement) {
                  tl.add(contentElement, {
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                  });
                }
                if (cssDotElement) {
                  tl.add(
                    cssDotElement,
                    {
                      opacity: [0, 1],
                      scale: [0, 1],
                      duration: 500,
                      ease: createSpring({
                        mass: 1,
                        stiffness: 70,
                        damping: 12,
                      }),
                    },
                    "-=500"
                  );
                }
                animationInstances.current.set(element, tl);
                animatedElements.current.add(element);
                observer.unobserve(element);
                observerStore.current.delete(element);
              }
            });
          },
          { threshold: 0.2, rootMargin: "0px 0px -30px 0px" }
        );
        observer.observe(element);
        observerStore.current.set(element, observer);
      }
    },
    []
  );

  useEffect(() => {
    const currentHeadingRef = headingRef.current;
    const currentTimelineLineRef = timelineLineRef.current;
    const currentTimelineContainerRef = timelineContainerRef.current;

    let lineScrollTriggerInstance: ScrollTrigger | null = null;

    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            currentHeadingRef &&
            !animatedElements.current.has(currentHeadingRef)
          ) {
            const anim = animate(currentHeadingRef, {
              opacity: [0, 1],
              translateY: [30, 0],
              filter: ["blur(3px)", "blur(0px)"],
              duration: 800,
              ease: "easeOutExpo",
            });
            animationInstances.current.set(currentHeadingRef, anim);
            animatedElements.current.add(currentHeadingRef);
            observerStore.current.get(currentHeadingRef)?.disconnect();
            observerStore.current.delete(currentHeadingRef);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    if (currentHeadingRef && !animatedElements.current.has(currentHeadingRef)) {
      currentHeadingRef.style.opacity = "0";
      currentHeadingRef.style.transform = "translateY(30px)";
      headingObserver.observe(currentHeadingRef);
      observerStore.current.set(currentHeadingRef, headingObserver);
    }

    experienceItemRefs.current.forEach((itemEl, index) => {
      initAndObserveItem(itemEl, index);
    });

    if (currentTimelineLineRef && currentTimelineContainerRef) {
      gsap.set(currentTimelineLineRef, { scaleY: 0, transformOrigin: "top" });

      lineScrollTriggerInstance = ScrollTrigger.create({
        trigger: currentTimelineContainerRef,
        start: "top bottom-=15%",
        end: "bottom top+=15%",
        scrub: 0.3,
        invalidateOnRefresh: true,
        animation: gsap.to(currentTimelineLineRef, {
          scaleY: 1,
          ease: "none",
        }),
      });
    }

    return () => {
      if (lineScrollTriggerInstance) {
        lineScrollTriggerInstance.kill();
      }
      if (currentTimelineLineRef) {
        gsap.killTweensOf(currentTimelineLineRef);
      }

      observerStore.current.forEach((observer) => observer.disconnect());
      observerStore.current.clear();

      animationInstances.current.forEach((instance) => {
        if (instance && typeof instance.pause === "function") {
          instance.pause();
        }
      });
      animationInstances.current.clear();
      animatedElements.current.clear();
    };
  }, [initAndObserveItem]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={cn(
        className,
        "bg-secondary/20 dark:bg-secondary/5 py-20 md:py-28 lg:py-32"
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
            className="absolute top-0 left-[calc(0.75rem-1px)] sm:left-[calc(0.875rem-1px)] md:left-[calc(1rem-2px)] w-0.5 md:w-1 bg-primary/80 origin-top"
            style={{ height: "calc(100% - 1rem)" }}
            aria-hidden="true"
          ></div>

          {experiencesData.map((exp, index) => {
            return (
              <div
                key={exp.company + exp.duration}
                ref={(el) => {
                  experienceItemRefs.current[index] = el;
                }}
                className="relative pl-8 sm:pl-10 md:pl-12 mb-10 sm:mb-12 group/expitem"
              >
                <div
                  className="css-timeline-dot absolute left-0 top-1 size-6 sm:size-7 md:size-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-background"
                  style={{ transformOrigin: "center center" }}
                >
                  <Briefcase className="size-3 sm:size-3.5 md:size-4 text-primary-foreground" />{" "}
                  {/* Adjusted size */}
                </div>

                <div className="timeline-content-animated ml-1 sm:ml-2">
                  {" "}
                  {/* Adjusted margin */}
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
                        {exp.keyProjects.map((project) => (
                          <div
                            key={project.name}
                            className="p-2.5 sm:p-3 md:p-4 border rounded-md md:rounded-lg bg-card/60 dark:bg-card/30 shadow-sm hover:border-primary/40 transition-colors duration-200 group/projectcard"
                          >
                            <p className="font-semibold text-card-foreground text-[0.85rem] sm:text-sm md:text-base">
                              {project.name}
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                              {project.tech.map((t) => (
                                <Badge
                                  key={t}
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
