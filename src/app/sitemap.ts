import { MetadataRoute } from 'next';
import projectsData from '@/lib/projects-data';
import { skillsData } from '@/lib/skills-data';
import { SITE_URL } from '@/lib/config';
import { posts } from '@site/content';
import { getAllTags } from '@/lib/utils';
import { slug } from 'github-slugger';
import slugify from 'slugify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticDate = new Date('2025-10-19');

  const projects = projectsData;
  const projectUrls = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.id}`,
    lastModified: staticDate,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const routes = ['', '/about', '/skills', '/experience', '/projects', '/contact', '/blog'].map(
    (route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: staticDate,
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

  const tags = getAllTags(posts);
  const tagUrls = Object.keys(tags).map((tag) => {
    return {
      url: `${SITE_URL}/blog/tags/${slug(tag)}`,
      lastModified: staticDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  const allSkills = skillsData.flatMap((category) => category.skills);
  const skillUrls = allSkills.map((skill) => ({
    url: `${SITE_URL}/skills/${slugify(skill.name, { lower: true })}`,
    lastModified: staticDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...projectUrls, ...postUrls, ...tagUrls, ...skillUrls];
}
