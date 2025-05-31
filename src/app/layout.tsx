import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
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
    "Web Developer",
    "React Developer",
    "Node.js Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "React",
    "Node.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Express.js",
    "Three.js",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Cloudflare",
    "Vercel",
    "Serverless",
    "Docker",
    "Artificial Intelligence (AI)",
    "Generative AI",
    "Gemini AI",
    "OpenAI API",
    "RESTful APIs",
    "API Development",
    "Authentication",
    "Data Visualization",
    "Portfolio",
    "Web Developer Gujarat",
    "Utsav Khatri ahmedabad",
    "Utsav Khatri portfolio",
    "Utsav Khatri full stack developer",
  ],
  authors: [
    {
      name: "Utsav Khatri",
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  ],
  creator: "Utsav Khatri",
  openGraph: {
    title: "Utsav Khatri | Full Stack Developer",
    description:
      "Discover the portfolio of Utsav Khatri, showcasing expertise in modern web development.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
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
  verification: { google: "4b4H3hr3KG4V1J6eRzWhNZDf84yIPAcR1x32o0EpF8U" },
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
          geistSans.variable,
          geistMono.variable,
          notoSansGujarati.variable,
          notoSansDevanagari.variable,
          "font-sans antialiased"
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
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Person",
                name: "Utsav Khatri",
                url:
                  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                image: "/images/utsav-khatri.webp",
                jobTitle: "Full Stack Developer",
                description:
                  "Results-oriented Full Stack Developer specializing in React, Node.js, Next.js, TypeScript, and Cloud Technologies with a keen interest in AI.",
                sameAs: [
                  "https://www.linkedin.com/in/utsav-khatri/",
                  "https://github.com/utsav173",
                ],
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
