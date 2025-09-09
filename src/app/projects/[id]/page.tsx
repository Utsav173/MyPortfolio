import { Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/sections/ProjectDetail';
import { Metadata } from 'next';
import projectsData from '@/lib/projects-data';

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khatriutsav.com';
  const imageUrl = project.imageUrl ? `${siteUrl}${project.imageUrl}` : `${siteUrl}/og-image.png`;

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: `${project.name} | Utsav Khatri`,
      description: project.description,
      url: `${siteUrl}/projects/${project.id}`,
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

export default async function ProjectPage({ params }: PageProps<'/projects/[id]'>) {
  const project = await getProject((await params).id);

  if (!project) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khatriutsav.com';
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: `${siteUrl}/projects/${project.id}`,
    image: project.imageUrl ? `${siteUrl}${project.imageUrl}` : `${siteUrl}/og-image.png`,
    author: {
      '@type': 'Person',
      name: 'Utsav Khatri',
    },
    datePublished: '2023-01-01', // You might want to replace this with actual project date
    keywords: project.techStack.join(', '),
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
        key="project-jsonld"
      />
      <div className="max-w-5xl w-full">
        <ProjectDetail project={project} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    id: String(project.id),
  }));
}