// src/components/blog/post/PostSchema.tsx
import { SITE_URL } from '@/lib/config';

interface PostSchemaProps {
  post: {
    title: string;
    description?: string;
    date: string;
    updated?: string;
    slug: string;
    tags?: string[];
    author?: {
      name: string;
      url?: string;
    };
    image?: string;
  };
}

export function PostSchema({ post }: PostSchemaProps) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.updated || post.date).toISOString(),
    image: post.image || `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}`,
    url: `${SITE_URL}${post.slug}`,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Utsav Khatri',
      url: post.author?.url || SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Utsav Khatri',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${post.slug}`,
    },
    keywords: post.tags?.join(', '),
    articleSection: 'Technology',
    inLanguage: 'en',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}${post.slug}`,
      },
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    name: 'Utsav Khatri',
    description: 'Full Stack Developer & Technical Writer',
    publisher: {
      '@type': 'Person',
      name: 'Utsav Khatri',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Utsav Khatri',
    url: SITE_URL,
    jobTitle: 'Full Stack Developer',
    description: 'Full Stack Developer specializing in React, Next.js, and modern web technologies',
    sameAs: [
      'https://twitter.com/Utsav_Khatri_',
      'https://www.linkedin.com/in/utsav-khatri-in/',
      'https://github.com/utsavkhatri',
    ],
    knowsAbout: [
      'Web Development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'AI',
      'Machine Learning',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
