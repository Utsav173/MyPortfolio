
import { promises as fs } from 'fs';
import path from 'path';
import { Project } from '@/lib/types';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { Metadata } from 'next';

const FEATURED_PROJECT_IDS: (number | string)[] = [
  727342843, 657660151, 952619337, 525828811, 998877665, 583853098,
];

async function getProjects(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), 'public/projects-data.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    let projects: Project[] = JSON.parse(fileContents);

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
  } catch (error) {
    console.error('Failed to read or parse projects data:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A collection of projects by Utsav Khatri, showcasing skills in full-stack development, AI, and more.',
};

export default async function ProjectsPage() {
  const allProjectsData = await getProjects();

  return (
    <div className="bg-background min-h-screen">
      <ProjectsSection
        id="projects"
        className="content-section"
        initialProjects={allProjectsData}
      />
    </div>
  );
}
