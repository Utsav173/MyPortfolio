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
    body: string;
  };
}

export function PostSchema({ post }: PostSchemaProps) {
  const wordCount = post.body.split(/\s+/).length;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/${post.slug}`,
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.updated || post.date).toISOString(),
    image: {
      '@type': 'ImageObject',
      url: post.image || `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}`,
      width: 1200,
      height: 630,
    },
    url: `${SITE_URL}/${post.slug}`,
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
        url: `${SITE_URL}/favicon.svg`,
        width: 96,
        height: 96,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${post.slug}`,
    },
    keywords: post.tags?.join(', '),
    articleSection: post.tags?.[0] || 'Technology',
    inLanguage: 'en-US',
    commentCount: 0, // Placeholder for future implementation
    wordCount: wordCount,
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
        item: `${SITE_URL}/${post.slug}`,
      },
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
    </>
  );
}
