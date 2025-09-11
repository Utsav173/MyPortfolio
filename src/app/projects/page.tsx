const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khatriutsav.com';

import { Project } from '@/lib/types';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { Metadata } from 'next';
import projectsData from '@/lib/projects-data';
import { PageWrapper } from '@/components/layout/PageWrapper';

const FEATURED_PROJECT_IDS: (number | string)[] = [
  727342843, 657660151, 952619337, 525828811, 998877665, 583853098,
];

async function getProjects(): Promise<Project[]> {
  let projects: Project[] = projectsData as Project[];

  projects.sort((a, b) => {
    const aFeaturedIndex = FEATURED_PROJECT_IDS.indexOf(a.id);
    const bFeaturedIndex = FEATURED_PROJECT_IDS.indexOf(b.id);

    if (aFeaturedIndex !== -1 && bFeaturedIndex !== -1) {
      return aFeaturedIndex - bFeaturedIndex;
    }
    if (aFeaturedIndex !== -1) return -1;
    if (bFeaturedIndex !== -1) return 1;

    const aHasImage = !!a.imageUrl;
    const bHasImage = !!b.imageUrl;
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;

    const aStars = a.githubStats?.stars || 0;
    const bStars = b.githubStats?.stars || 0;
    if (bStars !== aStars) {
      return bStars - aStars;
    }

    return a.name.localeCompare(b.name);
  });

  return projects;
}

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A collection of projects by Utsav Khatri, showcasing skills in full-stack development, AI, and more.',
  keywords: [
    'Projects',
    'Portfolio',
    'Full Stack Development',
    'Web Applications',
    'AI Projects',
    'Mobile Apps',
    'Open Source',
    'Next.js Projects',
    'React Projects',
    'Node.js Projects',
  ],
};

const projectsCollectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: "Utsav Khatri's Projects",
  description:
    'A comprehensive collection of web development, AI, and cloud projects by Utsav Khatri.',
  url: `${siteUrl}/projects`,
};

export default async function ProjectsPage() {
  const allProjectsData = await getProjects();

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsCollectionSchema) }}
        key="projects-collection-jsonld"
      />
      <ProjectsSection
        id="projects"
        className="content-section"
        initialProjects={allProjectsData}
      />
    </PageWrapper>
  );
}
