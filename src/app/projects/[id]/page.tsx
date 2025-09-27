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

  const imageUrl = project.imageUrl ? `${SITE_URL}${project.imageUrl}` : `${SITE_URL}/og-image.png`;

  return {
    title: project.name,
    description: project.description,
    keywords: project.techStack,
    alternates: {
      canonical: `${SITE_URL}/projects/${project.id}`,
    },
    openGraph: {
      title: `${project.name} | Utsav Khatri`,
      description: project.description,
      url: `${SITE_URL}/projects/${project.id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} | Utsav Khatri`,
      description: project.description,
      images: [imageUrl],
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
    image: project.imageUrl ? `${SITE_URL}${project.imageUrl}` : `${SITE_URL}/og-image.png`,
    author: {
      '@type': 'Person',
      name: 'Utsav Khatri',
    },
    datePublished: '2023-01-01',
    keywords: project.techStack.join(', '),
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
