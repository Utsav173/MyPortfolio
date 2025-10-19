import { SkillsSection } from '@/components/sections/SkillsSection';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/layout/PageWrapper';

const skills = [
  'React.js',
  'Next.js',
  'Redux',
  'TypeScript',
  'JavaScript (ES6+)',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'Shadcn/UI',
  'Material-UI',
  'Node.js',
  'Bun.js',
  'Hono.js',
  'Express.js',
  'RESTful APIs',
  'GraphQL',
  'Microservices',
  'WebSockets',
  'Serverless',
  'PostgreSQL',
  'MongoDB',
  'MySQL',
  'Convex',
  'Redis',
  'Firebase',
  'Drizzle ORM',
  'Prisma',
  'Cloudflare',
  'Vercel',
  'AWS',
  'Netlify',
  'CI/CD (GitHub Actions)',
  'Docker',
  'Git',
  'Generative AI',
  'LLMs',
  'API Security',
  'Performance Opt.',
  'Scalability',
  'VS Code',
  'Postman',
  'Swagger/OpenAPI',
  'Figma',
  'Jira',
  'Agile/Scrum',
  'TDD',
];

export const metadata: Metadata = {
  title: 'Skills',
  description:
    'Explore the technical toolkit of Utsav Khatri, including expertise in frontend, backend, databases, cloud technologies, and AI.',
  keywords: skills,
};

const skillsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: "Utsav Khatri's Technical Skills",
  description: 'A list of technical skills and technologies Utsav Khatri is proficient in.',
  itemListElement: skills.map((skill, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: skill,
  })),
};

export default function SkillsPage() {
  return (
    <PageWrapper>
      <h1 className="sr-only">Skills</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skillsSchema) }}
        key="skills-jsonld"
      />
      <SkillsSection id="skills" />
    </PageWrapper>
  );
}
