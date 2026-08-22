import projectsData from '@/lib/projects-data';
import { experiencesData } from '@/lib/experience-data';
import { skillsData } from '@/lib/skills-data';
import { SITE_URL } from '@/lib/config';

export const dynamic = 'force-static';

const HEAD = (title: string) =>
  `# ${title}\n\n> Markdown mirror served for AI/LLM consumption. HTML version: canonical site https://khatriutsav.com\n`;

const renderProject = (p: (typeof projectsData)[number]) => {
  return [
    `## ${p.name}`,
    '',
    p.description,
    '',
    p.liveUrl ? `- Live: ${p.liveUrl}` : null,
    p.repoUrl ? `- Source: ${p.repoUrl}` : null,
    `- Detail page: ${SITE_URL}/projects/${p.id}`,
    p.techStack?.length ? `- Tech stack: ${p.techStack.join(', ')}` : null,
    ...(p.keyFeatures ?? []).map((f) => `- Feature: ${f}`),
  ]
    .filter(Boolean)
    .join('\n');
};

const pages: Record<string, string> = {
  index: [
    '# Markdown Mirrors — khatriutsav.com',
    '',
    'Clean-text versions of this site for AI agents and LLMs.',
    '',
    '- [Home](/md/home)',
    '- [Projects](/md/projects)',
    '- [Experience](/md/experience)',
    '- [Skills](/md/skills)',
    '- Full blog post texts: [/llms-full.txt](/llms-full.txt)',
    '',
    'All content © Khatri Utsav (Utsav Khatri).',
  ].join('\n'),
  home: [
    HEAD('Khatri Utsav — Full Stack Developer'),
    'Utsav Khatri ("Khatri Utsav") is a Full Stack Developer based in Ahmedabad, Gujarat, India, specializing in React, Next.js, Node.js, TypeScript, and Generative AI.',
    '',
    'Creator of Temporal (https://temporal.khatriutsav.com), an offline-first financial intelligence app with on-device AI (Google Gemma via LiteRT).',
    '',
    '## Pages',
    '- About: https://khatriutsav.com/about',
    '- Experience: https://khatriutsav.com/experience',
    '- Projects: https://khatriutsav.com/projects',
    '- Blog: https://khatriutsav.com/blog',
    '- Resume: https://khatriutsav.com/resume',
    '- Contact: https://khatriutsav.com/contact',
    '',
    '## Contact',
    '- Email: khatriutsav40@gmail.com',
    '- LinkedIn: https://www.linkedin.com/in/utsav-khatri-in/',
    '- GitHub: https://github.com/utsav173',
    '- X: https://twitter.com/Utsav_Khatri_',
  ].join('\n'),
  projects: [
    HEAD('Projects — Khatri Utsav'),
    ...projectsData.filter((p) => p.published).map((p) => renderProject(p)),
    '',
    'Machine-readable JSON: https://khatriutsav.com/projects-data.json',
  ].join('\n\n'),
  experience: [
    HEAD('Professional Experience — Khatri Utsav'),
    ...experiencesData.map((exp) => {
      const company = exp.company.split(',')[0];
      const roles = exp.roles.map((r) => `- ${r.title} (${r.duration})`).join('\n');
      const bullets = exp.responsibilities.map((r) => `- ${r}`).join('\n');
      const projects = exp.keyProjects
        ?.map((p) => `- ${p.name}${p.tech?.length ? ` (${p.tech.join(', ')})` : ''}`)
        .join('\n');
      return [
        `## ${company}`,
        '',
        roles,
        '',
        '**Responsibilities:**',
        bullets,
        projects ? `\n**Key Projects:**\n${projects}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');
    }),
  ].join('\n\n'),
  skills: [
    HEAD('Technical Skills — Khatri Utsav'),
    ...skillsData.map((c) => `## ${c.category}\n${c.skills.map((s) => s.name).join(', ')}`),
  ].join('\n\n'),
};

for (const p of projectsData) {
  if (!p.published) continue;
  pages[`projects/${p.id}`] = [
    HEAD(`${p.name} — Project Detail`),
    renderProject(p),
    '',
    `Source code: ${p.repoUrl ?? 'N/A'}`,
  ].join('\n');
}

export function generateStaticParams(): { path: string[] }[] {
  return Object.keys(pages).map((key) => ({ path: key.split('/') }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
): Promise<Response> {
  const { path } = await params;
  const key = (path ?? []).join('/') || 'index';
  const body = pages[key];

  if (!body) {
    return new Response('Not found. See /md/index for available mirrors.\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(body + '\n', {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
      'X-Robots-Tag': 'all',
    },
  });
}
