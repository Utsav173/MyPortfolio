import { PageWrapper } from '@/components/layout/PageWrapper';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SITE_URL } from '@/lib/config';
import projectsData from '@/lib/projects-data';
import { Project } from '@/lib/types';
import { Metadata } from 'next';

const FEATURED_PROJECT_IDS: (number | string)[] = [
  1007, 727342843, 657660151, 952619337, 525828811, 998877665, 583853098,
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
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
  openGraph: {
    title: 'Projects',
    description:
      'A collection of projects by Utsav Khatri, showcasing skills in full-stack development, AI, and more.',
    url: `${SITE_URL}/projects`,
  },
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
  url: `${SITE_URL}/projects`,
};

export default async function ProjectsPage() {
  const allProjectsData = await getProjects();

  return (
    <PageWrapper>
      <h1 className="sr-only">Projects</h1>
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
