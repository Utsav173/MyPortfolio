"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { animate, JSAnimation } from "animejs";
import {
  Code2,
  Server,
  Database,
  Cloud,
  Brain,
  Wrench,
  type LucideIcon,
  Users,
  GitFork,
  Zap,
  Scaling,
  ListChecks,
  ShieldCheck,
  Package,
  Lightbulb,
  BotMessageSquare,
  TerminalSquare,
  LayoutPanelLeft,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface SkillItemData {
  name: string;
  iconifyString: string;
  fallbackIcon?: LucideIcon;
}

interface SkillCategoryData {
  category: string;
  categoryIcon: LucideIcon;
  skills: SkillItemData[];
}

const skillsData: SkillCategoryData[] = [
  {
    category: "Frontend",
    categoryIcon: Code2,
    skills: [
      { name: "React.js", iconifyString: "logos:react" },
      { name: "Next.js", iconifyString: "teenyicons:nextjs-outline" },
      { name: "Redux", iconifyString: "logos:redux" },
      { name: "TypeScript", iconifyString: "logos:typescript-icon" },
      { name: "JavaScript (ES6+)", iconifyString: "logos:javascript" },
      { name: "HTML5", iconifyString: "logos:html-5" },
      { name: "CSS3", iconifyString: "logos:css-3" },
      { name: "Tailwind CSS", iconifyString: "logos:tailwindcss-icon" },
      {
        name: "Shadcn/UI",
        iconifyString: "simple-icons:shadcnui",
        fallbackIcon: LayoutPanelLeft,
      },
      { name: "Material-UI", iconifyString: "logos:material-ui" },
    ],
  },
  {
    category: "Backend",
    categoryIcon: Server,
    skills: [
      { name: "Node.js", iconifyString: "logos:nodejs-icon" },
      { name: "Bun.js", iconifyString: "logos:bun" },
      { name: "Hono.js", iconifyString: "logos:hono", fallbackIcon: Zap },
      { name: "Express.js", iconifyString: "simple-icons:express" },
      { name: "RESTful APIs", iconifyString: "mdi:api", fallbackIcon: GitFork },
      { name: "GraphQL", iconifyString: "logos:graphql" },
      {
        name: "Microservices",
        iconifyString: "carbon:microservices-1",
        fallbackIcon: Users,
      },
      {
        name: "WebSockets",
        iconifyString: "logos:socket-io",
        fallbackIcon: Zap,
      },
      {
        name: "Serverless",
        iconifyString: "logos:aws-lambda",
        fallbackIcon: Cloud,
      },
    ],
  },
  {
    category: "Databases",
    categoryIcon: Database,
    skills: [
      { name: "PostgreSQL", iconifyString: "logos:postgresql" },
      { name: "MongoDB", iconifyString: "logos:mongodb-icon" },
      { name: "MySQL", iconifyString: "logos:mysql" },
      { name: "Redis", iconifyString: "logos:redis" },
      {
        name: "Drizzle ORM",
        iconifyString: "simple-icons:drizzle",
        fallbackIcon: Database,
      },
      { name: "Prisma", iconifyString: "simple-icons:prisma" },
    ],
  },
  {
    category: "Cloud & DevOps",
    categoryIcon: Cloud,
    skills: [
      { name: "AWS", iconifyString: "logos:aws" },
      { name: "Google Cloud (GCP)", iconifyString: "logos:google-cloud" },
      { name: "Cloudflare", iconifyString: "logos:cloudflare-icon" },
      { name: "Vercel", iconifyString: "ion:logo-vercel" },
      { name: "Netlify", iconifyString: "logos:netlify-icon" },
      { name: "CI/CD (GitHub Actions)", iconifyString: "logos:github-actions" },
      { name: "Docker", iconifyString: "logos:docker-icon" },
      { name: "Git", iconifyString: "logos:git-icon" },
    ],
  },
  {
    category: "AI & Special Interests",
    categoryIcon: Brain,
    skills: [
      {
        name: "Generative AI",
        iconifyString: "carbon:machine-learning-model",
        fallbackIcon: Lightbulb,
      },
      {
        name: "LLMs",
        iconifyString: "fluent:brain-circuit-24-regular",
        fallbackIcon: BotMessageSquare,
      },
      {
        name: "API Security",
        iconifyString: "material-symbols:security",
        fallbackIcon: ShieldCheck,
      },
      {
        name: "Performance Opt.",
        iconifyString: "fluent-mdl2:speed-high",
        fallbackIcon: Zap,
      },
      {
        name: "Scalability",
        iconifyString: "mdi:chart-gantt",
        fallbackIcon: Scaling,
      },
    ],
  },
  {
    category: "Tools & Methodologies",
    categoryIcon: Wrench,
    skills: [
      { name: "VS Code", iconifyString: "logos:visual-studio-code" },
      { name: "Postman", iconifyString: "logos:postman-icon" },
      { name: "Swagger/OpenAPI", iconifyString: "logos:swagger" },
      { name: "Figma", iconifyString: "logos:figma" },
      { name: "Jira", iconifyString: "logos:jira" },
      {
        name: "Agile/Scrum",
        iconifyString: "mdi:account-group-outline",
        fallbackIcon: Users,
      },
      { name: "TDD", iconifyString: "mdi:test-tube", fallbackIcon: ListChecks },
    ],
  },
];

const SkillItemDisplay: React.FC<{
  skill: SkillItemData;
  itemColor?: string;
}> = ({ skill, itemColor }) => {
  const effectiveColor = itemColor || "currentColor";
  const itemRef = useRef<HTMLDivElement>(null);
  const iconContainerRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    animate(itemRef.current as HTMLElement, {
      translateY: -8,
      scale: 1.05,
      boxShadow:
        "0px 10px 20px -5px rgba(0,0,0,0.2), 0px 4px 8px -3px rgba(0,0,0,0.15)",
      duration: 300,
      ease: "easeOutExpo",
    });
    if (iconContainerRef.current?.querySelector("svg")) {
      animate(iconContainerRef.current.querySelector("svg") as SVGSVGElement, {
        rotateZ: [
          { value: -8, duration: 120, ease: "easeInOutSine" },
          { value: 8, duration: 120, ease: "easeInOutSine" },
          { value: 0, duration: 120, ease: "easeInOutSine" },
        ],
        scale: [
          { value: 1.1, duration: 180, ease: "easeOutSine" },
          { value: 1, duration: 180, ease: "easeInSine" },
        ],
        loop: false,
        duration: 360,
      });
    }
  };

  const handleMouseLeave = () => {
    animate(itemRef.current as HTMLElement, {
      translateY: 0,
      scale: 1,
      boxShadow:
        "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.07)",
      duration: 250,
      ease: "easeOutQuad",
    });
    if (iconContainerRef.current?.querySelector("svg")) {
      animate(iconContainerRef.current.querySelector("svg") as SVGSVGElement, {
        rotateZ: 0,
        scale: 1,
        duration: 200,
        ease: "easeOutQuad",
      });
    }
  };

  return (
    <div
      ref={itemRef}
      className={cn(
        "flex-none snap-start bg-card border border-border/70 rounded-xl p-3 shadow-md",
        "flex flex-col items-center justify-center text-center",
        "w-[110px] md:w-[120px] h-[130px] md:h-[140px]",
        "cursor-default"
      )}
      title={skill.name}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        ref={iconContainerRef}
        className="flex items-center justify-center mb-2 h-10 w-10 md:h-11 md:w-11"
      >
        <Icon
          icon={skill.iconifyString}
          className="size-9 md:size-10"
          style={{ color: effectiveColor }}
          aria-hidden="true"
        />
      </span>
      <span className="text-[11px] md:text-xs font-medium text-foreground/80 leading-tight max-w-[90px] break-words">
        {skill.name}
      </span>
    </div>
  );
};

const MIN_REPETITIONS_FOR_FILL = 5;

const SkillCategoryCarousel: React.FC<{
  categoryData: SkillCategoryData;
  globalIndex: number;
}> = ({ categoryData, globalIndex }) => {
  const categoryRef = useRef<HTMLDivElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const carouselContentRef = useRef<HTMLDivElement>(null);
  const animationInstanceRef = useRef<JSAnimation | null>(null);

  const itemWidthRef = useRef(0);
  const gapRef = useRef(0);
  const singleOriginalSetWidthRef = useRef(0);

  const [itemsToRender, setItemsToRender] = useState<SkillItemData[]>([]);
  const initialFadeInComplete = useRef(false);
  const [isCarouselReady, setIsCarouselReady] = useState(false);
  const isHoveringRef = useRef(false);

  const categoryColor = `hsl(${(globalIndex * 50 + 200) % 360}, 70%, 65%)`;

  const setupCarouselLayout = useCallback(() => {
    if (
      !carouselWrapperRef.current ||
      !carouselContentRef.current ||
      categoryData.skills.length === 0
    ) {
      setIsCarouselReady(false);
      setItemsToRender([]);
      return;
    }

    const isMd = window.matchMedia("(min-width: 768px)").matches;
    itemWidthRef.current = isMd ? 120 : 110;
    gapRef.current = isMd ? 16 : 12;

    singleOriginalSetWidthRef.current =
      (itemWidthRef.current + gapRef.current) * categoryData.skills.length;

    const wrapperWidth = carouselWrapperRef.current.offsetWidth;
    const necessaryRepetitions = Math.max(
      MIN_REPETITIONS_FOR_FILL,
      Math.ceil((wrapperWidth * 2.5) / (singleOriginalSetWidthRef.current || 1))
    );

    const newItemsToRender: SkillItemData[] = [];
    if (categoryData.skills.length > 0) {
      for (let i = 0; i < necessaryRepetitions; i++) {
        newItemsToRender.push(...categoryData.skills);
      }
    }
    setItemsToRender(newItemsToRender);

    carouselContentRef.current.style.minWidth = "max-content";

    if (initialFadeInComplete.current) {
      setIsCarouselReady(true);
    }
  }, [categoryData.skills]);

  useEffect(() => {
    const currentCategoryEl = categoryRef.current;
    if (currentCategoryEl) {
      currentCategoryEl.style.opacity = "0";
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(currentCategoryEl, {
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 600,
                ease: "easeOutExpo",
                delay: globalIndex * 100,
                complete: () => {
                  initialFadeInComplete.current = true;
                  setupCarouselLayout();
                },
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
      );
      observer.observe(currentCategoryEl);
      return () => {
        if (currentCategoryEl) observer.unobserve(currentCategoryEl);
      };
    }
  }, [globalIndex, setupCarouselLayout]);

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (initialFadeInComplete.current) {
          setIsCarouselReady(false);
          requestAnimationFrame(() => {
            setupCarouselLayout();
          });
        }
      }, 250);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [setupCarouselLayout]);

  useEffect(() => {
    const contentEl = carouselContentRef.current;
    if (
      !isCarouselReady ||
      !contentEl ||
      itemsToRender.length === 0 ||
      singleOriginalSetWidthRef.current === 0 ||
      categoryData.skills.length === 0
    ) {
      if (animationInstanceRef.current) {
        animationInstanceRef.current.pause();
        animationInstanceRef.current = null;
      }
      if (contentEl) contentEl.style.transform = "translateX(0px)";
      return;
    }

    if (animationInstanceRef.current) {
      animationInstanceRef.current.pause();
      animationInstanceRef.current = null;
    }

    const distanceToAnimateForLoop = singleOriginalSetWidthRef.current;
    const animationDuration = categoryData.skills.length * 6000;

    if (
      distanceToAnimateForLoop <= 0 ||
      animationDuration <= 0 ||
      isNaN(distanceToAnimateForLoop) ||
      isNaN(animationDuration)
    ) {
      if (contentEl) contentEl.style.transform = "translateX(0px)";
      return;
    }

    const isForwardDirection = globalIndex % 2 === 0;
    let translateXParams: [string, string];

    if (isForwardDirection) {
      contentEl.style.transform = "translateX(0px)";
      translateXParams = ["0px", `-${distanceToAnimateForLoop}px`];
    } else {
      contentEl.style.transform = `translateX(-${distanceToAnimateForLoop}px)`;
      translateXParams = [`-${distanceToAnimateForLoop}px`, "0px"];
    }

    animationInstanceRef.current = animate(contentEl, {
      translateX: translateXParams,
      duration: animationDuration,
      easing: "linear",
      loop: true,
      autoplay: !isHoveringRef.current,
    });

    return () => {
      if (animationInstanceRef.current) {
        animationInstanceRef.current.pause();
        animationInstanceRef.current = null;
      }
    };
  }, [isCarouselReady, itemsToRender, categoryData.skills.length, globalIndex]);

  const handleCarouselMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    if (animationInstanceRef.current) {
      animationInstanceRef.current.pause();
    }
  }, []);

  const handleCarouselMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    if (
      animationInstanceRef.current &&
      isCarouselReady &&
      itemsToRender.length > 0
    ) {
      animationInstanceRef.current.play();
    }
  }, [isCarouselReady, itemsToRender.length]);

  if (categoryData.skills.length === 0) {
    return null;
  }

  const CategoryIcon = categoryData.categoryIcon;

  return (
    <div ref={categoryRef} className="mb-12 md:mb-16" style={{ opacity: 0 }}>
      <div className="flex items-center mb-6 md:mb-7">
        <CategoryIcon className="mr-3 md:mr-3.5 size-7 md:size-8 text-primary" />
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">
          {categoryData.category}
        </h3>
      </div>
      <div
        ref={carouselWrapperRef}
        className="relative overflow-x-hidden group py-2 -my-2"
        onMouseEnter={handleCarouselMouseEnter}
        onMouseLeave={handleCarouselMouseLeave}
      >
        <div
          ref={carouselContentRef}
          className="flex gap-x-3 md:gap-x-4"
          style={{ willChange: "transform" }}
        >
          {itemsToRender.map((skill, idx) => (
            <SkillItemDisplay
              key={`${skill.iconifyString}-${
                skill.name
              }-${idx}-${globalIndex}-rep${
                categoryData.skills.length > 0
                  ? Math.floor(idx / categoryData.skills.length)
                  : 0
              }`}
              skill={skill}
              itemColor={categoryColor}
            />
          ))}
        </div>
        {itemsToRender.length > 0 && (
          <>
            <div className="absolute top-0 -left-5.5 h-full w-12 bg-gradient-to-r from-background via-background/80 to-transparent dark:from-secondary/5 dark:via-secondary/5/80 pointer-events-none opacity-100 group-hover:opacity-30 transition-opacity z-10"></div>
            <div className="absolute top-0 -right-5.5 h-full w-12 bg-gradient-to-l from-background via-background/80 to-transparent dark:from-secondary/5 dark:via-secondary/5/80 pointer-events-none opacity-100 group-hover:opacity-30 transition-opacity z-10"></div>
          </>
        )}
      </div>
    </div>
  );
};

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const animatedHeading = useRef(false);

  useEffect(() => {
    const currentHeadingRef = headingRef.current;
    if (currentHeadingRef) {
      currentHeadingRef.style.opacity = "0";
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !animatedHeading.current) {
              animate(currentHeadingRef, {
                opacity: [0, 1],
                translateY: [25, 0],
                filter: ["blur(3px)", "blur(0px)"],
                duration: 750,
                ease: "easeOutExpo",
              });
              animatedHeading.current = true;
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
      );
      observer.observe(currentHeadingRef);
      return () => {
        if (currentHeadingRef) observer.unobserve(currentHeadingRef);
      };
    }
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="bg-background dark:bg-secondary/5 py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <h2
          ref={headingRef}
          className="mb-16 md:mb-20 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
          style={{ opacity: 0 }}
        >
          My <span className="text-primary">Technical Toolkit</span>
        </h2>
        <div>
          {skillsData.map((category, idx) => (
            <SkillCategoryCarousel
              key={category.category + idx}
              categoryData={category}
              globalIndex={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
