import { MetadataRoute } from 'next';
import projectsData from '@/lib/projects-data';
import { SITE_URL } from '@/lib/config';
import { posts } from '@site/content';
import { getAllTags } from '@/lib/utils';
import { slug } from 'github-slugger';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = projectsData;
  const projectUrls = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const routes = ['', '/about', '/skills', '/experience', '/projects', '/contact', '/blog'].map(
    (route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  const publishedPosts = posts.filter((post) => post.published);
  const postUrls = publishedPosts.map((post) => ({
    url: `${SITE_URL}/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...projectUrls, ...postUrls];
}
