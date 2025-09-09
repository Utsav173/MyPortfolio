
import { AboutSection } from '@/components/sections/AboutSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about Utsav Khatri, a Full Stack Developer with a passion for building scalable web applications and exploring AI.',
};

export default function AboutPage() {
  return <AboutSection id="about" />;
}
