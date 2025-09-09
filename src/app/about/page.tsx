
import { AboutSection } from '@/components/sections/AboutSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about Utsav Khatri, a Full Stack Developer with a passion for building scalable web applications and exploring AI.',
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khatriutsav.com';

const personSchema = {
  '@context': 'https://schema.org/',
  '@type': 'Person',
  name: 'Utsav Khatri',
  url: siteUrl,
  image: `${siteUrl}/images/utsav-khatri.webp`,
  jobTitle: 'Full Stack Developer',
  description:
    'Results-oriented Full Stack Developer specializing in React, Node.js, Next.js, TypeScript, and Cloud Technologies with a keen interest in AI.',
  sameAs: ['https://www.linkedin.com/in/utsav-khatri-in/', 'https://github.com/utsav173'],
  knowsAbout: [
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'AWS',
    'Cloudflare',
    'Generative AI',
    'Full-Stack Development',
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        key="person-jsonld"
      />
      <AboutSection id="about" />
    </>
  );
}
