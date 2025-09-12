import { MetadataRoute } from 'next';
import projectsData from '@/lib/projects-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = `https://www.khatriutsav.com`;

  const projects = projectsData;
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
