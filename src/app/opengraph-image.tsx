import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Andhieka Agrestya — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andhiekaagrestya.netlify.app';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#f5e6c8',
        }}
      >
        {/* Logo */}
        <img
          src={`${SITE_URL}/logo.png`}
          width={240}
          height={240}
          alt="logo"
          style={{ borderRadius: '50%' }}
        />

        {/* Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            paddingLeft: '60px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#1a1409',
              lineHeight: 1,
              fontFamily: 'serif',
            }}
          >
            Andhieka Agrestya
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#7a4f1e',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            Software Engineer
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#a0784a',
              fontFamily: 'monospace',
              marginTop: '16px',
            }}
          >
            {SITE_URL.replace('https://', '')}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
