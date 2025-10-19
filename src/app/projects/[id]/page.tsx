import { Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/sections/ProjectDetail';
import { Metadata } from 'next';
import projectsData from '@/lib/projects-data';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SITE_URL } from '@/lib/config';

async function getProjects(): Promise<Project[]> {
  return projectsData as Project[];
}

async function getProject(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => String(p.id) === id);
}

export async function generateMetadata({ params }: PageProps<'/projects/[id]'>): Promise<Metadata> {
  const project = await getProject((await params).id);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.name,
    description: project.description,
    keywords: project.seo,
    alternates: {
      canonical: `${SITE_URL}/projects/${project.id}`,
    },
  };
}

export default async function ProjectPage({ params, searchParams }: PageProps<'/projects/[id]'>) {
  const project = await getProject((await params).id);

  const isFromHomePage = (await searchParams)?.ref === 'home';

  if (!project) {
    notFound();
  }

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: `${SITE_URL}/projects/${project.id}`,
    image: {
      '@type': 'ImageObject',
      url: project.imageUrl ? `${SITE_URL}${project.imageUrl}` : `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      name: 'Utsav Khatri',
      url: SITE_URL,
    },
    copyrightHolder: {
      '@type': 'Person',
      name: 'Utsav Khatri',
      url: SITE_URL,
    },
    isAccessibleForFree: true,
    datePublished: '2023-01-01',
    keywords: project.seo.join(', '),
  };

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
        key="project-jsonld"
      />
      <div className="flex-1 max-w-5xl max-sm:w-full">
        <ProjectDetail project={project} isFromHomePage={isFromHomePage} />
      </div>
    </PageWrapper>
  );
}

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    id: String(project.id),
  }));
}
