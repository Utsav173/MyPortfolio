import { promises as fs } from 'fs';
import path from 'path';
import { Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Modal } from '@/components/Modal';

// helper: load a project by id
async function getProject(id: string): Promise<Project | undefined> {
  const filePath = path.join(process.cwd(), 'public/projects-data.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const projects: Project[] = JSON.parse(fileContents);
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
