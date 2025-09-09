import { promises as fs } from 'fs';
import path from 'path';
import { Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/sections/ProjectDetail';
import { Metadata } from 'next';

async function getProjects(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), 'public/projects-data.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to read or parse projects data:', error);
    return [];
  }
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

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4">
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
