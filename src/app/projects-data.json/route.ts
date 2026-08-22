import projectsData from '@/lib/projects-data';

export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  const published = projectsData.filter((project) => project.published);
  return new Response(JSON.stringify(published, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
