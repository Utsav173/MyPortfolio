import projectsData from '@/lib/projects-data';
import { experiencesData } from '@/lib/experience-data';
import { skillsData } from '@/lib/skills-data';
import { posts } from '@site/content';
import { SITE_URL } from '@/lib/config';

export const dynamic = 'force-dynamic';

const PROTOCOL_VERSION = '2025-06-18';

const SERVER_INFO = {
  name: 'khatriutsav-portfolio',
  title: "Khatri Utsav's Portfolio",
  version: '1.0.0',
};

const INSTRUCTIONS =
  'Query tools about Khatri Utsav (Utsav Khatri), a Full Stack Developer based in Ahmedabad, India. Use get_profile for identity, get_projects/get_project for portfolio work, list_posts/get_post for articles, get_experience and get_skills for background. Human-readable site: https://khatriutsav.com';

type JsonSchema = {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
};

const TOOLS: { name: string; description: string; inputSchema: JsonSchema }[] = [
  {
    name: 'get_profile',
    description:
      'Identity, role, location and contact links for Khatri Utsav (Utsav Khatri), Full Stack Developer.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_projects',
    description: 'List published portfolio projects. Optionally filter by technology.',
    inputSchema: {
      type: 'object',
      properties: {
        tech: {
          type: 'string',
          description:
            'Filter projects whose tech stack includes this technology (case-insensitive).',
        },
      },
    },
  },
  {
    name: 'get_project',
    description: 'Full detail of one project by id or exact name (e.g. 1007 or "Temporal").',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: ['number', 'string'], description: 'Project id or exact project name.' },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_experience',
    description: 'Work history: companies, roles, durations, responsibilities and key projects.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_skills',
    description: 'Technical skills grouped by category.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_posts',
    description: 'List published blog posts with titles, descriptions, dates and URLs.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_post',
    description: 'Metadata and canonical URL of one blog post by slug.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'Post slug, e.g. "beyond-robots-txt-llms-txt-guide".',
        },
      },
      required: ['slug'],
    },
  },
];

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text', text }], isError };
}

function callTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case 'get_profile': {
      return textResult(
        JSON.stringify(
          {
            name: 'Khatri Utsav',
            alternateName: 'Utsav Khatri',
            jobTitle: 'Full Stack Developer',
            location: 'Ahmedabad, Gujarat, India',
            email: 'khatriutsav40@gmail.com',
            website: SITE_URL,
            flagshipProduct: 'Temporal — https://temporal.khatriutsav.com',
            profiles: {
              linkedin: 'https://www.linkedin.com/in/utsav-khatri-in/',
              github: 'https://github.com/utsav173',
              x: 'https://twitter.com/Utsav_Khatri_',
            },
          },
          null,
          2
        )
      );
    }
    case 'get_projects': {
      const tech = typeof args.tech === 'string' ? args.tech.toLowerCase() : null;
      const result = projectsData
        .filter((p) => p.published)
        .filter((p) => !tech || p.techStack?.some((t) => t.toLowerCase().includes(tech)))
        .map(({ id, name, description, liveUrl, repoUrl, techStack }) => ({
          id,
          name,
          description,
          liveUrl,
          repoUrl,
          techStack,
        }));
      return textResult(JSON.stringify(result, null, 2));
    }
    case 'get_project': {
      const needle = args.id;
      const project = projectsData.find(
        (p) =>
          p.published &&
          (p.id === needle ||
            String(p.id) === String(needle) ||
            p.name.toLowerCase() === String(needle ?? '').toLowerCase())
      );
      if (!project) return textResult(`No published project found for "${String(needle)}".`, true);
      return textResult(JSON.stringify(project, null, 2));
    }
    case 'get_experience': {
      return textResult(JSON.stringify(experiencesData, null, 2));
    }
    case 'get_skills': {
      return textResult(
        JSON.stringify(
          skillsData.map((c) => ({ category: c.category, skills: c.skills.map((s) => s.name) })),
          null,
          2
        )
      );
    }
    case 'list_posts': {
      return textResult(
        JSON.stringify(
          posts
            .filter((p) => p.published)
            .map((p) => ({
              slug: p.slugAsParams,
              title: p.title,
              description: p.description,
              date: p.date,
              url: `${SITE_URL}/blog/${p.slugAsParams}`,
              tags: p.tags,
            })),
          null,
          2
        )
      );
    }
    case 'get_post': {
      const slug = String(args.slug ?? '');
      const post = posts.find((p) => p.published && p.slugAsParams === slug);
      if (!post) return textResult(`No published post found for slug "${slug}".`, true);
      return textResult(
        JSON.stringify(
          {
            slug: post.slugAsParams,
            title: post.title,
            description: post.description,
            date: post.date,
            updated: post.updated,
            tags: post.tags,
            readingTimeMinutes: post.metadata?.readingTime,
            url: `${SITE_URL}/blog/${post.slugAsParams}`,
            fullText: `${SITE_URL}/llms-full.txt`,
          },
          null,
          2
        )
      );
    }
    default:
      return textResult(`Unknown tool: ${name}`, true);
  }
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version',
  'Access-Control-Max-Age': '86400',
};

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(): Promise<Response> {
  // Stateful SSE streams are not supported in this stateless deployment.
  return new Response(
    JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed. Use POST.' },
      id: null,
    }),
    {
      status: 405,
      headers: { ...CORS_HEADERS, Allow: 'POST, OPTIONS', 'Content-Type': 'application/json' },
    }
  );
}

type RpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

function handleMessage(message: RpcRequest): Response | null {
  const isNotification = message.id === undefined || message.id === null;

  if (isNotification) {
    // notifications/initialized and other notifications: accept silently.
    return new Response(null, { status: 202, headers: CORS_HEADERS });
  }

  let result: unknown;
  switch (message.method) {
    case 'initialize':
      result = {
        protocolVersion: (message.params?.protocolVersion as string) ?? PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
        instructions: INSTRUCTIONS,
      };
      break;
    case 'ping':
      result = {};
      break;
    case 'tools/list':
      result = { tools: TOOLS };
      break;
    case 'tools/call': {
      const name = String(message.params?.name ?? '');
      const args = (message.params?.arguments as Record<string, unknown>) ?? {};
      result = callTool(name, args);
      break;
    }
    default:
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          error: { code: -32601, message: `Method not found: ${message.method}` },
          id: message.id,
        }),
        { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
  }

  return new Response(JSON.stringify({ jsonrpc: '2.0', result, id: message.id }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request): Promise<Response> {
  let messages: RpcRequest | RpcRequest[];
  try {
    messages = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  if (Array.isArray(messages)) {
    const responses = messages
      .filter((m) => m.id !== undefined && m.id !== null)
      .map((m) => handleMessage(m))
      .filter((r): r is Response => r !== null);
    if (responses.length === 0) return new Response(null, { status: 202, headers: CORS_HEADERS });
    const bodies = await Promise.all(responses.map((r) => r.text()));
    return new Response(`[${bodies.join(',')}]`, {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const response = handleMessage(messages);
  return response ?? new Response(null, { status: 202, headers: CORS_HEADERS });
}
