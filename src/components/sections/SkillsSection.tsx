"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  motion,
  useReducedMotion,
  Variants,
  useAnimationControls,
} from "motion/react";
import {
  Code2,
  Server,
  Database,
  Cloud,
  Brain,
  Wrench,
  Users,
  GitFork,
  Zap,
  Scaling,
  ListChecks,
  ShieldCheck,
  Lightbulb,
  BotMessageSquare,
  LayoutPanelLeft,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface SkillItemData {
  name: string;
  iconifyString: string;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
}

interface SkillCategoryData {
  category: string;
  categoryIcon: React.ComponentType<{ className?: string }>;
  skills: SkillItemData[];
}

// Memoized skills data to prevent recreation on each render
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

// Memoized animation variants to prevent recreation
const skillItemHoverVariants: Variants = {
  hover: {
    y: -8,
    scale: 1.05,
    boxShadow:
      "0px 10px 20px -5px rgba(0,0,0,0.2), 0px 4px 8px -3px rgba(0,0,0,0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  initial: {
    y: 0,
    scale: 1,
    boxShadow:
      "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.07)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const iconHoverVariants: Variants = {
  hover: {
    rotate: [0, -8, 8, 0],
    scale: [1, 1.1, 1],
    transition: {
      rotate: { duration: 0.36, ease: "easeInOut" },
      scale: { duration: 0.36, ease: "easeInOut" },
    },
  },
  initial: { rotate: 0, scale: 1 },
};

const categoryVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1],
      delay: i * 0.1,
    },
  }),
};

const headingSectionVariants: Variants = {
  hidden: { opacity: 0, y: 25, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.25, 1, 0.5, 1] },
  },
};

const MIN_REPETITIONS_FOR_FILL = 5;

// Memoized SkillItemDisplay component
const SkillItemDisplay = React.memo<{
  skill: SkillItemData;
  itemColor: string;
  shouldReduceMotion: boolean | null;
}>(({ skill, itemColor, shouldReduceMotion }) => {
  const memoizedStyle = useMemo(() => ({ color: itemColor }), [itemColor]);

  return (
    <motion.div
      className={cn(
        "flex-none snap-start bg-card border border-border/70 rounded-xl p-3 shadow-md",
        "flex flex-col items-center justify-center text-center",
        "w-[110px] md:w-[120px] h-[130px] md:h-[140px]",
        "cursor-default z-10"
      )}
      title={skill.name}
      initial={shouldReduceMotion ? false : "initial"}
      whileHover={shouldReduceMotion ? undefined : "hover"}
      variants={shouldReduceMotion ? {} : skillItemHoverVariants}
    >
      <motion.span
        className="flex items-center justify-center mb-2 h-10 w-10 md:h-11 md:w-11"
        variants={shouldReduceMotion ? {} : iconHoverVariants}
      >
        <Icon
          icon={skill.iconifyString}
          className="size-9 md:size-10"
          style={memoizedStyle}
          aria-hidden="true"
        />
      </motion.span>
      <span className="text-[11px] md:text-xs font-medium text-foreground/80 leading-tight max-w-[90px] break-words">
        {skill.name}
      </span>
    </motion.div>
  );
});

SkillItemDisplay.displayName = "SkillItemDisplay";

// Custom hook for carousel logic
const useCarouselLogic = (
  categoryData: SkillCategoryData,
  globalIndex: number
) => {
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const carouselContentRef = useRef<HTMLDivElement>(null);
  const [itemsToRender, setItemsToRender] = useState<SkillItemData[]>([]);
  const [isReadyToAnimate, setIsReadyToAnimate] = useState(false);
  const isHoveringRef = useRef(false);
  const animationControls = useAnimationControls();
  const shouldReduceMotion = useReducedMotion();

  // Memoized values for performance
  const itemWidth = useMemo(
    () =>
      typeof window === "undefined" ||
      (typeof document === "undefined" &&
        window?.matchMedia?.("(min-width: 768px)").matches)
        ? 120
        : 110,
    []
  );
  const gap = useMemo(
    () =>
      typeof window === "undefined" ||
      (typeof document === "undefined" &&
        window?.matchMedia?.("(min-width: 768px)").matches)
        ? 16
        : 12,
    []
  );

  const singleOriginalSetWidth = useMemo(() => {
    return (itemWidth + gap) * categoryData.skills.length - gap;
  }, [itemWidth, gap, categoryData.skills.length]);

  const setupCarouselLayout = useCallback(() => {
    if (!carouselWrapperRef.current || categoryData.skills.length === 0) {
      setIsReadyToAnimate(false);
      setItemsToRender([]);
      return;
    }

    const wrapperWidth = carouselWrapperRef.current.offsetWidth;
    const necessaryRepetitions = Math.max(
      MIN_REPETITIONS_FOR_FILL,
      Math.ceil((wrapperWidth * 2.5) / (singleOriginalSetWidth + gap || 1))
    );

    const newItemsToRender: SkillItemData[] = [];
    for (let i = 0; i < necessaryRepetitions; i++) {
      newItemsToRender.push(...categoryData.skills);
    }

    setItemsToRender(newItemsToRender);
    setIsReadyToAnimate(true);
  }, [categoryData.skills, singleOriginalSetWidth, gap]);

  // Throttled resize handler
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    setupCarouselLayout();
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(setupCarouselLayout, 150); // Reduced debounce time
    };

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    mediaQuery.addEventListener("change", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      mediaQuery.removeEventListener("change", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [setupCarouselLayout]);

  // Animation effect with cleanup
  useEffect(() => {
    if (shouldReduceMotion || !isReadyToAnimate || itemsToRender.length === 0) {
      animationControls.stop();
      return;
    }

    const distanceToAnimateForLoop = singleOriginalSetWidth + gap;
    const animationDuration = categoryData.skills.length * 7;
    const isForwardDirection = globalIndex % 2 === 0;

    const fromX = isForwardDirection ? 0 : -distanceToAnimateForLoop;
    const toX = isForwardDirection ? -distanceToAnimateForLoop : 0;

    animationControls.start({
      x: [fromX, toX],
      transition: {
        duration: animationDuration,
        ease: "linear",
        repeat: Infinity,
      },
    });

    return () => animationControls.stop();
  }, [
    isReadyToAnimate,
    itemsToRender.length,
    categoryData.skills.length,
    globalIndex,
    animationControls,
    shouldReduceMotion,
    singleOriginalSetWidth,
    gap,
  ]);

  const handleCarouselMouseEnter = useCallback(() => {
    if (shouldReduceMotion) return;
    isHoveringRef.current = true;
    animationControls.stop();
  }, [animationControls, shouldReduceMotion]);

  const handleCarouselMouseLeave = useCallback(() => {
    if (shouldReduceMotion || !isReadyToAnimate) return;

    isHoveringRef.current = false;
    const distanceToAnimateForLoop = singleOriginalSetWidth + gap;
    const animationDuration = categoryData.skills.length * 7;
    const isForwardDirection = globalIndex % 2 === 0;

    // Get current position more efficiently
    const currentTransform = carouselContentRef.current?.style.transform || "";
    const match = currentTransform.match(/translateX\(([^)]+)\)/);
    const currentX = match ? parseFloat(match[1]) : 0;

    const targetX = isForwardDirection ? -distanceToAnimateForLoop : 0;
    const remainingDistance = Math.abs(currentX - targetX);
    const remainingDurationFraction =
      remainingDistance / distanceToAnimateForLoop;

    animationControls.start({
      x: targetX,
      transition: {
        duration: animationDuration * remainingDurationFraction,
        ease: "linear",
        onComplete: () => {
          if (!isHoveringRef.current) {
            const loopValues = isForwardDirection
              ? [0, -distanceToAnimateForLoop]
              : [-distanceToAnimateForLoop, 0];

            animationControls.start({
              x: loopValues,
              transition: {
                duration: animationDuration,
                ease: "linear",
                repeat: Infinity,
              },
            });
          }
        },
      },
    });
  }, [
    animationControls,
    isReadyToAnimate,
    globalIndex,
    categoryData.skills.length,
    shouldReduceMotion,
    singleOriginalSetWidth,
    gap,
  ]);

  return {
    carouselWrapperRef,
    carouselContentRef,
    itemsToRender,
    animationControls,
    handleCarouselMouseEnter,
    handleCarouselMouseLeave,
    shouldReduceMotion,
  };
};

// Memoized SkillCategoryCarousel component
const SkillCategoryCarousel = React.memo<{
  categoryData: SkillCategoryData;
  globalIndex: number;
}>(({ categoryData, globalIndex }) => {
  const {
    carouselWrapperRef,
    carouselContentRef,
    itemsToRender,
    animationControls,
    handleCarouselMouseEnter,
    handleCarouselMouseLeave,
    shouldReduceMotion,
  } = useCarouselLogic(categoryData, globalIndex);

  // Memoized category color
  const categoryColor = useMemo(
    () => `hsl(${(globalIndex * 50 + 200) % 360}, 70%, 65%)`,
    [globalIndex]
  );

  if (categoryData.skills.length === 0) {
    return null;
  }

  const CategoryIcon = categoryData.categoryIcon;

  return (
    <motion.div
      className="mb-12 md:mb-16"
      custom={globalIndex}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      variants={shouldReduceMotion ? {} : categoryVariants}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="flex items-center mb-6 md:mb-7">
        <CategoryIcon className="mr-3 md:mr-3.5 size-7 md:size-8 text-primary" />
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">
          {categoryData.category}
        </h3>
      </div>
      <div
        ref={carouselWrapperRef}
        className="relative overflow-x-hidden group py-2 -my-2 w-full"
        onMouseEnter={handleCarouselMouseEnter}
        onMouseLeave={handleCarouselMouseLeave}
      >
        <motion.div
          ref={carouselContentRef}
          className="flex gap-x-3 md:gap-x-4 py-2"
          style={{ minWidth: "max-content", willChange: "transform" }}
          animate={animationControls}
        >
          {itemsToRender.map((skill, idx) => (
            <SkillItemDisplay
              key={`${skill.iconifyString}-${skill.name}-${idx}-${globalIndex}`}
              skill={skill}
              itemColor={categoryColor}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>
        {!shouldReduceMotion && itemsToRender.length > 0 && (
          <>
            <div className="absolute top-0 -left-5.5 h-full w-12 bg-gradient-to-r from-background via-background/80 to-transparent dark:from-secondary/5 dark:via-secondary/5/80 pointer-events-none opacity-100 group-hover:opacity-30 transition-opacity z-10" />
            <div className="absolute top-0 -right-5.5 h-full w-12 bg-gradient-to-l from-background via-background/80 to-transparent dark:from-secondary/5 dark:via-secondary/5/80 pointer-events-none opacity-100 group-hover:opacity-30 transition-opacity z-10" />
          </>
        )}
      </div>
    </motion.div>
  );
});

SkillCategoryCarousel.displayName = "SkillCategoryCarousel";

export function SkillsSection({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id={id}
      className={cn(
        "bg-background dark:bg-secondary/5 py-16 md:py-24 w-full",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? {} : headingSectionVariants}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16 md:mb-20 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
        >
          My <span className="text-primary">Technical Toolkit</span>
        </motion.h2>
        <div>
          {skillsData.map((category, idx) => (
            <SkillCategoryCarousel
              key={`${category.category}-${idx}`}
              categoryData={category}
              globalIndex={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
