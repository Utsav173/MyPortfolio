import { ContactSection } from '@/components/sections/ContactSection';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/layout/PageWrapper';

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khatriutsav.com';

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Utsav Khatri',
  description: 'Contact form and details to get in touch with Utsav Khatri.',
  url: `${siteUrl}/contact`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
        key="contact-jsonld"
      />
      <ContactSection id="contact" />
    </PageWrapper>
  );
}
