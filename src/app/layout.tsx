import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Noto_Sans_Gujarati, Noto_Sans_Devanagari } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { SITE_URL } from '@/lib/config';
import { experiencesData } from '@/lib/experience-data';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const notoSansGujarati = Noto_Sans_Gujarati({
  weight: ['400', '700'],
  subsets: ['gujarati'],
  variable: '--font-noto-gujarati',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ['400', '700'],
  subsets: ['devanagari'],
  variable: '--font-noto-devanagari',
  display: 'swap',
});

const SITE_DESCRIPTION =
  'Portfolio of Utsav Khatri, a results-oriented Full Stack Developer specializing in React, Node.js, Next.js, TypeScript, and Cloud Technologies with a keen interest in AI.';
const SITE_TITLE = 'Utsav Khatri | Full Stack Developer';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | Utsav Khatri`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Utsav Khatri',
    'Khatri Utsav',
    'Full Stack Developer',
    'Software Engineer',
    'React Developer',
    'Node.js Developer',
    'Next.js Developer',
    'TypeScript',
    'JavaScript',
    'Tailwind CSS',
    'Three.js',
    'PostgreSQL',
    'AWS',
    'Cloudflare',
    'Vercel',
    'Generative AI',
    'API Development',
    'Portfolio',
    'Web Developer Gujarat',
    'React.js',
    'Redux',
    'JavaScript (ES6+)',
    'HTML5',
    'CSS3',
    'Shadcn/UI',
    'Material-UI',
    'Bun.js',
    'Hono.js',
    'Express.js',
    'RESTful APIs',
    'GraphQL',
    'Microservices',
    'WebSockets',
    'Serverless',
    'MongoDB',
    'MySQL',
    'Redis',
    'Drizzle ORM',
    'Prisma',
    'NeonDB',
    'Google Cloud (GCP)',
    'Cloudflare Workers',
    'Cloudflare Pages',
    'Netlify',
    'CI/CD',
    'GitHub Actions',
    'Docker',
    'Git',
    'Shell',
    'Markdown',
    'AI',
    'Gemini AI',
    'LLMs',
    'API Security',
    'Performance Optimization',
    'Scalability',
    'Fal.ai API',
    'VS Code',
    'Postman',
    'Swagger/OpenAPI',
    'Figma',
    'Jira',
    'Agile/Scrum',
    'TDD',
    'Vite',
    'Data Scraping',
    'Recharts',
    'Chart.js',
    'JWT',
    'PDF.js',
    'WebGL',
    'Mongoose',
    'MDX',
    'React Native',
    'Mobile Development',
    'Expo',
    'T3 Stack',
    'tRPC',
    'NextAuth.js',
    'Stable Diffusion API',
    'Python',
    'Jupyter Notebook',
    'OpenAI API',
    'Fetch API',
    'CoinGecko API',
    'Convex',
    'Plate.js',
    'UploadThing',
    'Vercel AI SDK',
    'Google Gemini',
    'Sails.js',
    'Strapi.js',
    'AWS SQS',
    'SQL',
    'Socket.io',
    'Styled Components',
    'Webpack',
    'Radix UI',
    'FFmpeg',
    'Streaming',
    'Khatri Utsav Ahemdabad',
    'Khatri',
    'khatri utsav web developer'
  ],
  authors: [{ name: 'Utsav Khatri', url: SITE_URL }],
  creator: 'Utsav Khatri',
  openGraph: {
    title: SITE_TITLE,
    description:
      'Discover the portfolio of Utsav Khatri, showcasing expertise in modern web development, AI, and cloud technologies.',
    url: SITE_URL,
    siteName: 'Utsav Khatri Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Utsav Khatri - Full Stack Developer Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description:
      'Explore projects and skills of Utsav Khatri, a Full Stack Developer focused on innovative web solutions.',
    images: ['/twitter-image.png'],
    creator: '@Utsav_Khatri_',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: { icon: '/favicon.svg', shortcut: '/favicon-16x16.png', apple: '/apple-touch-icon.png' },
  verification: { google: 'tNXFFpZE1VOHdcWpBlnAsX7avQThqRD6wjolUQaG4rU' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f5ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1c' },
  ],
};

const monthMap: { [key: string]: string } = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
};

const parseDuration = (duration: string) => {
  const parts = duration.split(' - ');
  const [startMonth, startYear] = parts[0].split(' ');
  const startDate = `${startYear}-${monthMap[startMonth]}`;

  let endDate = null;
  if (parts[1] !== 'Present') {
    const [endMonth, endYear] = parts[1].split(' ');
    endDate = `${endYear}-${monthMap[endMonth]}`;
  }
  return { startDate, endDate };
};

const worksFor = experiencesData.map((exp) => ({
  '@type': 'Organization',
  name: exp.company.split(',')[0],
}));

const hasOccupation = experiencesData.flatMap((exp) =>
  exp.roles.map((role) => {
    const { startDate, endDate } = parseDuration(role.duration);
    return {
      '@type': 'Occupation',
      name: role.title,
      startDate: startDate,
      ...(endDate && { endDate: endDate }),
      worksFor: {
        '@type': 'Organization',
        name: exp.company.split(',')[0],
      },
    };
  })
);

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Utsav Khatri',
      url: SITE_URL,
      image: `${SITE_URL}/images/utsav-khatri.webp`,
      jobTitle: 'Full Stack Developer',
      description: SITE_DESCRIPTION,
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
      workLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Gujarat',
          addressCountry: 'IN',
        },
      },
      worksFor: worksFor,
      hasOccupation: hasOccupation,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      publisher: {
        '@id': `${SITE_URL}/#person`,
      },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: `Home | ${SITE_TITLE}`,
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
      about: {
        '@id': `${SITE_URL}/#person`,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og-image.png`,
      },
      datePublished: '2023-01-01T00:00:00+00:00',
      dateModified: new Date().toISOString(),
    },
  ],
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
          notoSansGujarati.variable,
          notoSansDevanagari.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <a href="#main-content" className="skip-to-content-link">
            Skip to main content
          </a>
          {children}
          {modal}
          <Toaster richColors position="top-right" closeButton />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            key="structured-data"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
