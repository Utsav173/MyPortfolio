import { AboutSection } from '@/components/sections/AboutSection';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SITE_URL } from '@/lib/config';

const TITLE = 'About Me';
const DESCRIPTION =
  'Learn more about Utsav Khatri, a Full Stack Developer with a passion for building scalable web applications and exploring AI.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <PageWrapper>
      <h1 className="sr-only">About Me</h1>
      <AboutSection id="about" />
    </PageWrapper>
  );
}
