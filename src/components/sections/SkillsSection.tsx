'use client';

import React, { useMemo, memo } from 'react';
import { useTheme } from 'next-themes';
import { motion, useReducedMotion, Variants } from 'motion/react';
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
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { TECH_STACK_DETAILS } from '@/lib/tech-stack-data';

interface SkillItemData {
  name: string;
  iconifyString: string;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
  invertInLightMode?: boolean;
}

interface SkillCategoryData {
  category: string;
  categoryIcon: React.ComponentType<{ className?: string }>;
  skills: SkillItemData[];
}

const skillsData: SkillCategoryData[] = [
  {
    category: 'Frontend',
    categoryIcon: Code2,
    skills: [
      { name: 'React.js', iconifyString: 'logos:react' },
      { name: 'Next.js', iconifyString: 'teenyicons:nextjs-outline' },
      { name: 'Redux', iconifyString: 'logos:redux' },
      { name: 'TypeScript', iconifyString: 'logos:typescript-icon' },
      { name: 'JavaScript (ES6+)', iconifyString: 'logos:javascript' },
      { name: 'HTML5', iconifyString: 'logos:html-5' },
      { name: 'CSS3', iconifyString: 'logos:css-3' },
      { name: 'Tailwind CSS', iconifyString: 'logos:tailwindcss-icon' },
      {
        name: 'Shadcn/UI',
        iconifyString: 'simple-icons:shadcnui',
        fallbackIcon: LayoutPanelLeft,
      },
      { name: 'Material-UI', iconifyString: 'logos:material-ui' },
      { name: 'Chkra UI', iconifyString: 'devicon:chakraui' },
      { name: 'Radix UI', iconifyString: 'simple-icons:radixui' },
      { name: 'SCSS', iconifyString: 'vscode-icons:file-type-scss' },
    ],
  },
  {
    category: 'Backend',
    categoryIcon: Server,
    skills: [
      { name: 'Node.js', iconifyString: 'logos:nodejs-icon' },
      { name: 'Bun.js', iconifyString: 'logos:bun' },
      { name: 'Hono.js', iconifyString: 'logos:hono', fallbackIcon: Zap },
      { name: 'Express.js', iconifyString: 'simple-icons:express' },
      { name: 'RESTful APIs', iconifyString: 'mdi:api', fallbackIcon: GitFork },
      { name: 'GraphQL', iconifyString: 'logos:graphql' },
      {
        name: 'Microservices',
        iconifyString: 'carbon:microservices-1',
        fallbackIcon: Users,
      },
      {
        name: 'WebSockets',
        iconifyString: 'logos:socket-io',
        fallbackIcon: Zap,
      },
      {
        name: 'Serverless',
        iconifyString: 'logos:aws-lambda',
        fallbackIcon: Cloud,
      },
    ],
  },
  {
    category: 'Databases',
    categoryIcon: Database,
    skills: [
      { name: 'PostgreSQL', iconifyString: 'logos:postgresql' },
      { name: 'MongoDB', iconifyString: 'logos:mongodb-icon' },
      { name: 'MySQL', iconifyString: 'logos:mysql' },
      { name: 'Convex', iconifyString: 'solar:database-bold' },
      { name: 'Redis', iconifyString: 'logos:redis' },
      { name: 'Firebase', iconifyString: 'vscode-icons:file-type-firebase' },
      {
        name: 'Drizzle ORM',
        iconifyString: 'simple-icons:drizzle',
        fallbackIcon: Database,
      },
      { name: 'Prisma', iconifyString: 'simple-icons:prisma' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    categoryIcon: Cloud,
    skills: [
      { name: 'Cloudflare', iconifyString: 'logos:cloudflare-icon' },
      { name: 'Vercel', iconifyString: 'ion:logo-vercel' },
      { name: 'AWS', iconifyString: 'logos:aws' },
      { name: 'Netlify', iconifyString: 'logos:netlify-icon' },
      { name: 'CI/CD (GitHub Actions)', iconifyString: 'logos:github-actions' },
      { name: 'Docker', iconifyString: 'logos:docker-icon' },
      { name: 'Git', iconifyString: 'logos:git-icon' },
    ],
  },
  {
    category: 'AI & Special Interests',
    categoryIcon: Brain,
    skills: [
      {
        name: 'Generative AI',
        iconifyString: 'carbon:machine-learning-model',
        fallbackIcon: Lightbulb,
      },
      {
        name: 'LLMs',
        iconifyString: 'fluent:brain-circuit-24-regular',
        fallbackIcon: BotMessageSquare,
      },
      {
        name: 'API Security',
        iconifyString: 'material-symbols:security',
        fallbackIcon: ShieldCheck,
      },
      {
        name: 'Performance Opt.',
        iconifyString: 'fluent-mdl2:speed-high',
        fallbackIcon: Zap,
      },
      {
        name: 'Scalability',
        iconifyString: 'mdi:chart-gantt',
        fallbackIcon: Scaling,
      },
    ],
  },
  {
    category: 'Tools & Methodologies',
    categoryIcon: Wrench,
    skills: [
      { name: 'VS Code', iconifyString: 'logos:visual-studio-code' },
      { name: 'Postman', iconifyString: 'logos:postman-icon' },
      { name: 'Swagger/OpenAPI', iconifyString: 'logos:swagger' },
      { name: 'Figma', iconifyString: 'logos:figma' },
      { name: 'Jira', iconifyString: 'logos:jira' },
      {
        name: 'Agile/Scrum',
        iconifyString: 'mdi:account-group-outline',
        fallbackIcon: Users,
      },
      { name: 'TDD', iconifyString: 'mdi:test-tube', fallbackIcon: ListChecks },
      { name: 'Photoshop', iconifyString: 'logos:adobe-photoshop' },
      { name: 'Canva', iconifyString: 'devicon:canva' },
      { name: 'Illustrator', iconifyString: 'logos:adobe-illustrator' },
      { name: 'Filmora', iconifyString: 'simple-icons:wondersharefilmora' },
      { name: 'Notion', iconifyString: 'logos:notion-icon' },
    ],
  },
];

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
  hidden: { opacity: 0, y: 25, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.25, 1, 0.5, 1] },
  },
};

const SkillItemDisplay = memo<{
  skill: SkillItemData;
  resolvedTheme?: string | undefined;
}>(({ skill, resolvedTheme }) => {
  const techDetail = TECH_STACK_DETAILS[skill.name.toLowerCase()];
  const brandColor = techDetail ? techDetail.color : 'oklch(var(--primary))';

  return (
    <div
      className={cn(
        'group/item relative flex flex-col items-center justify-center text-center',
        'w-[110px] md:w-[120px] h-[130px] md:h-[140px] rounded-2xl',
        'bg-card border border-border transition-all duration-300 ease-out',
        'hover:-translate-y-1.5',
        'hover:border-[var(--brand-color)]/80',
        'hover:shadow-lg hover:shadow-[var(--brand-color)]/10'
      )}
      style={{ '--brand-color': brandColor } as React.CSSProperties}
      title={skill.name}
    >
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div
          className="mb-2.5 transition-transform duration-300 group-hover/item:scale-110"
          style={{ color: brandColor }}
        >
          <Icon
            icon={skill.iconifyString}
            className={cn('size-9 md:size-10')}
            aria-hidden="true"
            {...(techDetail?.darkmodecolor && resolvedTheme === 'dark'
              ? {
                  color: techDetail.darkmodecolor,
                }
              : {})}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground group-hover/item:text-foreground transition-colors duration-300 leading-tight max-w-[90px] break-words">
          {skill.name}
        </span>
      </div>
    </div>
  );
});
SkillItemDisplay.displayName = 'SkillItemDisplay';

const SkillCategoryCarousel = memo<{
  categoryData: SkillCategoryData;
  globalIndex: number;
  resolvedTheme?: string | undefined;
}>(({ categoryData, globalIndex, resolvedTheme }) => {
  const shouldReduceMotion = useReducedMotion();

  const duration = useMemo(() => categoryData.skills.length * 4, [categoryData.skills.length]);

  const isReverse = globalIndex % 2 !== 0;

  if (categoryData.skills.length === 0) return null;
  const CategoryIcon = categoryData.categoryIcon;

  return (
    <motion.div
      className="mb-12 md:mb-16"
      custom={globalIndex}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
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
        className="group relative w-full overflow-hidden gradient-fade-container"
        aria-label={`${categoryData.category} skills carousel`}
        role="region"
      >
        <div
          className={cn(
            'flex min-w-max group-hover:[animation-play-state:paused]',
            isReverse
              ? 'animate-[marquee-reverse_var(--duration)_linear_infinite]'
              : 'animate-[marquee_var(--duration)_linear_infinite]'
          )}
          style={
            {
              '--duration': `${duration}s`,
            } as React.CSSProperties
          }
        >
          {/* Render the first set of items */}
          {categoryData.skills.map((skill, idx) => (
            <div className="shrink-0 px-2 py-2" key={`${skill.name}-${idx}-a`}>
              <SkillItemDisplay skill={skill} resolvedTheme={resolvedTheme} />
            </div>
          ))}

          {/* Render the second, identical set for the seamless loop */}
          {categoryData.skills.map((skill, idx) => (
            <div className="shrink-0 px-2 py-2" key={`${skill.name}-${idx}-b`} aria-hidden="true">
              <SkillItemDisplay skill={skill} resolvedTheme={resolvedTheme} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
SkillCategoryCarousel.displayName = 'SkillCategoryCarousel';

export function SkillsSection({ className, id }: { className?: string; id?: string }) {
  const { resolvedTheme } = useTheme();
  return (
    <section
      id={id}
      className={cn('bg-background dark:bg-secondary/5 py-16 md:py-24 w-full', className)}
      aria-labelledby="skills-heading"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          id="skills-heading"
          initial={useReducedMotion() ? false : 'hidden'}
          whileInView={useReducedMotion() ? undefined : 'visible'}
          variants={headingSectionVariants}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16 md:mb-20 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
        >
          My <span className="text-primary">Technical Toolkit</span>
        </motion.h2>
        <div className="max-sm:w-full max-w-7xl mx-auto">
          {skillsData.map((category, idx) => (
            <SkillCategoryCarousel
              key={`${category.category}-${idx}`}
              categoryData={category}
              globalIndex={idx}
              resolvedTheme={resolvedTheme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
