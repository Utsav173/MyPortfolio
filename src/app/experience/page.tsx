import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Explore the professional journey of Khatri Utsav, including roles, responsibilities, and key projects in full-stack engineering.',
  alternates: {
    canonical: `${SITE_URL}/experience`,
  },
  openGraph: {
    title: 'Experience',
    description:
      'Explore the professional journey of Khatri Utsav, including roles, responsibilities, and key projects in full-stack engineering.',
    url: `${SITE_URL}/experience`,
  },
  keywords: [
    'Professional Experience',
    'Work History',
    'Full Stack Developer',
    'Software Engineer',
    'Web Development',
    'React.js',
    'Node.js',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Cloud Computing',
    'AWS',
    'API Development',
    'Project Management',
    'Agile',
    'Scrum',
  ],
};

export default function ExperiencePage() {
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
        name: 'Experience',
        item: `${SITE_URL}/experience`,
      },
    ],
  };

  return (
    <PageWrapper>
      <h1 className="sr-only">Experience</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        key="experience-breadcrumb-jsonld"
      />
      <ExperienceSection id="experience" />
    </PageWrapper>
  );
}
