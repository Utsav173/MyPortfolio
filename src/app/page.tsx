import PageClient from '@/components/layout/PageClient';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import FooterSection from '@/components/sections/FooterSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import projectsData from '@/lib/projects-data';
import { Project } from '@/lib/types';

const FEATURED_PROJECT_IDS: (number | string)[] = [
  1007, 727342843, 657660151, 952619337, 525828811, 998877665, 583853098,
];

async function getProjects(): Promise<Project[]> {
  let projects: Project[] = projectsData as Project[];

  // Sort projects based on featured status, image, and stars
  projects.sort((a, b) => {
    const aFeaturedIndex = FEATURED_PROJECT_IDS.indexOf(a.id);
    const bFeaturedIndex = FEATURED_PROJECT_IDS.indexOf(b.id);

    // Prioritize featured projects
    if (aFeaturedIndex !== -1 && bFeaturedIndex !== -1) {
      return aFeaturedIndex - bFeaturedIndex;
    }
    if (aFeaturedIndex !== -1) return -1;
    if (bFeaturedIndex !== -1) return 1;

    // Prioritize projects with an image
    const aHasImage = !!a.imageUrl;
    const bHasImage = !!b.imageUrl;
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;

    // Sort by star count (using new structure)
    const aStars = a.githubStats?.stars || 0;
    const bStars = b.githubStats?.stars || 0;
    if (bStars !== aStars) {
      return bStars - aStars;
    }

    // Fallback to alphabetical order
    return a.name.localeCompare(b.name);
  });

  return projects;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const allProjectsData = await getProjects();
  const sp = await searchParams;
  const searchQuery = sp?.q as string;

  return (
    <PageClient>
      <HeroSection id="hero" className="content-section" />
      <AboutSection id="about" className="content-section" />
      <SkillsSection id="skills" className="content-section" />
      <ExperienceSection id="experience" className="content-section" />
      <ProjectsSection
        id="projects"
        className="content-section"
        initialProjects={allProjectsData}
        searchQuery={searchQuery}
        isFromHomePage
      />
      <ContactSection id="contact" className="content-section" />
      <FooterSection />
    </PageClient>
  );
}
