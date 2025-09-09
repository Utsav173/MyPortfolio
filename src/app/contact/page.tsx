
import { ContactSection } from '@/components/sections/ContactSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Utsav Khatri to discuss projects, ideas, or opportunities.',
};

export default function ContactPage() {
  return <ContactSection id="contact" />;
}
