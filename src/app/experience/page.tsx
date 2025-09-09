
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Discover the professional journey of Utsav Khatri, including roles, responsibilities, and key projects.',
};

export default function ExperiencePage() {
  return <ExperienceSection id="experience" />;
}
