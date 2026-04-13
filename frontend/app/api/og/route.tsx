import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// We fetch Poppins from raw github to reliably get TTF file in edge environment
const poppinsBoldUrl = 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf';
const poppinsRegularUrl = 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Dynamic values from URL
    const title = searchParams.get('title') || 'DeverCrowd';
    const subtitle = searchParams.get('subtitle') || 'Digital products & web development';
    const type = searchParams.get('type') || 'Article'; // 'Blog', 'Project', etc.

    // Fetch fonts concurrently
    const [poppinsBold, poppinsRegular] = await Promise.all([
      fetch(poppinsBoldUrl).then((res) => res.arrayBuffer()),
      fetch(poppinsRegularUrl).then((res) => res.arrayBuffer()),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f111a',
            backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(56, 101, 248, 0.2), rgba(15, 17, 26, 1))',
            fontFamily: 'Poppins',
          }}
        >
          {/* Subtle Grid Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 80px',
              textAlign: 'center',
            }}
          >
            {/* Category / Type Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 24px',
                marginBottom: '40px',
                borderRadius: '999px',
                border: '1px solid rgba(56, 101, 248, 0.3)',
                backgroundColor: 'rgba(56, 101, 248, 0.1)',
                color: '#3865f8', // DeverCrowd primary color
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {type}
            </div>

            {/* Title */}
            <div
              style={{
                display: 'flex',
                fontSize: 72,
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '24px',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '1000px',
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                display: 'flex',
                fontSize: 32,
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: '800px',
                textAlign: 'center',
                justifyContent: 'center',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Logo / Brand Name */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 28,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              DeverCrowd
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Poppins',
            data: poppinsBold,
            weight: 700,
            style: 'normal',
          },
          {
            name: 'Poppins',
            data: poppinsRegular,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`Error generating OG image: ${e.message}`);
    return new Response('Failed to generate image', { status: 500 });
  }
}
