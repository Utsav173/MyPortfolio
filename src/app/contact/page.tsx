import { ContactSection } from '@/components/sections/ContactSection';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Utsav Khatri to discuss projects, ideas, or opportunities.',
  keywords: [
    'Contact Utsav Khatri',
    'Get in Touch',
    'Email',
    'Collaboration',
    'Project Inquiries',
    'Hire Full Stack Developer',
    'Contact Software Engineer',
  ],
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Utsav Khatri',
  description: 'Contact form and details to get in touch with Utsav Khatri.',
  url: `${SITE_URL}/contact`,
  potentialAction: {
    '@type': 'CommunicateAction',
    target: {
      '@type': 'EntryPoint',
      actionPlatform: [
        'http://schema.org/Website',
        'http://schema.org/MobileApplication',
        'http://schema.org/DesktopApplication',
      ],
    },
    recipient: {
      '@type': 'Person',
      name: 'Utsav Khatri',
    },
  },
};

export default function ContactPage() {
  return (
    <PageWrapper>
      <h1 className="sr-only">Contact Me</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
        key="contact-jsonld"
      />
      <ContactSection id="contact" />
    </PageWrapper>
  );
}
