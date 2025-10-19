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

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Top section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '32px',
                background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)',
                borderRadius: '2px',
              }}
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: '#e2e8f0',
                letterSpacing: '-0.02em',
              }}
            >
              Utsav Khatri
            </div>
          </div>

          {/* Main title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1,
              justifyContent: 'center',
              marginTop: '-80px',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1.1,
                maxWidth: '1000px',
                color: '#ffffff',
                letterSpacing: '-0.03em',
              }}
            >
              {heading}
            </div>
          </div>

          {/* Bottom section */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              {SITE_URL.replace('https://', '')}
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: i === 1 ? '#3b82f6' : '#334155',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
