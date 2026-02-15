import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { skillsData, SkillItemData } from '@/lib/skills-data';
import projectsData from '@/lib/projects-data';
import { Project } from '@/lib/types';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SITE_URL } from '@/lib/config';
import { Icon } from '@iconify/react';
import { TECH_STACK_DETAILS } from '@/lib/tech-stack-data';
import { ProjectCard } from '@/components/sections/ProjectCard';
import slugify from 'slugify';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SkillPageProps {
  params: Promise<{ slug: string }>;
}

function getSkillBySlug(slug: string): SkillItemData | undefined {
  const allSkills = skillsData.flatMap((category) => category.skills);
  return allSkills.find((skill) => slugify(skill.name, { lower: true }) === slug);
}

function getProjectsBySkill(skillName: string): Project[] {
  // Normalize skill name for comparison (e.g. "React.js" -> "react")
  const normalizedSkillName = skillName.toLowerCase().replace(/\.js$/, ''); // Handle "Node.js" vs "Node"

  return (projectsData as Project[]).filter((project) =>
    project.techStack.some((tech) => {
      const normalizedTech = tech.toLowerCase().replace(/\.js$/, '');
      return (
        normalizedTech.includes(normalizedSkillName) || normalizedSkillName.includes(normalizedTech)
      );
    })
  );
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    return {
      title: 'Skill Not Found',
    };
  }

  const projects = getProjectsBySkill(skill.name);
  const title = `Hire ${skill.name} Developer | Utsav Khatri Portfolio`;
  const description = `Discover ${projects.length} projects built with ${skill.name} by Utsav Khatri. Explore my expertise in ${skill.name} development.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/skills/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/skills/${slug}`,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const allSkills = skillsData.flatMap((category) => category.skills);
  return allSkills.map((skill) => ({
    slug: slugify(skill.name, { lower: true }),
  }));
}

export default async function SkillPage({ params }: SkillPageProps) {
  const slug = (await params).slug;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  const projects = getProjectsBySkill(skill.name);
  const techDetail = TECH_STACK_DETAILS[skill.name.toLowerCase()];
  const brandColor = techDetail ? techDetail.color : '#ffffff';

  const skillSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${skill.name} Projects`,
    description: `Projects built using ${skill.name}`,
    url: `${SITE_URL}/skills/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/projects/${project.id}`,
        name: project.name,
      })),
    },
  };

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skillSchema) }}
        key="skill-jsonld"
      />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <Link href="/#skills">
          <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Skills
          </Button>
        </Link>

        <header className="mb-12 flex flex-col items-center text-center">
          <div
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/30 p-4 backdrop-blur-sm"
            style={{ color: brandColor }}
          >
            <Icon icon={skill.iconifyString} width={48} height={48} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {skill.name} <span className="text-muted-foreground">Projects</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {projects.length > 0
              ? `I have built ${projects.length} project${projects.length === 1 ? '' : 's'} leveraging ${skill.name}. Check them out below.`
              : `I have extensive knowledge in ${skill.name}, though I haven't listed specific projects for it yet.`}
          </p>
        </header>

        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">No specific projects listed for this skill yet.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
