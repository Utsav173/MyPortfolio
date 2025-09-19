import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { SITE_URL } from '@/lib/config';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const title = searchParams.get('title');

    if (!title) {
      return new Response('No title provided', { status: 400 });
    }

    const heading =
      title.length > 140
        ? title.substring(0, 140).split(' ').slice(0, -1).join(' ') + '...'
        : title;

    const fontBold = await fetch(
      new URL('../../../assets/fonts/Inter-Bold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundImage: 'url(https://khatriutsav.com/og-bg.png)',
            backgroundSize: '1200px 630px',
            color: '#ffffff',
            fontWeight: 700,
            padding: '80px',
          }}
        >
          <div
            style={{
              fontSize: 24,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#cbd5e1',
            }}
          >
            Utsav Khatri&apos;s Blog
          </div>
          <div
            style={{
              fontSize: 60,
              lineHeight: 1.1,
              marginTop: '20px',
              maxWidth: '1000px',
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {heading}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              left: '80px',
              fontSize: 20,
              color: '#94a3b8',
            }}
          >
            {SITE_URL.replace('https://', '')}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontBold,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
