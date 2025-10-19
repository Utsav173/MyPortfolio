import { AboutSection } from '@/components/sections/AboutSection';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/layout/PageWrapper';

export const metadata: Metadata = {
  title: 'About Me',
  description:
    'Learn more about Utsav Khatri, a Full Stack Developer with a passion for building scalable web applications and exploring AI.',
};

export default function AboutPage() {
  return (
    <PageWrapper>
      <h1 className="sr-only">About Me</h1>
      <AboutSection id="about" />
    </PageWrapper>
  );
}
