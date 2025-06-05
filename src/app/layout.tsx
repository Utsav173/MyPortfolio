import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans_Gujarati,
  Noto_Sans_Devanagari,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansGujarati = Noto_Sans_Gujarati({
  weight: ["400", "700"],
  subsets: ["gujarati"],
  variable: "--font-noto-gujarati",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ["400", "700"],
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Utsav Khatri | Full Stack Developer",
    template: "%s | Utsav Khatri",
  },
  description:
    "Portfolio of Utsav Khatri, a results-oriented Full Stack Developer specializing in React, Node.js, Next.js, TypeScript, and Cloud Technologies with a keen interest in AI.",
  keywords: [
    "Utsav Khatri",
    "Full Stack Developer",
    "Software Engineer",
    "React Developer",
    "Node.js Developer",
    "Next.js Developer",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Three.js",
    "PostgreSQL",
    "AWS",
    "Cloudflare",
    "Vercel",
    "Generative AI",
    "API Development",
    "Portfolio",
    "Web Developer Gujarat",
  ],
  authors: [{ name: "Utsav Khatri", url: siteUrl }],
  creator: "Utsav Khatri",
  openGraph: {
    title: "Utsav Khatri | Full Stack Developer",
    description:
      "Discover the portfolio of Utsav Khatri, showcasing expertise in modern web development.",
    url: siteUrl,
    siteName: "Utsav Khatri Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Utsav Khatri - Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utsav Khatri | Full Stack Developer",
    description:
      "Explore projects and skills of Utsav Khatri, a Full Stack Developer focused on innovative web solutions.",
    images: ["/twitter-image.png"],
    creator: "@Utsav_Khatri_",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "4b4H3hr3KG4V1J6eRzWhNZDf84yIPAcR1x32o0EpF8U",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E6EFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#05050c" },
  ],
};

const personSchema = {
  "@context": "https://schema.org/",
  "@type": "Person",
  name: "Utsav Khatri",
  url: siteUrl,
  image: `${siteUrl}/images/utsav-khatri.webp`,
  jobTitle: "Full Stack Developer",
  description:
    "Results-oriented Full Stack Developer specializing in React, Node.js, Next.js, TypeScript, and Cloud Technologies with a keen interest in AI.",
  sameAs: [
    "https://www.linkedin.com/in/utsav-khatri-in/",
    "https://github.com/utsav173",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
          notoSansGujarati.variable,
          notoSansDevanagari.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" closeButton />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            key="person-jsonld"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
