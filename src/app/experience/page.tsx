import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/layout/PageWrapper';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Discover the professional journey of Utsav Khatri, including roles, responsibilities, and key projects.',
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
  return (
    <PageWrapper>
      <h1 className="sr-only">Experience</h1>
      <ExperienceSection id="experience" />
    </PageWrapper>
  );
}
