import { Code2, Server, Database, Cloud, Brain, Wrench } from 'lucide-react';
import React from 'react';

export interface SkillItemData {
  name: string;
  iconifyString: string;
}

export interface SkillCategoryData {
  category: string;
  categoryIcon: React.ComponentType<{ className?: string }>;
  skills: SkillItemData[];
}

export const skillsData: SkillCategoryData[] = [
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
      { name: 'Convex', iconifyString: 'simple-icons:convex' },
      { name: 'Redis', iconifyString: 'logos:redis' },
      { name: 'Firebase', iconifyString: 'vscode-icons:file-type-firebase' },
      { name: 'Drizzle ORM', iconifyString: 'simple-icons:drizzle' },
      { name: 'Prisma', iconifyString: 'simple-icons:prisma' },
      { name: 'Supabase', iconifyString: 'devicon:supabase' },
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
