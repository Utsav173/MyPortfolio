
import { SkillsSection } from '@/components/sections/SkillsSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Explore the technical toolkit of Utsav Khatri, including expertise in frontend, backend, databases, cloud technologies, and AI.',
};

export default function SkillsPage() {
  return <SkillsSection id="skills" />;
}
