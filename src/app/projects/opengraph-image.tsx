import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Projects - Bhuvesh Singla Portfolio';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32,
              fontSize: 48,
            }}
          >
            🚀
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: 0,
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            My Projects
          </h1>

          {/* Subtitle */}
          <h2
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: '#ffffff',
              margin: 0,
              marginBottom: 24,
              lineHeight: 1.3,
            }}
          >
            Bhuvesh Singla
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: 20,
              color: '#a3a3a3',
              margin: 0,
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            Explore my portfolio of web applications, mobile apps, and
            innovative digital solutions built with modern technologies
          </p>

          {/* Project Types */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: 32,
              justifyContent: 'center',
            }}
          >
            {[
              'Web Apps',
              'Mobile Apps',
              'APIs',
              'E-commerce',
              'SaaS',
              'Open Source',
            ].map(type => (
              <div
                key={type}
                style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: 12,
                  padding: '8px 16px',
                  fontSize: 16,
                  color: '#06b6d4',
                  fontWeight: 500,
                }}
              >
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            fontSize: 18,
            color: '#6b7280',
            fontWeight: 500,
          }}
        >
          bhuvesh.com/projects
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
