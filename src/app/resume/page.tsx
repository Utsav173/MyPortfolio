import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/config';
import { experiencesData } from '@/lib/experience-data';
import { skillsData } from '@/lib/skills-data';
import projectsData from '@/lib/projects-data';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume of Khatri Utsav — Full Stack Developer specializing in React, Next.js, Node.js, TypeScript, and Generative AI.',
  alternates: {
    canonical: `${SITE_URL}/resume`,
  },
};

const featuredProjects = projectsData.filter((p) => p.published).slice(0, 4);

export default function ResumePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-24 md:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': `${SITE_URL}/resume#webpage`,
            url: `${SITE_URL}/resume`,
            name: 'Resume — Khatri Utsav',
            about: { '@id': `${SITE_URL}/#person` },
            mainEntity: {
              '@type': 'Person',
              '@id': `${SITE_URL}/#person`,
              name: 'Khatri Utsav',
              alternateName: 'Utsav Khatri',
              jobTitle: 'Full Stack Developer',
            },
          }),
        }}
      />
      <header className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">Utsav Khatri</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Full Stack Developer — Ahmedabad, Gujarat, India
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            khatriutsav40@gmail.com · +91 6355321582 ·{' '}
            <Link
              href={`${SITE_URL}`}
              className="underline underline-offset-4 hover:text-foreground"
            >
              khatriutsav.com
            </Link>{' '}
            ·{' '}
            <a
              href="https://github.com/utsav173"
              className="underline underline-offset-4 hover:text-foreground"
            >
              github.com/utsav173
            </a>
          </p>
        </div>
        <a
          href="/resume_utsav_khatri.pdf"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors print:hidden"
        >
          Download PDF
        </a>
      </header>

      <main id="main-content" className="space-y-12">
        <section aria-labelledby="summary-heading">
          <h2
            id="summary-heading"
            className="mb-3 font-mono text-sm uppercase tracking-wider text-primary"
          >
            Summary
          </h2>
          <p className="leading-relaxed text-foreground/90">
            Full Stack Developer with 3+ years of experience designing, building, and deploying
            scalable cloud-native web applications and APIs. Specialized in React, Next.js, Node.js,
            TypeScript, and Generative AI integration. Creator of Temporal, an on-device-AI
            financial intelligence app.
          </p>
        </section>

        <section aria-labelledby="experience-heading">
          <h2
            id="experience-heading"
            className="mb-4 font-mono text-sm uppercase tracking-wider text-primary"
          >
            Experience
          </h2>
          <div className="space-y-8">
            {experiencesData.map((exp) => (
              <article key={exp.company}>
                <h3 className="text-lg font-bold">{exp.company.split(',')[0]}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.company.split(',')[0]}, Gujarat, India
                </p>
                {exp.roles.map((role) => (
                  <p key={role.title} className="mt-1 text-sm">
                    <span className="font-semibold">{role.title}</span>
                    <span className="text-muted-foreground"> — {role.duration}</span>
                  </p>
                ))}
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90">
                  {exp.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="skills-heading">
          <h2
            id="skills-heading"
            className="mb-4 font-mono text-sm uppercase tracking-wider text-primary"
          >
            Skills
          </h2>
          <div className="space-y-4">
            {skillsData.map((category) => (
              <div key={category.category} className="grid grid-cols-[120px_1fr] gap-4 text-sm">
                <span className="font-semibold">{category.category}</span>
                <span className="text-foreground/90">
                  {category.skills.map((s) => s.name).join(' · ')}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="projects-heading">
          <h2
            id="projects-heading"
            className="mb-4 font-mono text-sm uppercase tracking-wider text-primary"
          >
            Selected Projects
          </h2>
          <ul className="space-y-4">
            {featuredProjects.map((project) => (
              <li key={project.id} className="text-sm">
                <span className="font-bold">{project.name}</span>
                {project.liveUrl && (
                  <>
                    {' — '}
                    <a
                      href={project.liveUrl}
                      className="underline underline-offset-4 hover:text-foreground"
                    >
                      {project.liveUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </>
                )}
                <p className="mt-1 leading-relaxed text-foreground/90">{project.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {project.techStack?.slice(0, 8).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="education-heading" className="print:hidden">
          <h2
            id="education-heading"
            className="mb-3 font-mono text-sm uppercase tracking-wider text-primary"
          >
            Links
          </h2>
          <p className="text-sm text-muted-foreground">
            Full project portfolio at{' '}
            <Link href="/projects" className="underline underline-offset-4 hover:text-foreground">
              khatriutsav.com/projects
            </Link>{' '}
            · Engineering blog at{' '}
            <Link href="/blog" className="underline underline-offset-4 hover:text-foreground">
              khatriutsav.com/blog
            </Link>
          </p>
        </section>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              header, nav, footer, .skip-to-content-link { display: none !important; }
              body { background: white !important; color: black !important; }
            }
          `,
        }}
      />
    </div>
  );
}
