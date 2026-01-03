import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { SITE_URL } from '@/lib/config';

export const runtime = 'edge';

const outfitBold = fetch(
  new URL(
    'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4E.ttf',
    import.meta.url
  )
).then((res) => res.arrayBuffer());

const calistogaRegular = fetch(
  new URL('https://fonts.gstatic.com/s/calistoga/v18/6NUU8F2OJg6MeR7l4e0vtA.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const title = searchParams.get('title') || 'Utsav Khatri';
    const subTitle = searchParams.get('description') || 'Developer & Designer';

    const [outfitData, calistogaData] = await Promise.all([outfitBold, calistogaRegular]);

    const heading =
      title.length > 50 ? title.substring(0, 50).split(' ').slice(0, -1).join(' ') + '...' : title;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            backgroundColor: '#030712', // ray-950
            color: 'white',
            fontFamily: '"Outfit"',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Gradients */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-10%',
              width: '40%',
              height: '80%',
              background: 'linear-gradient(135deg, #FF2E63, #FF0080)',
              filter: 'blur(150px)',
              opacity: 0.25,
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-20%',
              right: '-10%',
              width: '40%',
              height: '80%',
              background: 'linear-gradient(135deg, #00F0FF, #0077FF)',
              filter: 'blur(150px)',
              opacity: 0.25,
              borderRadius: '50%',
            }}
          />

          {/* Grid Pattern Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              opacity: 0.2,
            }}
          />

          {/* Main Content Container (Row Layout) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              padding: '60px',
              gap: '60px',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            {/* Left Column: Text */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                paddingRight: '20px',
              }}
            >
              {/* Site Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '100px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  marginBottom: '32px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#00F0FF',
                    marginRight: '10px',
                    boxShadow: '0 0 10px #00F0FF',
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    color: '#e2e8f0',
                    textTransform: 'uppercase',
                  }}
                >
                  {SITE_URL.replace(/^https?:\/\//, '')}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: 78,
                  fontFamily: '"Calistoga"',
                  lineHeight: 1.05,
                  margin: '0 0 24px 0',
                  padding: 0,
                  background: 'linear-gradient(to right, #FFFFFF, #CBD5E1)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                {heading}
              </h1>

              {/* Subtitle */}
              <div
                style={{
                  fontSize: 32,
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  maxWidth: '90%',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <div style={{ width: 40, height: 2, background: '#334155' }} />
                {subTitle}
              </div>
            </div>

            {/* Right Column: Image */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '450px',
                position: 'relative',
              }}
            >
              {/* Decorative circle behind image */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '40px',
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.01))',
                  transform: 'rotate(6deg)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />

              {/* Main Image Container */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  position: 'relative',
                  background: '#1e293b',
                }}
              >
                <img
                  src={`${req.nextUrl.origin}/images/utsav-khatri.webp`}
                  width="450"
                  height="450"
                  style={{
                    objectFit: 'cover',
                  }}
                />
                {/* Inner border/highlight */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '32px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Outfit',
            data: outfitData,
            style: 'normal',
            weight: 700,
          },
          {
            name: 'Calistoga',
            data: calistogaData,
            style: 'normal',
            weight: 400,
          },
        ],
      }
    );
  } catch (error) {
    console.error('OG Image Generation Error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
