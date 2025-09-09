import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { Project } from '@/lib/types';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const projects = await getProjects();
  const projectUrls = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const routes = ['', '/about', '/skills', '/experience', '/projects', '/contact'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes, ...projectUrls];
}
