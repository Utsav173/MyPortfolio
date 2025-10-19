'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Code2, Server, Database, Cloud, Brain, Wrench } from 'lucide-react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { TECH_STACK_DETAILS } from '@/lib/tech-stack-data';

interface SkillItemData {
  name: string;
  iconifyString: string;
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
      { name: 'Shadcn/UI', iconifyString: 'simple-icons:shadcnui' },
      { name: 'Material-UI', iconifyString: 'logos:material-ui' },
      { name: 'Chakra UI', iconifyString: 'devicon:chakraui' },
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
      { name: 'Hono.js', iconifyString: 'logos:hono' },
      { name: 'Express.js', iconifyString: 'simple-icons:express' },
      { name: 'RESTful APIs', iconifyString: 'mdi:api' },
      { name: 'GraphQL', iconifyString: 'logos:graphql' },
      { name: 'Microservices', iconifyString: 'carbon:microservices-1' },
      { name: 'WebSockets', iconifyString: 'logos:socket-io' },
      { name: 'Serverless', iconifyString: 'logos:aws-lambda' },
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
      { name: 'Drizzle ORM', iconifyString: 'simple-icons:drizzle' },
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
      { name: 'Generative AI', iconifyString: 'carbon:machine-learning-model' },
      { name: 'LLMs', iconifyString: 'fluent:brain-circuit-24-regular' },
      { name: 'API Security', iconifyString: 'material-symbols:security' },
      { name: 'Performance Opt.', iconifyString: 'fluent-mdl2:speed-high' },
      { name: 'Scalability', iconifyString: 'mdi:chart-gantt' },
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
      { name: 'Agile/Scrum', iconifyString: 'mdi:account-group-outline' },
      { name: 'TDD', iconifyString: 'mdi:test-tube' },
      { name: 'Photoshop', iconifyString: 'logos:adobe-photoshop' },
      { name: 'Canva', iconifyString: 'devicon:canva' },
      { name: 'Illustrator', iconifyString: 'logos:adobe-illustrator' },
      { name: 'Filmora', iconifyString: 'simple-icons:wondersharefilmora' },
      { name: 'Notion', iconifyString: 'logos:notion-icon' },
    ],
  },
];

const SkillItem = ({ skill, resolvedTheme }: { skill: SkillItemData; resolvedTheme?: string }) => {
  const techDetail = TECH_STACK_DETAILS[skill.name.toLowerCase()];
  const brandColor = techDetail
    ? resolvedTheme === 'dark'
      ? techDetail.darkmodecolor
      : techDetail.color
    : 'oklch(var(--muted-foreground))';

  return (
    <div
      className="skill-card"
      style={{ '--brand-color': brandColor } as React.CSSProperties}
      title={skill.name}
    >
      <Icon icon={skill.iconifyString} className="skill-icon" color={brandColor} />
      <span className="skill-name">{skill.name}</span>
    </div>
  );
};

const SkillCarousel = ({
  categoryData,
  isReverse,
  resolvedTheme,
}: {
  categoryData: SkillCategoryData;
  isReverse: boolean;
  resolvedTheme?: string;
}) => {
  const CategoryIcon = categoryData.categoryIcon;
  const duration = categoryData.skills.length * 3.5;

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <CategoryIcon className="category-icon" />
        <h3 className="category-title">{categoryData.category}</h3>
      </div>

      <div className="carousel-container">
        <div
          className={cn('carousel-track', isReverse && 'reverse')}
          style={{ '--duration': `${duration}s` } as React.CSSProperties}
        >
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="carousel-set" aria-hidden={setIndex === 1}>
              {categoryData.skills.map((skill, idx) => (
                <SkillItem
                  key={`${skill.name}-${idx}`}
                  skill={skill}
                  resolvedTheme={resolvedTheme}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function SkillsSection({ className, id }: { className?: string; id?: string }) {
  const { theme } = useTheme();

  return (
    <section id={id} className={cn('skills-section', className)}>
      <div className="skills-container">
        <h2 className="skills-heading">
          My <span className="highlight">Technical Toolkit</span>
        </h2>

        <div className="skills-content">
          {skillsData.map((category, idx) => (
            <SkillCarousel
              key={category.category}
              categoryData={category}
              isReverse={idx % 2 !== 0}
              resolvedTheme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
