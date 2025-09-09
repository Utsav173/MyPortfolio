import { Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Modal } from '@/components/Modal';
import projectsData from '@/lib/projects-data';

// helper: load a project by id
async function getProject(id: string): Promise<Project | undefined> {
  const projects: Project[] = projectsData as Project[];
  return projects.find((p) => String(p.id) === id);
}

// ✅ Use Next.js App Router page props style
export default async function ProjectModal({ params }: { params: Promise<{ id: string }> }) {
  const project = await getProject((await params).id);

  if (!project) {
    notFound();
  }

  return (
    <Modal project={project} />
  );
}