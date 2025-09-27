import { Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Modal } from '@/components/Modal';
import projectsData from '@/lib/projects-data';

async function getProject(id: string): Promise<Project | undefined> {
  const projects: Project[] = projectsData as Project[];
  return projects.find((p) => String(p.id) === id);
}

export default async function ProjectModal({ params, searchParams }: PageProps<'/projects/[id]'>) {
  const project = await getProject((await params).id);
  const isFromHomePage = (await searchParams)?.ref === 'home';

  if (!project) {
    notFound();
  }

  return <Modal project={project} isFromHomePage={isFromHomePage} />;
}
